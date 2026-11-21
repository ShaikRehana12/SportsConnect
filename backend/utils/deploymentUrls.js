const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
const backendUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

module.exports = { frontendUrl, backendUrl };
