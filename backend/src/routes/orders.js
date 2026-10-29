import { Router } from 'express';
import db from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'imprentapro-super-secret-key-2026';

// Helper to extract user if token present (optional auth)
function getOptionalUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch {
    return null;
  }
}

// GET /api/orders
router.get('/', (req, res) => {
  try {
    const user = getOptionalUser(req);
    let orders = [];

    if (user && user.role === 'cliente') {
      orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
    } else {
      // By default or if employee, return all orders for demonstration
      orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    }

    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    const fullOrders = orders.map((o) => ({
      ...o,
      items: getItems.all(o.id),
    }));

    return res.json({ ok: true, orders: fullOrders });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al obtener órdenes.' });
  }
});

// POST /api/orders
router.post('/', (req, res) => {
  try {
    const user = getOptionalUser(req);
    const { items, customer_name, customer_email, customer_phone, shipping_address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La orden no tiene ítems.' });
    }

    const name = customer_name || user?.name;
    const email = customer_email || user?.email;
    const phone = customer_phone || user?.phone || '';
    const address = shipping_address || user?.address || 'Retiro en taller';

    if (!name || !email) {
      return res.status(400).json({ error: 'Nombre y correo son obligatorios.' });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const insertOrder = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, shipping_address, total, status)
      VALUES (?, ?, ?, ?, ?, ?, 'En Revisión Técnica')
    `);

    const result = insertOrder.run(user?.id || null, name, email, phone, address, total);
    const orderId = Number(result.lastInsertRowid);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_name, price, quantity)
      VALUES (?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItem.run(orderId, item.name, item.price, item.quantity);
    }

    return res.json({
      ok: true,
      orderId,
      total,
      message: 'Orden enviada a producción exitosamente.',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al procesar la orden.' });
  }
});

// PATCH /api/orders/:id (Update Status)
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Estado requerido.' });
    }

    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.run(status, id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    return res.json({ ok: true, order: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al actualizar orden.' });
  }
});

export default router;
