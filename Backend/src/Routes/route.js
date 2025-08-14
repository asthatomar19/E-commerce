const router = require("express").Router()
const {
    addUsers,
    updateUsers,
    getUsers,
    getDataByGender,
    deleteUsers,
    loginUser
} = require("../Controllers/userController");

const {
    addProduct,
    deleteProducts,
    getProducts,
    getProductById,
    getProductByQuery,
    updateProduct,
} = require("../Controllers/productController");

const authMiddleware = require("../Middleware/authMiddleware");

const {
    addToCart,
    getCart,
    updateCart,
    removeItemFromCart,
    clearCart
} = require("../Controllers/cartController");

const {
    placeOrder,
    getMyOrder,
    cancelOrder
} = require("../Controllers/orderController");

// User
router.post("/addUsers", addUsers);
router.get("/getUser", authMiddleware, getUsers);
router.get("/getUserByGender", authMiddleware, getDataByGender);
router.put("/updateUsers/:id", authMiddleware, updateUsers);
router.delete("/deleteUser/:id", authMiddleware, deleteUsers);
router.post("/loginUser", loginUser)

// Product
router.post("/addProduct", authMiddleware, addProduct);
router.get("/getProducts", getProducts);
router.get("/getProductById/:id", getProductById);
router.get("/getProductByQuery", getProductByQuery);
router.put("/updateProduct/:id", authMiddleware, updateProduct);
router.delete("/deleteProduct/:id", authMiddleware, deleteProducts);

// Cart
router.post("/addToCart", authMiddleware, addToCart);
router.get("/getCart", authMiddleware, getCart);
router.put("/updateCart", authMiddleware, updateCart);
router.delete("/removeItem/:id", authMiddleware, removeItemFromCart);
router.delete("/clearCart", authMiddleware, clearCart);

// Order
router.post("/placeOrder", authMiddleware, placeOrder);
router.get("/getMyOrder", authMiddleware, getMyOrder);
router.delete("/cancelOrder", authMiddleware, cancelOrder);

module.exports = router;