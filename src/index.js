// require("dotenv").config({path: './env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 8000;

connectDB()
.then( () => {
    app.on("error", (err) => {
        console.log("ERROR connecting to the server: ", err);
        process.exit(1);
    })

    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    })
})
.catch((err) => {
    console.log("ERROR connecting to database: ", err);
})

















//First Approach - 

/*
import express from "express"

const app = express();

//IIFEs - Immediately Invoked Function Expressions
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", ( error ) => {
            console.log("ERROR: ", error)
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR: ", error);
        throw error
    }
} )()
*/