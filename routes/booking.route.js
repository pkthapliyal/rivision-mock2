const express = require("express");
const bookingRoute = express.Router()
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.secretKey;
const { Booking } = require("../models/booking.model");
const { Flight } = require("../models/flight.model");
const { User } = require("../models/user.model");



//  Dashboard to get all the flight with the user 
bookingRoute.get("/dashboard", async (req, res) => {
    try {

        const Bookings = await Booking.find({})
            .populate("user", "name email")
            .populate("flight", "airline flightNo departure arrival departureTime arrivalTime seats price")

        res.status(200).send(Bookings)

    } catch (error) {
        res.send({ error: error.message })
    }

})


//  To post a flight 
bookingRoute.post("/booking", async (req, res) => {
    try {
        const { flight } = req.body;
        const token = req.cookies.token;

        let decoded = jwt.verify(token, secretKey);
        if (decoded) {
            const booking = await Booking({ flight, user: decoded.userID })
            await booking.save();
            return res.status(201).send({ "message": "Flight has been booked !" })
        }

    } catch (error) {
        res.send({ error: error.message })
    }

})

//  Update an individual flight by user
bookingRoute.patch("/dashboard/:id", async (req, res) => {
    try {
        const { flight } = req.body;
        await Booking.updateOne({ _id: req.params.id }, { ...req.body })

        return res.status(204).send({ "message": "Booking has been updated !" })

    } catch (error) {
        res.send({ error: error.message })
    }

})

//  Delete an individual flight by user
bookingRoute.delete("/dashboard/:id", async (req, res) => {
    try {
        await Booking.findByIdAndDelete({ _id: req.params.id })
        return res.status(202).send({ "message": "Booking has been deleted !" })

    } catch (error) {
        res.send({ error: error.message })
    }

})









module.exports = { bookingRoute }