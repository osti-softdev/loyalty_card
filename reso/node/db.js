const mysql = require("mysql");
const logger = require("./logger");
require("dotenv").config({
	path: require("path").join(__dirname, "../../outfolder/config/.env"),
});

// Validate configuration
const dbConfig = {
	connectionLimit: 10,
	host: process.env.DB_HOST || "localhost",
	port: parseInt(process.env.DB_PORT) || 3306,
	user: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "toyota",
	connectTimeout: 10000, // 10 seconds
};

for (const [key, value] of Object.entries(dbConfig)) {
	if (!value && key !== "password") {
		logger.error(`Missing or invalid DB config: ${key}`);
		throw new Error(`Database configuration error: ${key} is required`);
	}
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Function to execute a query using connection pool
function executeQuery(query, params = []) {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				logger.error(
					`Error getting MySQL connection: ${err.code} - ${err.message}`
				);
				// Propagate the real error for better debugging
				return reject(err);
			}

			const queryTimeout = setTimeout(() => {
				connection.release();
				logger.error(`Query timeout: ${query}`);
				reject(new Error("Query execution timed out"));
			}, 15000); // 15 seconds timeout

			connection.query(query, params, (err, result) => {
				clearTimeout(queryTimeout);
				connection.release();
				if (err) {
					logger.error(`Query error: ${err.code} - ${err.message}`);
					// Propagate the real error for better debugging
					return reject(err);
				}
				logger.info(`Query executed successfully`);
				resolve(result);
			});
		});
	});
}

module.exports = { executeQuery };
