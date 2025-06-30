const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();

const metalConfig = require("./routes/metalConfigData");

// Creating express app:
const app = express();
const port = process.env.PORT || 4000;

// MIDDLEWARES:
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

//ROUTES:
app.use("/api", metalConfig);

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
