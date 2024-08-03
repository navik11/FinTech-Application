import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/ApiErrorRes.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { Password } from "../services/password.service.js";
import dotenv, { configDotenv } from "dotenv";
import axios from "axios";

dotenv.config({ path: "././.env" });

const login = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).send(new ApiError(500, errors.array()[0].msg, errors.array()));
    }

    const { username, password } = req.body
    const account_number = parseInt(username) ? parseInt(username) : -1;

    const query = `
        query getUsers {
        users(where: {_or : [{account_number: {_eq: ${account_number}}}, {username: {_eq: "${username}"}}] }) {
            name
            password
            username
            account_number
        }
        }
    `;

    let user;
    await axios.post(
        process.env.HASURA_URL,
        { query: query },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.data.users.length === 0) {
                return res.status(400).send(new ApiError(400, "User not found"));
                return new ApiError(400, "User not found");
            }
            user = response.data.data.users[0];
        })

    const isPasswordCorrect = await Password.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send(new ApiError(400, "Invalid credentials"));
        return new ApiError(400, "Invalid credentials");
    }

    const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: process.env.SESSION_EXPIRY });

    const httpOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res.status(200)
        .cookie("accessToken", accessToken, httpOptions)
        .send(new ApiResponse(200, { username, accessToken }, "User logged in successfully"));

});

const logout = asyncHandler(async (req, res) => {

    const httpOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };

    return res.status(200)
        .clearCookie("accessToken", httpOptions)
        .clearCookie("refreshToken", httpOptions)
        .send(new ApiResponse(200, {}, "User logged out successfully"));

});

function generateNumber() {
    const prefix = '6307009';
    const suffix = Math.floor(10000 + Math.random() * 90000).toString(); // Generates a random 5-digit number
    return prefix + suffix;
}

const createUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(new ApiError(400, errors.array()[0].msg, errors.array()));
    }

    const { name, username, balance, address, password } = req.body;

    const query = `
        query getUsers {
        users(where: {username: {_eq: ${username}}}) {
            name
            password
            username
            account_number
        }
        }
    `;

    await axios.post(
        process.env.HASURA_URL,
        { query: query },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.data.users.length != 0) {
                return res.status(400).send(new ApiError(400, "Username already taken"));
            }
        })

    const account_number = generateNumber();
    // while ac-no exists in db, generate new ac-no

    const hashedPassword = await Password.hash(password);
    const mutation = `
        mutation AddUser {
            insert_users_one(object: {
            name: "${name}", 
            username: "${username}", 
            balance: ${balance}, 
            address: "${address}", 
            password: "${hashedPassword}",
            account_number: "${account_number}",
            refresh_token: "null"
            }) {
            id
            name
            username
            balance
            address
            account_number
            created_at
            updated_at
            }
        }
    `;

    let query_result;
    await axios.post(
        process.env.HASURA_URL,
        { query: mutation },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.errors) {
                return res.status(400).send(new ApiError(400, response.data.errors[0].message, response.data.errors));
            }
            query_result = response.data.data.insert_users_one;
        })

    return res.status(201).send(new ApiResponse(201, query_result, "User created successfully"));
});

const deposit = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(new ApiError(400, errors.array()[0].msg, errors.array()));
    }

    const { amount, password } = req.body;

    const isPasswordCorrect = await Password.compare(password, req.user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send(new ApiError(400, "Invalid password"));
    }

    const mutation = `
    mutation deposit {
        insert_transactions(objects: {amount: ${amount}, from: 0, to: ${req.user.account_number}}) {
        returning {
            id
            amount
            from
            to
            created_at
        }
        }
        update_users(where: {account_number: {_eq: ${req.user.account_number}}}, _inc: {balance: ${amount}}) {
        returning {
            name
            username
            account_number
            balance
            updated_at
        }
        }
    }
    `;

    let query_result;
    await axios.post(
        process.env.HASURA_URL,
        { query: mutation },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.errors) {
                return res.status(400).send(new ApiError(400, response.data.errors[0].message, response.data.errors));
            }
            query_result = response.data;
        })
        .catch(err => {
            return res.status(400).send(new ApiError(400, err.message, err));
        })

    return res.status(201).send(new ApiResponse(201, query_result, "User created successfully"));
});

