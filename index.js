const express = require("express");
const port = 3030;
const cookiesParser = require("cookie-parser")
const app = express();
const { connection } = require("./config/db")

//  swagger set-up ;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Air Ticket Booking Documentation',
            version: '1.0.0',
        },
        servers: [
            {
                url: "http://localhost:3030/"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // files containing annotations as above
};

const specification = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specification));
//  middleware

app.use(express.json());
app.use(cookiesParser())

//  routers 
const { userRoute } = require("./routes/user.route");
const { bookingRoute } = require("./routes/booking.route");
const { flightRoute } = require("./routes/flight.route")

app.use("/api", userRoute);
app.use("/api", flightRoute);
app.use("/api", bookingRoute)


app.listen(port, async () => {
    try {
        await connection;
        console.log("server is listening at", port)

    } catch (error) {
        console.log(error.message)
    }
})