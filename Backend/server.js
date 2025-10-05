const express = require('express');
const app = express();
app.use(express.json());

// Kết nối MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('Kết nối MongoDB thành công!'))
	.catch((err) => console.error('Kết nối MongoDB thất bại:', err));

// Thêm CORS middleware
const cors = require('cors');
<<<<<<< HEAD
<<<<<<< HEAD
app.use(cors({ origin: 'http://localhost:5173' }));
=======
app.use(cors({ origin: '*' }));

>>>>>>> Backend-Nhi
=======
app.use(cors({ origin: '*' }));

>>>>>>> 8a7b5a04666ad63b4afc0cb264ee7998af8250f3

// users routes
const userRouter = require('./routes/user');
app.use('/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;