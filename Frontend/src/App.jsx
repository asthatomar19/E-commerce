import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import Cart from "./Pages/Cart"
import Products from "./Pages/Products"
import AddProducts from "./Pages/AddProducts";
import Order from "./Pages/Order";
import Profile from "./Pages/Profile";
import {ToastContainer} from "react-toastify"

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/addproducts" element={<AddProducts />} />
                    <Route path="/order" element={<Order />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer position="top-center" autoClose={2000} />
        </>
    )
}

export default App;