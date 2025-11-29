import express from 'express';
import connectToDatabase from './config/db.js';
import userRoutes from './routes/User.routes.js';
import notesRoutes from './routes/Notes.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
connectToDatabase();

app.use('/users', userRoutes);
app.use('/notes', notesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});