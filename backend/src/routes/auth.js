import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor, ingresa correo y contraseña.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    };

    const token = signToken(userData);

    return res.json({
      ok: true,
      token,
      user: userData,
      message: `Bienvenido/a ${user.name}`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error en el servidor' });
  }
});

// POST /api/auth/register (ONLY CLIENTS)
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existing) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    // FORCED CLIENT ROLE:
    const role = 'cliente';

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(name.trim(), normalizedEmail, hashedPassword, role, phone || null, address || null);

    const newUser = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: normalizedEmail,
      role,
      phone: phone || null,
      address: address || null,
    };

    const token = signToken(newUser);

    return res.json({
      ok: true,
      token,
      user: newUser,
      message: 'Cuenta de cliente creada exitosamente.',
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error al registrar usuario' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

export default router;
