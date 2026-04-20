const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    const structuredProducts = products.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      rating: parseFloat(p.rating),
      inStock: !!p.inStock,
      featured: !!p.featured,
      trending: !!p.trending,
      specs: {
        caseSize: p.caseSize,
        movement: p.movement,
        waterResistance: p.waterResistance,
        powerReserve: p.powerReserve,
        caseMaterial: p.caseMaterial,
      },
    }));

    res.json(structuredProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database Error", details: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const structuredProduct = {
        ...product,
        price: parseFloat(product.price),
        rating: parseFloat(product.rating),
        inStock: !!product.inStock,
        featured: !!product.featured,
        trending: !!product.trending,
        specs: {
          caseSize: product.caseSize,
          movement: product.movement,
          waterResistance: product.waterResistance,
          powerReserve: product.powerReserve,
          caseMaterial: product.caseMaterial,
        },
      };
      res.json(structuredProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database Error", details: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
