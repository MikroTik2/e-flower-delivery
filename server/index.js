const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 4000;

const { notFound, errorHandler } = require("./middlewares/errorHandler");

const dbConnect = require("./config/dbConnect");
dbConnect();

//ROUTES
const authRoutes = require("./routes/authRoutes.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server working on ${PORT}`);
});