import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (category && category !== 'Todos') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY featured DESC, id DESC';
    const products = db.prepare(query).all(...params);
    return res.json({ ok: true, products });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al obtener productos.' });
  }
});

// POST /api/products
router.post('/', (req, res) => {
  try {
    const { name, description, price, category, stock, image_url, featured } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
    }

    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, category, stock, image_url, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name.trim(),
      description || '',
      Number(price),
      category,
      Number(stock) || 50,
      image_url || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      featured ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    return res.json({ ok: true, product: created });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al crear producto.' });
  }
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return res.json({ ok: true, message: 'Producto eliminado.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al eliminar producto.' });
  }
});

export default router;
