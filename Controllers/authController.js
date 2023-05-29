const { userStatus, userTypes } = require("../utils/constants");
const User = require("../Models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfigs = require("../configs/auth.config");
const { sendEmail } = require("../utils/NotificationClient");
const { userRegistration } = require("../script/authScripts");

exports.signUp = async (req, res) => {
  let { name, username, email, password, userType } = req.body;
  // var userType = req.body.userType;
  var status;

  if (!userType || userType === "CUSTOMER") {
    status = "APPROVED";
  } else {
    status = "PENDING";
  }

  const userObj = {
    name: name,
    username: username,
    email: email,
    userTypes: userType,
    userStatus: status,
    password: bcrypt.hashSync(password, 8),
  };

  try {
    // Save user in the database
    const user = await User.create(userObj);

    //send the notification to the registered email that you are registered succesfully
    const { subject, html, text } = userRegistration(user);

    sendEmail([user.email], subject, html, text);

    // res.send({ message: "User Created Successfully", user });
    res.status(201).send({ message: "User Created Successfully", user });
  } catch (e) {
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user === null) {
    return res.status(400).send({ message: "Username passed is invalid" });
  }

  if (user.userStatus != "APPROVED") {
    return res.status(200).send({
      message: `Cant allow user to login as this user is in ${user.userStatus} state`,
    });
  }

  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send({ message: "Invalid password!" });
  }

  var token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      userType: user.userTypes,
      userStatus: user.userStatus,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 86400,
    }
  );

  res.status(200).send({
    name: user.name,
    username: user.username,
    email: user.email,
    userType: user.userTypes,
    userStatus: user.userStatus,
    accessToken: token,
  });
};
