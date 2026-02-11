const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

exports.toggleWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    console.log("wishlist post is working");
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [{ product: productId }],
      });
      return res.status(201).json(wishlist);
    }

    const index = wishlist.products.findIndex(
      (p) => p.product.toString() === productId,
    );

    if (index > -1) {
      // Remove
      wishlist.products.splice(index, 1);
    } else {
      // Add
      wishlist.products.push({ product: productId });
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products.product",
    );

    if (!wishlist) {
      return res.json({ products: [] });
    }

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });

    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== req.params.productId,
    );

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
