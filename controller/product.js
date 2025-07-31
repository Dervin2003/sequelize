const Product = require("../models/product");
const { Op } = require("sequelize");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const product = await Product.findOrCreate({
      where: { name, price, description },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Create failed" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
};

exports.getProduct = async (req, res) => {
  console.log("reqreqreqreq", req.query.id);
  const product = await Product.findOne({
    where: {
      id: req.query.id,
      // name: req.query.name,
    },
  });
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Not found" });

    await product.update({ name, price, description });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Not found" });

    await product.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};

exports.searchProducts = async (req, res) => {
  const { keyword, minPrice, maxPrice } = req.query;

  const products = await Product.findAll({
    where: {
      // name: { [Op.iLike]: `%${keyword}%` },
      price: {
        [Op.between]: [minPrice || 0, maxPrice || 10000],
      },
    },
  });
  res.json(products);
};

// const expensiveProducts = await Product.findAll({
//   where: {
//     price: { [Op.gt]: 1000 },
//   },
// });
