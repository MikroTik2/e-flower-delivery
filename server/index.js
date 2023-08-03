const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 4000;

const { notFound, errorHandler } = require("./middlewares/errorHandler");

const dbConnect = require("./config/dbConnect");
dbConnect();

//ROUTES
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category-product", productCategoryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server working on ${PORT}`);
});