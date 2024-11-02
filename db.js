const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
};

const connectDB = async () => {
	try {
		const connection = await mysql.createConnection(dbConfig);
		console.log("Database connected successfully");
		return connection;
	} catch (error) {
		console.error("Database connection failed:", error);
		throw error;
	}
};

module.exports = connectDB;
