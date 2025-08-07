const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/categories - returns all categories grouped by type                                                            
router.get("/categories", async (req, res) => {
	try {
		const categories = await db.executeQuery("SELECT * FROM categories");
		// Group by type
		const grouped = { Service: [], Product: [] };
		categories.forEach((cat) => {
			if (grouped[cat.type]) grouped[cat.type].push(cat);                                           
		});
		res.json({ success: true, categories: grouped });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

// GET /api/items - returns all ite                                                     ms, optionally filtered by category or type
router.get("/items", async (req, res) => {
	try {             
		let query = `SELECT items.*, categories.name as category_name, categories.type as category_type FROM items JOIN categories ON items.category_id = categories.category_id`;
		const params = [];
		if (req.query.type) {                               
			query += " WHERE categories.type = ?";
			params.push(req.query.type);
		}
		const items = await db.executeQuery(query, params);
		// Group items by category
		const grouped = {};
		items.forEach((item) => {
			if (!grouped[item.category_name]) grouped[item.category_name] = [];
			grouped[item.category_name].push({
				item_id: item.item_id,
				name: item.name,
				price: item.price,
				points: item.points,
				category_id: item.category_id,
				category_type: item.category_type,
			});
		});
		res.json({ success: true, items                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : grouped });
	} catch (err) {
		res.status(500).json({ success: false, error: err.message });
	}
});

module.exports = router;
