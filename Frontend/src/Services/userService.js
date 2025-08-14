import axios from "./axiosConfig";

// Login API call
export const loginUser = async (userData) => {
    return await axios.post("/loginUser", userData);
}

// SignUp API call
export const SignupUser = async (userData) => {
    return await axios.post("/addUsers", userData);
}









  











