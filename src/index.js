const express = require("express"); // import express server module

// acquire dotenv library config
require("dotenv").config();

// import router(s)
const mainRouter = require("./routers/main-router");

// initialize express app
const app = express();

// middleware to parse JSON
app.use(express.json());

// incorporating the router(s)
app.use(mainRouter);

// start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
