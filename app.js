const { app: electronApp, BrowserWindow, dialog } = require("electron");
const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("./reso/node/logger");
const customerRoutes = require("./reso/node/routes/customer");
const catalogRoutes = require("./reso/node/routes/catalog");
const db = require("./reso/node/db");
const expressApp = express();
const PORT = process.env.PORT || 3000;

// Express setup
expressApp.use(express.json({ limit: "50mb" }));
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cors({ origin: "*" })); // Relaxed for development
expressApp.use(express.static(path.join(__dirname, "public")));

// Routes
expressApp.get("/dashboard", (req, res) => {
	logger.info("Serving dashboard page");
	res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

expressApp.get("/register", (req, res) => {
	logger.info("Serving register page");
	res.sendFile(path.join(__dirname, "public", "register.html"));
});

expressApp.get("/teller", (req, res) => {
	logger.info("Serving teller page");
	res.sendFile(path.join(__dirname, "public", "teller.html"));
});

// API routes
expressApp.use("/api", customerRoutes);
expressApp.use("/api", catalogRoutes);

// Error handling middleware
expressApp.use((err, req, res, next) => {
	logger.error(`Unhandled error: ${err.stack}`);
	res.status(500).json({ success: false, error: "Internal server error" });
});

// Create Electron window
function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});
	mainWindow.loadURL(`http://localhost:${PORT}/dashboard`);
}

function checkDatabaseConnection() {
	return new Promise((resolve, reject) => {
		db.executeQuery("SELECT id FROM dbchecker WHERE id = 1")
			.then((result) => {
				if (Array.isArray(result) && result.length > 0 && result[0].id === 1) {
					resolve("true");
				} else {
					resolve("false");
				}
			})
			.catch((error) => {
				let errorMessage = "";
				if (error.code === "ECONNREFUSED") {
					errorMessage =
						"Connection refused: Check if the database server is running and the port is correct.";
				} else if (error.code === "ER_ACCESS_DENIED_ERROR") {
					errorMessage = "Access denied: Check database username and password.";
				} else if (error.code === "ENOTFOUND") {
					errorMessage =
						"Database not found: Check database host and port configuration.";
				} else if (error.code === "ER_BAD_DB_ERROR") {
					errorMessage = `Unknown DATABASE: Check your database connection`;
				} else {
					errorMessage = error.message;
				}

				reject(new Error(errorMessage));
			});
	});
}

// Electron lifecycle
electronApp.whenReady().then(() => {
	checkDatabaseConnection()
		.then((connected) => {
			logger.info(`Database connection status: ${connected}`);
			if (connected === "true") {
				logger.info("Database connection established successfully.");
				createWindow();
				expressApp.listen(PORT, () => {
					logger.info(`Server running on port ${PORT}`);
				});
			} else {
				dialog.showErrorBox(
					"Database Connection",
					"Database connection failed."
				);
				logger.error("Database connection failed.");
				electronApp.quit();
				process.exit(0);
			}
		})
		.catch((error) => {
			dialog.showErrorBox(
				"Database Connection",
				`Database connection failed. ${error.message}`
			);
			logger.error(`Database connection error: ${error.message}`);
		});
});

electronApp.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

electronApp.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		electronApp.quit();
	}
});
