import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import quotesRoutes from './routes/quotes.js';
import ordersRoutes from './routes/orders.js';
import productsRoutes from './routes/products.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for Frontend on http://localhost:5173
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ImprentaPro API REST',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [ImprentaPro Backend] API REST corriendo en http://localhost:${PORT}`);
  console.log(`🔗 CORS habilitado para frontend en http://localhost:5173`);
});
