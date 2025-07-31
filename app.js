const express = require("express");

const app = express();

const sequelize = require("./config/db");
const productRoutes = require("./routes/product");

app.use(express.json());

app.use("/products", productRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
});
