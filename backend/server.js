import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './api/auth.route.js';

dotenv.config();

// * Port
const PORT = process.env.PORT || 5000;

const app = express();

//* Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
