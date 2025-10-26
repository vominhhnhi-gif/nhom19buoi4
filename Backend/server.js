const express = require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Kết nối MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('Kết nối MongoDB thành công!'))
	.catch((err) => console.error('Kết nối MongoDB thất bại:', err));

// CORS middleware - allow all origins (development) or specific origin (production)
const cors = require('cors');
const isDevelopment = process.env.NODE_ENV !== 'production';
const corsOptions = isDevelopment 
  ? { origin: true, credentials: true } // Allow all origins in development
  : { 
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
      credentials: true 
    };
app.use(cors(corsOptions));


// users routes
// Helper to safely load route modules so a single broken route file doesn't crash the whole server
function safeLoadRoute(mountPath, modulePath) {
	try {
		// require the route module and mount it
		const router = require(modulePath);
		app.use(mountPath, router);
	} catch (e) {
		console.error(`Failed to load route ${modulePath} mounted at ${mountPath}:`, e && e.stack ? e.stack.split('\n')[0] : e);
		// mount a fallback that returns 500 for any requests to this mount point
		app.use(mountPath, (req, res) => res.status(500).json({ message: 'Route unavailable due to server error' }));
	}
}

safeLoadRoute('/users', './routes/user');
safeLoadRoute('/auth', './routes/auth');
safeLoadRoute('/profile', './routes/profile');
safeLoadRoute('/admin', './routes/admin');

// simple health-check endpoint to confirm the server is reachable
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces
app.listen(PORT, HOST, () => {
	console.log(`Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
	console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
	console.log(`CORS: ${isDevelopment ? 'Allow all origins' : 'Restricted to ' + process.env.FRONTEND_ORIGIN}`);
});

module.exports = app;