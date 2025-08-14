import React, { useEffect, useState } from "react";
import "./Products.css";
import { getAllProducts, getProducts } from "../Services/productService";
import { FaSearch } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import LoginModal from "../Components/LoginModal";
import SignupModal from "../Components/SignupModal";

function Products() {

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const openSignupModal = () => setShowSignupModal(true);
    const closeSignupModal = () => setShowSignupModal(false);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const [query, setQuery] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProducts()
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getAllProducts();
            // console.log(res.data.getProduct)
            setProducts(res.data.getProduct);

            const initialQuantities = {};
            res.data.getProduct.forEach((product) => {
                initialQuantities[product._id] = 1;
            })

            setQuantities(initialQuantities);

            setLoading(false);
        } catch (error) {
            console.log("Error fetching products: ", error);
            setLoading(false);
        }
    }

    const fetchProductsByQuery = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            fetchProducts();
            return;
        };
        try {
            const res = await getProducts(query);
            setProducts(res.data.products);

        } catch (error) {
            console.log("Error fetching products: ", error);
        }
    }

    const handleQuantityhange = (productId, value) => {
        if (value >= 1) {
            setQuantities((prev) => ({ ...prev, [productId]: value }))
        }
    }

    return (
        <>
            <Navbar openLogin={openLoginModal} />

            {showLoginModal && (
                <LoginModal
                    closeModal={closeLoginModal}
                    openSignupModal={() => {
                        closeLoginModal();
                        openSignupModal();
                    }}
                />
            )}

            {showSignupModal && (
                <SignupModal
                    closeModal={closeSignupModal}
                    openLoginModal={() => {
                        closeSignupModal();
                        openLoginModal();
                    }}
                />
            )}

            <div className="container">

                <form className="search-form">
                    <input
                        type="search"
                        id="search-box"
                        placeholder="Search Here....."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={(e) => fetchProductsByQuery(e)}><FaSearch /></button>
                </form>

                {loading && <h3>Loading Products...</h3>}

                <div className="product-container">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <img
                                src={product.productImage}
                                alt={product.productName}
                                className="product-image"
                            />
                            <h3>{product.productName}</h3>
                            <p>Category: {product.category}</p>
                            <p>Price: ₹{product.price}</p>
                            <p>Rating: ⭐ {product.rating}</p>
                            <p>{product.description}</p>
                            {product.isFreeDelivery && (
                                <p style={{ color: "green", fontWeight: "bold" }}>Free Delivery</p>
                            )}
                            {token && (
                                <div className="quantity-control">
                                    <button
                                        onClick={() =>
                                            handleQuantityhange(
                                                product._id,
                                                Math.max(1, quantities[product._id] - 1)
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantities[product._id]}
                                        onChange={(e) =>
                                            handleQuantityhange(
                                                product._id,
                                                Math.max(1, Number(e.target.value))
                                            )
                                        }
                                    />
                                    <button
                                        onClick={() =>
                                            handleQuantityhange(
                                                product._id,
                                                quantities[product._id] + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Products;