const express = require("express");
const router = express.Router();
const logger = require("../logger");
const db = require("../db");
const Joi = require("joi");

// Validation schemas
const checkCustomerSchema = Joi.object({
	contactNumber: Joi.string()
		.pattern(/^[0-9]{11}$/)
		.required(),
	email: Joi.string().email().required(),
});

const searchCustomerSchema = Joi.object({
	searchTerm: Joi.string().min(1).required(),
});

const registerCustomerSchema = Joi.object({
	name: Joi.string().min(2).required(),
	contactNumber: Joi.string()
		.pattern(/^[0-9]{11}$/)
		.required(),
	email: Joi.string().email().required(),
	branch: Joi.string().min(1).required(),
	vehicle: Joi.string().min(1).required(),
	plateNumber: Joi.string()
		.pattern(/^[A-Z0-9 -]+$/)
		.required(),
});

const addTransactionSchema = Joi.object({
	cardNumber: Joi.string().min(8).required(),
	serviceOrProduct: Joi.string().min(1).required(),
	price: Joi.number().positive().required(),
	points: Joi.number().integer().min(0).required(),
});

// Middleware for validation
const validate = (schema) => (req, res, next) => {
	const { error } = schema.validate(req.body);
	if (error) {
		logger.warn(`Validation error: ${error.details[0].message}`);
		return res
			.status(400)
			.json({ success: false, error: error.details[0].message });
	}
	next();
};

// Check if customer exists
router.post(
	"/checkCustomer",
	validate(checkCustomerSchema),
	async (req, res) => {
		const { contactNumber, email } = req.body;
		try {
			const data = await db.executeQuery(
				`SELECT cardNumber, name FROM customers WHERE contactNumber = ? OR email = ?`,
				[contactNumber, email]
			);
			if (data.length > 0) {
				logger.info(`Customer found: ${data[0].cardNumber}`);
				res.json({ success: true, exists: true, customer: data[0] });
			} else {
				res.json({ success: true, exists: false });
			}
		} catch (error) {
			logger.error(`Error checking customer: ${error.message}`);
			res.status(500).json({ success: false, error: "Database error" });
		}
	}
);

// Search customer by card number or name
router.post(
	"/searchCustomer",
	validate(searchCustomerSchema),
	async (req, res) => {
		const { searchTerm } = req.body;
		try {
			const data = await db.executeQuery(
				`SELECT cardNumber, name, contactNumber, email, branch, vehicle, plateNumber, points
       FROM customers WHERE cardNumber = ? OR name LIKE ?`,
				[searchTerm, `%${searchTerm}%`]
			);
			if (data.length > 0) {
				logger.info(
					`Search found ${data.length} customers for term: ${searchTerm}`
				);
				res.json({ success: true, customers: data });
			} else {
				res.json({ success: true, customers: [] });
			}
		} catch (error) {
			logger.error(`Error searching customers: ${error.message}`);
			res.status(500).json({ success: false, error: "Database error" });
		}
	}
);

// Insert new customer
router.post(
	"/registerCustomer",
	validate(registerCustomerSchema),
	async (req, res) => {
		const { name, contactNumber, email, branch, vehicle, plateNumber } =
			req.body;
		try {
			// Generate card number server-side
			let cardNumber;
			let isUnique = false;
			do {
				cardNumber =
					"CARD" + Math.floor(10000000 + Math.random() * 90000000).toString();
				const existing = await db.executeQuery(
					`SELECT cardNumber FROM customers WHERE cardNumber = ?`,
					[cardNumber]
				);
				isUnique = existing.length === 0;
			} while (!isUnique);

			const result = await db.executeQuery(
				`INSERT INTO customers (cardNumber, name, contactNumber, email, branch, vehicle, plateNumber, points)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
				[cardNumber, name, contactNumber, email, branch, vehicle, plateNumber]
			);
			if (result.affectedRows === 1) {
				logger.info(`Customer registered: ${cardNumber}`);
				res.json({ success: true, cardNumber });
			} else {
				logger.warn(`Insert failed for customer: ${cardNumber}`);
				res.status(500).json({ success: false, error: "Insert failed" });
			}
		} catch (error) {
			logger.error(`Error inserting customer: ${error.message}`);
			res.status(500).json({ success: false, error: "Database error" });
		}
	}
);

// Insert transaction and update points
router.post(
	"/addTransaction",
	validate(addTransactionSchema),
	async (req, res) => {
		const { cardNumber, serviceOrProduct, price, points } = req.body;
		const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
		try {
			await db.executeQuery("START TRANSACTION");

			const insertResult = await db.executeQuery(
				`INSERT INTO transactions (cardNumber, date, serviceOrProduct, price, points)
       VALUES (?, ?, ?, ?, ?)`,
				[cardNumber, date, serviceOrProduct, price, points]
			);

			if (insertResult.affectedRows === 1) {
				const updateResult = await db.executeQuery(
					`UPDATE customers SET points = points + ? WHERE cardNumber = ?`,
					[points, cardNumber]
				);

				if (updateResult.affectedRows === 1) {
					await db.executeQuery("COMMIT");
					logger.info(
						`Transaction added and points updated for card: ${cardNumber}`
					);
					res.json({ success: true });
				} else {
					await db.executeQuery("ROLLBACK");
					logger.warn(`Failed to update points for card: ${cardNumber}`);
					res
						.status(500)
						.json({ success: false, error: "Failed to update points" });
				}
			} else {
				await db.executeQuery("ROLLBACK");
				logger.warn(`Insert transaction failed for card: ${cardNumber}`);
				res.status(500).json({ success: false, error: "Insert failed" });
			}
		} catch (error) {
			await db.executeQuery("ROLLBACK");
			logger.error(`Error adding transaction: ${error.message}`);
			res.status(500).json({ success: false, error: "Database error" });
		}
	}
);

module.exports = router;
