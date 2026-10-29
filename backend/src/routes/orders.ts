import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AuthenticatedRequest, JwtPayload, CreateOrderBody } from '../types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'imprentapro-super-secret-key-2026';

function getOptionalUser(req: AuthenticatedRequest): JwtPayload | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// GET /api/orders
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = getOptionalUser(req);

    const orders = await prisma.order.findMany({
      where: user?.role === 'cliente' ? { userId: user.id } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json({ ok: true, orders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al obtener órdenes.';
    res.status(500).json({ error: message });
  }
});

// POST /api/orders
router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = getOptionalUser(req);
    const { items, customer_name, customer_email, customer_phone, shipping_address } =
      req.body as CreateOrderBody;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'La orden no tiene ítems.' });
      return;
    }

    const name = customer_name || user?.name;
    const email = customer_email || user?.email;
    const phone = customer_phone || user?.phone || '';
    const address = shipping_address || user?.address || 'Retiro en taller';

    if (!name || !email) {
      res.status(400).json({ error: 'Nombre y correo son obligatorios.' });
      return;
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: user?.id ?? null,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        total,
        status: 'En Revisión Técnica',
        items: {
          create: items.map((item) => ({
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    res.json({
      ok: true,
      orderId: order.id,
      total,
      message: 'Orden enviada a producción exitosamente.',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al procesar la orden.';
    res.status(500).json({ error: message });
  }
});

// PATCH /api/orders/:id
router.patch('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body as { status?: string };

    if (!status) {
      res.status(400).json({ error: 'Estado requerido.' });
      return;
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    res.json({ ok: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al actualizar orden.';
    res.status(500).json({ error: message });
  }
});

export default router;
