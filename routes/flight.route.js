const express = require("express");
const flightRoute = express.Router()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const secretKey = process.env.secretKey;
const { Flight } = require("../models/flight.model")


/**
 * @swagger
 * components:
 *  schemas:
 *      Flight:
 *       type: object
 *       properties:
 *          id:
 *              type: string
 *              description: The auto-generated nject id by mongoose
 *          airline:
 *              type: string
 *              description: The name of the flight
 *          flighNo:
 *              type: string
 *              description: The number of the flight
 *          departure:
 *              type: string
 *              description: The place of departure
 *          arrival:
 *              type: string
 *              description: The place of arrival
 *          departureTime:
 *              type: date
 *              description: The date of deaprture of the flight
 *          arrivalTime:
 *              type: date
 *              description: The date of arrival
 *          seats:
 *              type: integer
 *              description: The total no of seates on the flight
 *          price:
 *              type: integer
 *              description: The price of the flight
 */



/**
 * @swagger
 *  /flights:
 *   get:
 *     summary: Get All the flights
 *     description:  Get all the flights here;
 *     tags:
 *       - Flights
 *     responses:
 *       200:
 *          description: Getting all the Flights
 *       404:
 *          description: Page not found
 *          
 */

// Get route for all the flights
flightRoute.get("/flights", async (req, res) => {
    try {
        const flights = await Flight.find()
        res.status(200).send(flights)
    } catch (error) {
        res.status(404).send({ error: error.message })
    }

})

/**
 * @swagger
 *  /flights:{id}:
 *   get:
 *     summary: Get the single flights
 *     description:  Get all the flights here;
 *     tags:
 *       - Flights
 *     responses:
 *       200:
 *          description: Getting all the Flights
 *       404:
 *          description: Page not found
 *          
 */

// Get Individual flight by the id 
flightRoute.get("/flights/:id", async (req, res) => {
    try {
        const flights = await Flight.findOne({ _id: req.params.id })
        res.status(200).send(flights)

    } catch (error) {
        res.send({ error: error.message })
    }

})



//  post route
flightRoute.post("/flights", async (req, res) => {
    try {
        const { airline, flightNo, departure, arrival, departureTime,
            arrivalTime, seats, price } = req.body;

        const flight = new Flight({
            airline, flightNo, departure, arrival, departureTime,
            arrivalTime, seats, price
        })

        await flight.save();
        return res.status(200).send({ "message": "Flight has been added !" })

    } catch (error) {
        res.send({ error: error.message })
    }

})

/**
 * @swagger
 * /flights/{id}:
 *   patch:
 *     summary: Update a flight for the authorized user
 *     description: Update a book associated with the authorized user using its ID
 *     tags:
 *       - Flights
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the flight to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               flightNo:
 *                 type: string
 *               departure:
 *                 type: string
 *               arrival:
 *                 type: string
 *               departureTime:
 *                 type: string
 *               arrivalTime:
 *                 type: string
 *               seats:
 *                 type: integer
 *               price:
 *                 type: integer
 *             required:
 *               - name
 *               - flightNo
 *               - departure
 *               - arrival
 *               - departureTime
 *               - arrivalTime
 *               - seats
 *               - price
 *     responses:
 *       203:
 *         description: Book successfully updated
 *         content:
 *           application/json:
 *             example:
 *               message: Book updated successfully
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               error: You are not authorized!
 * securitySchemes:
 *   BearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */


//  Edit Flight 
flightRoute.patch("/flights/:id", async (req, res) => {
    try {
        const { airline, flightNo, departure, arrival, departureTime,
            arrivalTime, seats, price } = req.body;

        await Flight.updateOne({ _id: req.params.id }, {
            airline, flightNo, departure, arrival, departureTime,
            arrivalTime, seats, price
        })
        return res.status(204).json({ "message": "Flight has been edited !" })
    } catch (error) {
        res.send({ error: error.message })
    }

})



//  Delete A flight 
flightRoute.delete("/flights/:id", async (req, res) => {
    try {
        await Flight.findByIdAndDelete({ _id: req.params.id })
        res.status(202).send({ "message": "Flight has been deleted !" })
    } catch (error) {
        res.send({ error: error.message })
    }

})






module.exports = { flightRoute }