const withdraw = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(new ApiError(400, errors.array()[0].msg, errors.array()));
    }

    const { amount, password } = req.body;

    if (req.user.balance < amount) {
        return res.status(400).send(new ApiError(400, "Insufficient balance"));
    }

    const isPasswordCorrect = await Password.compare(password, req.user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send(new ApiError(400, "Invalid password"));
    }

    const mutation = `
    mutation deposit {
        insert_transactions(objects: {amount: ${amount}, from: ${req.user.account_number}, to: 0}) {
        returning {
            id
            amount
            from
            to
            created_at
        }
        }
        update_users(where: {account_number: {_eq: ${req.user.account_number}}}, _inc: {balance: ${-1 * amount}}) {
        returning {
            name
            username
            account_number
            balance
            updated_at
        }
        }
    }
    `;

    let query_result;
    await axios.post(
        process.env.HASURA_URL,
        { query: mutation },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.errors) {
                return res.status(400).send(new ApiError(400, response.data.errors[0].message, response.data.errors));
            }
            query_result = response.data;
        })
        .catch(err => {
            return res.status(400).send(new ApiError(400, err.message, err));
        })

    return res.status(201).send(new ApiResponse(201, query_result, "User created successfully"));
});

const transfer = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(new ApiError(400, errors.array()[0].msg, errors.array()));
    }

    const { amount, to, password } = req.body;

    if (req.user.balance < amount) {
        return res.status(400).send(new ApiError(400, "Insufficient balance"));
    }

    const isPasswordCorrect = await Password.compare(password, req.user.password);
    if (!isPasswordCorrect) {
        return res.status(400).send(new ApiError(400, "Invalid password"));
    }

    const query = `
        query getUsers {
        users(where: {account_number: {_eq: ${to}}}) {
            name
            password
            username
            account_number
        }
        }
    `;

    let receiver_user;
    await axios.post(
        process.env.HASURA_URL,
        { query: query },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.data.users.length === 0) {
                return res.status(400).send(new ApiError(400, "Receiver not found"));
            }
            receiver_user = response.data.data.users[0];
        })

    const mutation = `
    mutation deposit {
        insert_transactions(objects: {amount: ${amount}, from: ${req.user.account_number}, to: ${to}}) {
        returning {
            id
            amount
            from
            to
            created_at
        }
        }
        sender: update_users(where: {account_number: {_eq: ${req.user.account_number}}}, _inc: {balance: ${-1 * amount}}) {
        returning {
            name
            username
            account_number
            balance
            updated_at
        }
        }
        receiver: update_users(where: {account_number: {_eq: ${to}}}, _inc: {balance: ${amount}}) {
        returning {
            name
            username
            account_number
            balance
            updated_at
        }
        }
    }
    `;

    let query_result;
    await axios.post(
        process.env.HASURA_URL,
        { query: mutation },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.errors) {
                return res.status(400).send(new ApiError(400, response.data.errors[0].message, response.data.errors));
            }
            query_result = response.data.data;
        })
        .catch(err => {
            return res.status(400).send(new ApiError(400, err.message, err));
        })

    return res.status(201).send(new ApiResponse(201, query_result, "User created successfully"));
});

const getTransactions = asyncHandler(async (req, res) => {
    const user = req.user;

    const query = `
        query MyQuery @cached {
            transactions(where: {_or: [{to: {_eq: ${user.account_number}}}, {from: {_eq: ${user.account_number}}}]}, order_by: {created_at: desc}) {
            id
            from
            to
            created_at
            amount
            }
        }
    `;

    let transactions;
    await axios.post(
        process.env.HASURA_URL,
        { query: query },
        {
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
            },
        }
    )
        .then(response => {
            if (response.data.errors) {
                return res.status(400).send(new ApiError(400, response.data.errors[0].message, response.data.errors));
            }
            transactions = response.data;
        })

    return res.status(201).send(new ApiResponse(201, transactions, "Fetched transactions successfully"));
});

export { login, logout, createUser, deposit, withdraw, transfer, getTransactions };