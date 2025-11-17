require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
const open = require('open');
const authorsRoutes = require('./routes/authors');
const booksRoutes = require('./routes/books');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Books API is running' });
});

app.use('/api/authors', authorsRoutes);
app.use('/api/books', booksRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Manejo de ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error global (seguro para el rubric de error handling)
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await open(`http://localhost:${PORT}/api-docs`);
  } catch (err) {
    console.log("No se pudo abrir automáticamente el navegador.");
  }
});