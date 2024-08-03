import jwt, { decode } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { users } from "../db/index.js";
import { ApiError } from "../utils/ApiErrorRes.js";
import axios from "axios";

dotenv.config({ path: "././.env" });

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) res.status(400).send(new ApiError(401, "Unauthorised request"));

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const query = `
        query getUsers {
        users(where: {username: {_eq: "${decodedToken?.username}"}}) {
            name
            password
            username
            account_number
            balance
            address
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
                return res.status(400).send(new ApiError(400, "Invalid access token"));
            }
            user = response.data.data.users[0];
        })

    req.user = user;
    next();
});
