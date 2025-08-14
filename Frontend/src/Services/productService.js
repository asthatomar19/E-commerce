import axios from "./axiosConfig";

export const getAllProducts = async () => {
    return await axios.get("/getProducts");
}

export const addProducts = async (products) => {
    return await axios.post("/addProduct", products, {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    });
}

export const getProducts = async (query) => {
    return await axios.get("/getProductByQuery", {
        params: {
            productName: query
        }
    })
}

export const deleteProduct = async (productId) => {
    return await axios.delete(`/deleteProduct/${productId}`, {
        headers: {
            Authorization: localStorage.getItem("token")
        }
    })
}

export const updateProduct = async(productId)=>{
    return await axios.put(`/updateProduct/${productId}`,{
        headers:{
            Authorization: localStorage.getItem("token")
        }
    })
}