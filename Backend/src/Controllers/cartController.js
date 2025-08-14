const mongoose = require("mongoose");
const cartModel = require("../Models/cartModel");
const productModel = require("../Models/productModel");
const { isValid } = require("./validator");

// Add to cart
const addToCart = async (req, res) => {
    try {
        let userId = req.user.userId

        // UserID VAlidation
        if (!isValid(userId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Valid UserID is required" })
        }

        let { productId, quantity } = req.body;

        // prductID Validation
        if (!isValid(productId) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ msg: "Valid productID is required" })
        }

        let product = await productModel.findById(productId);
        console.log(product);

        // Quantity Validation
        if (
            !isValid(quantity) ||
            typeof quantity !== "number" ||
            quantity < 1 ||
            !Number.isInteger(quantity)
        ) {
            return res.status(400).json({ msg: "Valid quantity is required" })
        }

        if (!product) {
            return res.status(404).json({ msg: "product not found" })
        }

        let cart = await cartModel.findOne({ userId })

        if (!cart) {
            cart = await cartModel.create({
                userId,
                items: [{ productId, quantity }],
                totalItems: 1,
                totalPrice: product.price * quantity,
            });
        } else {
            let found = false;

            cart.items = cart.items.map((item) => {
                if (item.productId.toString() === productId) {
                    found = true;
                    item.quantity += quantity;
                }
                return item;
            });

            if (!found) {
                cart.items.push({ productId, quantity });
            }

            cart.totalItems = cart.items.length;

            const populated = await cart.populate("items.productId", "price");
            cart.totalPrice = await populated.items.reduce(
                (sum, item) => sum + item.productId.price * item.quantity,
                0
            );
        }

        await cart.save();
        return res.status(200).json({ msg: "Item Added to cart", cart })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error", error });
    }
}

// Get cart
const getCart = async (req, res) => {
  try {
    let userId = req.user.userId;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId", "productName productImage price");

    if (!cart) {
      return res.status(404).json({ msg: "Cart is Empty" });
    }
    return res.status(200).json({ msg: "Cart Fetched Successfully", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Update cart
const updateCart = async (req, res) => {
  try {
    let userId = req.user.userId;
    let { productId, quantity } = req.body;

    // ProductId Validation
    if (!isValid(productId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Valid ProductId is Required" });
    }

    // Quantity Validation
    if (
      !isValid(quantity) ||
      typeof quantity !== "number" ||
      quantity < 1 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({ msg: "Valid Quantity is Required" });
    }

    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart Not Found" });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ msg: "Product Not Found in Cart" });
    }

    if (quantity === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }

    cart.totalItems = cart.items.length;

    const populated = await cart.populate("items.productId", "price");
    cart.totalPrice = populated.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json({ msg: "Cart Updated Successfully", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    let userId = req.user.userId;
    let { productId } = req.params;

    // ProductId Validation
    if (!isValid(productId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Valid ProductId is Required" });
    }

    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not Foumd" });
    }

    const productExists = cart.items.some(
      (item) => item.productId.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({ msg: "Product Not Found In Cart" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    cart.totalItems = cart.items.length;

    const populated = await cart.populate("items.productId", "price");
    cart.totalPrice = populated.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    await cart.save();
    return res
      .status(200)
      .json({ msg: "Product Removed From Cart Successfully", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart Not Found" });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();
    return res.status(200).json({ msg: "Cart Cleared Successfully", cart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeItemFromCart,
    clearCart
};