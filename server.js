const express = require("express");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./configs/connectdb");

const app = express();

app.use(cors());

connectDB();

// mongoose.connect(dbConfig.DB_URL);
// const db = mongoose.connection;

app.use(bodyParser.json());

// db.on("error", () => {
//   console.log("Error while connecting to data base");
// });

// db.once("open", () => {
//   console.log("Connected to MongoDB Successfully");
// });

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CRM Backend App API created By SenthilTechSpot",
  });
});
require("./Routes/userRoutes")(app);
require("./Routes/authRoutes")(app);
require("./Routes/ticketRoutes")(app);

app.listen(serverConfig.PORT, () => {
  console.log(`Application running on port ${serverConfig.PORT}`);
});
