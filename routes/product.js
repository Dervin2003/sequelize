const express = require("express");
const router = express.Router();

const productController = require("../controller/product");

router.post("/create", productController.createProduct);
router.get("/get", productController.getProducts);
router.get("/get/one", productController.getProduct);
router.put("/update/:id", productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.get("/search", productController.searchProducts);

module.exports = router;
