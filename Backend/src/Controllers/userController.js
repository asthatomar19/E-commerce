const userModel = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const {
  isValid,
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidContact,
} = require("./validator");


// Add Users:-

const addUsers = async (req, res) => {
  try {
    let userData = req.body;
    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    const {
      userName,
      userEmail,
      userPassword,
      userAddress,
      userContact,
      Gender,
      Age,
    } = userData;

    // UserName Validation :-
    if (!isValid(userName)) {
      return res.status(400).json({ msg: "User Name is Required" });
    }
    if (!isValidName(userName)) {
      return res.status(400).json({ msg: "Invalid User Name" });
    }

    // UserEmail Validation :-
    if (!isValid(userEmail)) {
      return res.status(400).json({ msg: "User Email is Required" });
    }

    if (!isValidEmail(userEmail)) {
      return res.status(400).json({ msg: "Invalid User Email" });
    }

    let duplicateEmail = await userModel.findOne({ userEmail });
    if (duplicateEmail) {
      return res.status(400).json({ msg: "Email Already Exists" });
    }

    // UserPassword Validation :-
    if (!isValid(userPassword)) {
      return res.status(400).json({ msg: "UserPassword is Required" });
    }

    if (!isValidPassword(userPassword)) {
      return res.status(400).json({ msg: "Password must be 6-20 characters,1 uppercase,1 lowercase,1 number and 1 special character" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(userPassword, salt);

    // UserAddress Validation :-
    if (!isValid(userAddress)) {
      return res.status(400).json({ msg: "UserAddress is Required" });
    }

    // UserContact Validation :-
    if (!isValid(userContact)) {
      return res.status(400).json({ msg: "User Contact is Required" });
    }

    if (!isValidContact(userContact)) {
      return res.status(400).json({ msg: "Invalid User Contact" });
    }

    let duplicateContact = await userModel.findOne({ userContact });
    if (duplicateContact) {
      return res.status(400).json({ msg: "User Contact Is Already Exists" });
    }

    // User Gender Validation :-
    if (!isValid(Gender)) {
      return res.status(400).json({ msg: "Gender is Required" });
    }
    let validGender = ["male", "female", "other"];
    if (!validGender.includes(Gender.trim().toLowerCase())) {
      return res.status(400).json({ msg: "Gender must be either male, female or others" })
    }

    // User Age Validation :-
    if (!isValid(Age)) {
      return res.status(400).json({ msg: "User Age is Required" });
    }

    let user = await userModel.create({
      userName,
      userEmail,
      userPassword: hashedPassword,
      userAddress,
      userContact,
      Gender,
      Age,
    });
    return res.status(201).json({ msg: "User Added Successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Get User :-

const getUsers = async (req, res) => {
  try {
    let getUsers = await userModel.find();
    if (getUsers.length === 0) {
      return res.status(404).json({ msg: "No User Found" });
    }
    return res.status(200).json({ getUsers });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Get User Data By Gender :-

const getDataByGender = async (req, res) => {
  try {
    let Gender = req.query.Gender
    if (!isValid(Gender)) {
      return res.status(400).json({ msg: "Gender is Required" });
    }

    let users = await userModel.find({ Gender: Gender });
    if (users.length === 0) {
      return res.status(404).json({ msg: "No Users Found" });
    }
    return res.status(200).json({ users });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });

  }
}

// Update Users :-

const updateUsers = async (req, res) => {
  try {
    let userId = req.params.id;

    let loggedInUserID = req.user.userId;
    if (userId !== loggedInUserID) {
      return res.status(403).json({ msg: "Access Denied! Invalid User!!" });
    }

    // User Id Validation :-
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid UserId" });
    }
    let data = req.body;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ msg: "Bad Request. No Data Provided" });
    }

    let {
      userName,
      userEmail,
      userPassword,
      userAddress,
      userContact,
      Gender,
      Age,
    } = data;

    // UserName Validation :-
    if (userName !== undefined) {
      if (!isValid(userName)) {
        return res.status(400).json({ msg: "User Name is Required" });
      }

      if (!isValidName(userName)) {
        return res.status(400).json({ msg: "Invalid User Name" });
      }
    }

    // UserEmail Validation :-
    if (userEmail !== undefined) {
      if (!isValid(userEmail)) {
        return res.status(400).json({ msg: "UserEmail is Required" });
      }

      if (!isValidEmail(userEmail)) {
        return res.status(400).json({ msg: "Invalid User Email" });
      }

      let duplicateEmail = await userModel.findOne({ userEmail });
      if (duplicateEmail) {
        return res.status(400).json({ msg: "Email Already Exists" });
      }
    }

    // UserPassword Validation :-
    let salt;
    let hashedPassword;
    if (userPassword !== undefined) {
      if (!isValid(userPassword)) {
        return res.status(400).json({ msg: "UserPassword is Required" });
      }

      if (!isValidPassword(userPassword)) {
        return res.status(400).json({ msg: "Invalid User Password" });
      }
      salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(userPassword, salt);
    }

    // UserAddress Validation :-
    if (userAddress !== undefined) {
      if (!isValid(userAddress)) {
        return res.status(400).json({ msg: "UserAddress is Required" });
      }
    }

    // UserContact Validation :-
    if (userContact !== undefined) {
      if (!isValid(userContact)) {
        return res.status(400).json({ msg: "User Contact is Required" });
      }

      if (!isValidContact(userContact)) {
        return res.status(400).json({ msg: "Invalid User Contact" });
      }

      let duplicateContact = await userModel.findOne({ userContact });
      if (duplicateContact) {
        return res.status(400).json({ msg: "User Contact Is Already Exists" });
      }
    }

    // Gender Validation :-
    if (Gender !== undefined) {
      if (!isValid(Gender)) {
        return res.status(400).json({ msg: "Gender is Required" });
      }
      let validGender = ["male", "female", "other"];
      if (!validGender.includes(Gender.trim().toLowerCase())) {
        return res.status(400).json({ msg: "Gender must either male, female or others" })
      }
    }

    // Age validation :-
    if (Age !== undefined) {
      if (!isValid(Age)) {
        return res.status(400).json({ msg: "Age is Required" });
      }
    }
    let update = await userModel.findByIdAndUpdate(userId, {
      userName,
      userEmail,
      userPassword: hashedPassword,
      userAddress,
      userContact,
      Gender,
      Age,
    }, {
      new: true,
    });

    if (!update) {
      return res.status(404).json({ msg: "User not found" })
    }

    return res.status(200).json({ msg: "User Data Update Successfully", update });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Delete users

const deleteUsers = async (req, res) => {
  try {
    let userID = req.params.id;

    // UserID validation

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({ msg: "Invalid userid" })
    }

    let deleteUsers = await userModel.findByIdAndDelete(userID, { new: true });

    if (!deleteUsers) {
      return res.status(404).json({ msg: "User not found" })
    }

    return res.status(200).json({ msg: "This user is deleted" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Internal server error", error })
  }
}

const loginUser = async (req, res) => {
  try {
    let { userEmail, userPassword } = req.body;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ msg: "Bad Request, No Data Provided" });
    }

    if (!isValid(userEmail)) {
      return res.status(400).json({ msg: "Email is Required" });
    }

    if (!isValid(userPassword)) {
      return res.status(400).json({ msg: "Password is Required" });
    }

    let user = await userModel.findOne({ userEmail });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "User not Found with this email" });
    }

    let matchedUser = await bcrypt.compare(userPassword, user.userPassword);
    if (!matchedUser) {
      return res.status(401).json({ msg: "Incorrect Password" }); //401 for bad authentication
    }

    let token = jwt.sign(
      { userId: user._id, email: user.userEmail },
      "my-secret-key",
      { expiresIn: "24h" }
    );

    return res.status(200).json({ msg: "Login Successfull", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

module.exports = { addUsers, updateUsers, getUsers, getDataByGender, deleteUsers, loginUser }