const mongoose = require("mongoose");
const productModel = require("../Models/productModel");
const {
  isValid,
  isValidURL
} = require("./validator");

// Add products
const addProduct = async (req, res) => {
  try {
    let productData = req.body;
    if (Object.keys(productData).length === 0) {
      return res.status(400).json({ msg: "Bad request, No data founded" })
    }
    const {
      productImage,
      productName,
      category,
      description,
      price,
      rating,
      isFreeDelivery
    } = productData;

    // Product image validation
    if (!isValid(productImage) || !isValidURL(productImage)) {
      return res.status(400).json({ msg: "Valid Product Image is Required" })
    }

    // Product name validation
    if (!isValid(productName)) {
      return res.status(400).json({ msg: "THe product name is required" })
    }
    let duplicateProductName = await productModel.findOne({ productName });
    if (duplicateProductName) {
      return res.status(400).json({ msg: "Product with this name already exists" })
    }

    // Category validation
    if (!isValid(category)) {
      return res.status(400).json({ msg: "Mention product's category" })
    }
    let validCategory = ["electronics", "clothing", "food", "books", "furniture"];
    if (!validCategory.includes(category.trim().toLowerCase())) {
      return res.status(400).json({ msg: "Category of product must be either ELectronics, Clothing, Food, Books or Furniture" })
    }

    // Description validation
    if (!isValid(description)) {
      return res.status(400).json({ msg: "Mention product's description" })
    }

    // product price validation
    if (!isValid(price) || price < 0) {
      return res.status(400).json({ msg: "Mention product's price" })
    }

    // Product rating validation
    if (!isValid(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ msg: "Mention product's rating" })
    }

    // isFreeDelivery Validation
    if (productData.hasOwnProperty(isFreeDelivery)) {
      if (typeof isFreeDelivery !== "boolean") {
        return res
          .status(400)
          .json({ msg: "isFreeDelivery must be a boolean value" });
      }
    }

    let product = await productModel.create(productData);

    return res.status(201).json({ msg: "Product has been added", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
}

// Get products
const getProducts = async (req, res) => {
  try {
    let getProduct = await productModel.find();
    if (getProduct.length === 0) {
      return res.status(404).json({ msg: "No products found" })
    }
    return res.status(200).json({ msg: "Product List", count: getProduct.length, getProduct })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Internal server error", error })
  }
}

// Get products by ID
const getProductById = async (req, res) => {
  try {
    let productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid product id" })
    }

    let products = await productModel.findById(productId);

    if (!products) {
      return res.status(400).json({ msg: "no product found with given ID" })
    }

    return res.status(200).json({ msg: "Product found", products })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error", error })
  }
}

// Get products by query
const getProductByQuery = async (req, res) => {
  try {
    let {
      productName,
      category,
      minPrice,
      maxPrice,
      minRating,
      maxRating
    } = req.query;

    if (Object.keys(req.query).length === 0) {
      return res.status(400).json({
        msg: "At least provide one query parameter to search"
      })
    }

    let filter = {};

    if (productName) {
      filter.productName = { $regex: productName, $options: "i" };
    }

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (typeof minPrice !== "undefined" || typeof maxPrice !== "undefined") {
      filter.price = {}
      if (typeof minPrice !== "undefined") filter.price.$gte = Number(minPrice);
      if (typeof maxPrice !== "undefined") filter.price.$lte = Number(maxPrice);
    }

    if (typeof minRating !== "undefined" || typeof maxRating !== "undefined") {
      filter.rating = {}
      if (typeof minRating !== "undefined") filter.rating.$gte = Number(minRating);
      if (typeof maxRating !== "undefined") filter.rating.$lte = Number(maxRating); 4
    }

    if (typeof isFreeDelivery !== "undefined") {
      if (isFreeDelivery === "true") filter.isFreeDelivery = true;
      else if (isFreeDelivery === "false") filter.isFreeDelivery = false;
      else {
        return res.status(400).json({
          msg: "Invalid value for free delivery"
        })
      }
    }

    let products = await productModel.find(filter);

    if (products.length === 0) {
      return res.status(404).json({ msg: "No product found with given query" });
    }

    return res.status(200).json({
      msg: "Filtered products",
      count: products.length,
      products
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error", error })
  }
}

// Update products
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Invalid Product ID" });
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "No data provided for update" });
    }

    const {
      productImage,
      productName,
      category,
      description,
      price,
      ratings,
      isFreeDelivery,
    } = data;

    const updateData = {};

    // Product Image Validation
    if (productImage) {
      if (!isValid(productImage) || !isValidURL(productImage)) {
        return res.status(400).json({ msg: "Valid Product Image is Required" });
      }
      updateData.productImage = productImage;
    }

    // Product Name Validtion
    if (productName) {
      if (!isValid(productName)) {
        return res.status(400).json({ msg: "Product Name is required" });
      }

      const duplicateProduct = await productModel.findOne({ productName });
      if (duplicateProduct) {
        return res.status(409).json({ msg: "Product Name already exists" });
      }

      updateData.productName = productName;
    }

    // Category Validation
    if (category) {
      if (!isValid(category)) {
        return res.status(400).json({ msg: "Category is Required" });
      }

      const validCategories = [
        "electronics",
        "clothing",
        "food",
        "books",
        "furniture",
      ];
      if (!validCategories.includes(category.trim().toLowerCase())) {
        return res.status(400).json({ msg: "Invalid Category" });
      }
      updateData.category = validCategories;
    }

    // Description Validation
    if (description) {
      if (!isValid(description)) {
        return res.status(400).json({ msg: "Description is required" });
      }
      updateData.description = description;
    }

    // Price Validation
    if (price) {
      if (!isValid(price) || price < 0) {
        return res.status(400).json({ msg: "Valid Price is Required" });
      }
      updateData.price = price;
    }

    // Ratings
    if (ratings) {
      if (!isValid(ratings) || ratings < 0 || ratings > 5) {
        return res.status(400).json({ msg: "Valid Ratings is Required" });
      }
    }

    // isFreeDelivery Validation
    if (typeof isFreeDelivery !== "undefined") {
      if (typeof isFreeDelivery !== "boolean") {
        return res.status(400).json({
          msg: "isFreeDelivery must be a boolean (true or false)",
        });
      }
      updateData.isFreeDelivery = isFreeDelivery;
    }

    const update = await productModel.findByIdAndUpdate(productId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ msg: "Product Updated Successfully", update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Delete products
const deleteProducts = async (req, res) => {
  try {
    let productID = req.params.id;
    // Product ID validation
    if (!mongoose.Types.ObjectId.isValid(productID)) {
      return res.status(400).json({ msg: "Given ID is not valid" })
    }

    let deleteProduct = await productModel.findByIdAndDelete(productID, { new: true });
    if (!deleteProduct) {
      return res.status(404).json({ msg: "Product not found" })
    }
    return res.status(200).json({ msg: "This product is deleted" })
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Internal serer error" })
  }
}

module.exports = {
  addProduct,
  deleteProducts,
  getProducts,
  getProductById,
  getProductByQuery,
  updateProduct
}
