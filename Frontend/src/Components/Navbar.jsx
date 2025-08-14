import React from "react";
import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";


function Navbar({openLogin}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        toast.success("Logged Out Successfully");
        navigate("/products");
    };
    return (
        <div className="navbar">
            <div className="navbar-logo">
                ShopNow
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/products">Products</Link>
                </li>
                <li>
                    <Link to="/addproducts">Add Products</Link>
                </li>
                <li>
                    <Link to="/cart"><FaShoppingCart /></Link>
                </li>
                <li>
                    <Link to="/order">My Orders</Link>
                </li>
                <li>
                    <Link to="/profile"><FaUser /></Link>
                </li>

                <li>
                    {token ? (
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    ) : (
                        <button onClick={openLogin} className="login-btn">
                            Login
                        </button>
                    )}
                </li>
            </ul>
        </div>
    )
}

export default Navbar