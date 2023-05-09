require("dotenv").config();

module.exports = {
  DB_Name: "CRM_DB",
  DB_URL: process.env.MONGODB_URI,
};
