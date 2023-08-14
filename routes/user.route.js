const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretKey;
const userRoute = express.Router()
const { User } = require("../models/user.model")



/**
 * @swagger
 * components:
 *  schemas:
 *     User:
 *      type: object
 *      properties:
 *          id:
 *              type: string
 *              description: The auto-generated id of user
 *          name:
 *              type: string
 *              description: The user name
 *          email:
 *              type: string
 *              description: The user email
 *          password:
 *              type: string
 *              description : Password of a user
 *
 *
 */









/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             example:
 *               message: You have been registered
 *       400:
 *         description: Bad request - some fields are missing or incorrect
 *         content:
 *           application/json:
 *             example:
 *               error: Please fill all details
 */

userRoute.post("/register", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {

            return res.status(403).send({ "error": "user already exists!!" })

        }
        const { name, email, password } = req.body;
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(404).send({ "error": err.message })
            }
            user = await User({ name, email, password: hash })
            await user.save();
            return res.status(201).send({ "massage": "User has been registerd" })
        })


    } catch (error) {
        res.send({ error: error.message })
    }


})



/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user based on email and password
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successfully
 *               token: <generated_token>
 *       403:
 *         description: Wrong credentials or user not found
 *         content:
 *           application/json:
 *             example:
 */


//  login 
userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(403).send({ "error": "Wrong credentials" })
    }
    bcrypt.compare(password, user.password, async (err, result) => {
        if (result) {
            let token = jwt.sign({ user: user.email, userID: user._id }, secretKey)
            res.cookie("token", token)
            return res.status(201).send({ "massage": "login Successfully", "token": token })
        }
        else {
            return res.status(403).send({ "error": err.message })
        }
    })

})





module.exports = { userRoute }