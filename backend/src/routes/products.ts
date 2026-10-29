import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';
import { CreateProductBody } from '../types';

const router = Router();

// GET /api/products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query as { category?: string };

    const products = await prisma.product.findMany({
      where: category && category !== 'Todos' ? { category } : undefined,
      orderBy: [{ featured: 'desc' }, { id: 'desc' }],
    });

    res.json({ ok: true, products });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al obtener productos.';
    res.status(500).json({ error: message });
  }
});

// POST /api/products
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock, imageUrl, featured } =
      req.body as CreateProductBody;

    if (!name || !price || !category) {
      res.status(400).json({ error: 'Nombre, precio y categoría son requeridos.' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description ?? '',
        price: Number(price),
        category,
        stock: Number(stock) || 50,
        imageUrl:
          imageUrl ??
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
        featured: featured ?? false,
      },
    });

    res.json({ ok: true, product });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al crear producto.';
    res.status(500).json({ error: message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await prisma.product.delete({ where: { id } });
    res.json({ ok: true, message: 'Producto eliminado.' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al eliminar producto.';
    res.status(500).json({ error: message });
  }
});

export default router;
