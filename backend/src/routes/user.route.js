import { Router } from "express";
import { createUser, deposit, getTransactions, login, logout, transfer, withdraw } from "../controllers/user.controller.js";
import { body } from 'express-validator';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiErrorRes.js";

const router = Router();

router.route("/login").post(
    body("username")
        .notEmpty()
        .withMessage("Please enter username or account number"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password cannot be empty"),
    login
);

router.route("/logout").post(verifyJWT, logout);

router.route("/createUser").post(
    body("name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a name of record"),
    body("username")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid username of record"),
    body("balance")
        .isInt()
        .withMessage("Please provide intial account ballance"),
    body("address")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid address"),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid password"),
    createUser
);

router.route("/deposit").post(
    verifyJWT,
    body("amount")
        .isInt()
        .withMessage("Please provide a valid amount to deposit")
        .isInt({ gt: 99 })
        .withMessage("Deposit amount must be more than Rs. 99"),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid password"),
    deposit
);

router.route("/withdraw").post(
    verifyJWT,
    body("amount")
        .isInt()
        .withMessage("Please provide a valid amount to deposit"),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid password"),
    withdraw
);

router.route("/transfer").post(
    verifyJWT,
    body("amount")
        .isInt()
        .withMessage("Please provide a valid amount to deposit"),
    body("to")
        .isInt()
        .withMessage("Please provide a valid account number to transfer"),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a valid password"),
    transfer
);

router.route("/getuser").get(
    verifyJWT,
    (req, res) => {
        const user = req.user;
        user.password = undefined;
        return res.status(200).json(new ApiResponse(200, user, "User details fetched successfully"));
    }
);

router.route("/get_transactions").get(
    verifyJWT,
    getTransactions
);

export default router;