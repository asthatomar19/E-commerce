import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addProducts } from "../Services/productService";
import "./AddProducts.css";
import Navbar from "../Components/Navbar";
import LoginModal from "../Components/LoginModal";
import SignupModal from "../Components/SignupModal";

function AddProducts() {

    const token = localStorage.getItem("token")
    
    

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => setShowLoginModal(false);

    const openSignupModal = () => setShowSignupModal(true);
    const closeSignupModal = () => setShowSignupModal(false);

    const [products, setProducts] = useState({
        productImage: "",
        productName: "",
        category: "",
        description: "",
        price: 0,
        rating: 0,
        isFreeDelivery: true,
    });

    const handleChange = (e) => {
        setProducts({ ...products, [e.target.name]: e.target.value })
    }

    const handleImgChange = (e) => {
        // console.log(e.target.files[0]);

        const file = e.target.files[0];

        if (file) {
            const readFile = new FileReader();

            readFile.onloadend = () => {
                setProducts((prev) => ({
                    ...prev,
                    image: readFile.result,
                }));
            };
            readFile.readAsDataURL(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await addProducts(products);
            toast.success(res.data.msg);
            setProducts({
                productImage: "",
                productName: "",
                category: "",
                description: "",
                price: 0,
                rating: 0,
                isFreeDelivery: true,
            })
        } catch (error) {
            toast.error(error.response?.data?.msg || "Product can not be uploaded");
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
            <div className="addProducts" style={{ marginTop: "100px" }}>

                <h1 style={{ color: "#C04000" }}>ADD NEW PRODUCT</h1>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="innerForm">
                        <label htmlFor="productImg">Upload Product's Image :</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="productImg"
                            onChange={handleImgChange}
                        />
                        <label htmlFor="productName">Product's name :</label>
                        <input
                            type="text"
                            name="name"
                            id="productName"
                            value={products.name}
                            placeholder="Enter the name of product"
                            onChange={handleChange}
                        />
                        <label htmlFor="category">Select Product's category :</label>
                        <select id="category" name="category" value={products.category} onChange={handleChange}>
                            <option value="">Category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="food">Food</option>
                            <option value="books">Books</option>
                            <option value="furniture">Furniture</option>
                        </select>
                        <label htmlFor="description">Product's description</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={products.description}
                            placeholder="Enter the description of product"
                            onChange={handleChange}
                        />
                        <label htmlFor="price">Product's price</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={products.price}
                            placeholder="Enter the price of product"
                            onChange={handleChange}
                        />
                        <label htmlFor="rating">Product's rating</label>
                        <input
                            type="number"
                            name="rating"
                            id="rating"
                            value={products.rating}
                            placeholder="Enter the rating(0-5) of product"
                            onChange={handleChange}
                        />
                    </div>
                    <label>
                        <input
                            type="checkbox"
                            name="isFreeDelivery"
                            value={products.isFreeDelivery}
                            placeholder="Enter the description of product"
                            onChange={handleChange}
                        />
                        Is Free Delivery
                    </label>
                    {token && (
                        <>
                            <button
                                className="btn"
                                type="submit"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </form>
            </div>
        </>
    )
}

export default AddProducts;