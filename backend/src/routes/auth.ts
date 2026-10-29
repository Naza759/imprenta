import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { signToken, authMiddleware } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Por favor, ingresa correo y contraseña.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'cliente' | 'empleado',
      phone: user.phone,
      address: user.address,
    };

    const token = signToken(userData);

    res.json({
      ok: true,
      token,
      user: userData,
      message: `Bienvenido/a ${user.name}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error en el servidor';
    res.status(500).json({ error: message });
  }
});

// POST /api/auth/register (SOLO CLIENTES)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      address?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'cliente', // FORCED — auto-register is client only
        phone: phone ?? null,
        address: address ?? null,
      },
    });

    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as 'cliente',
      phone: newUser.phone,
      address: newUser.address,
    };

    const token = signToken(userData);

    res.json({
      ok: true,
      token,
      user: userData,
      message: 'Cuenta de cliente creada exitosamente.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al registrar usuario';
    res.status(500).json({ error: message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  res.json({ user: req.user });
});

export default router;
