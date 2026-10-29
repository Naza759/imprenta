import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import quotesRoutes from './routes/quotes';
import ordersRoutes from './routes/orders';
import productsRoutes from './routes/products';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// CORS — allow frontend dev server
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
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'ImprentaPro API REST v2 (TypeScript + Prisma)',
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 [ImprentaPro Backend v2] API REST corriendo en http://localhost:${PORT}`);
  console.log(`🔗 CORS habilitado para frontend en http://localhost:5173`);
  console.log(`🗃️  Base de datos: Prisma ORM + SQLite`);
});
