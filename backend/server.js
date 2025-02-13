const dotenv = require("dotenv").config();
const express = require("express");
const errorHandler = require("./middleware/errorHandler.js");
const connectDb= require("./config/dbConnection.js")
connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/Contacts",require("./routes/contactsRoute.js"));
app.use("/api/Users",require("./routes/usersRoute.js"));

app.use(errorHandler)

app.listen(port, ()=>{
    console.log(`Callback function: App is listened at port ${port}`)
})

