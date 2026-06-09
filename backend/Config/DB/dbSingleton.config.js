//dbSingleton.js
//create connection
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

let connection; // Variable for storing a single connection
//get connection
const dbSingleton = {
  getConnection: () => {
    if (!connection) {
      // Create a connection only once
      connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      // Connect to the database
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to database:", err);
          throw err;
        }
        console.log("Connected to MySQL!");
      });

      // Handle connection errors
      connection.on("error", (err) => {
        console.error("Database connection error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
          connection = null; // Update the connection state
        }
      });
    }

    return connection; // Return the current connection
  },
};

module.exports = dbSingleton;
