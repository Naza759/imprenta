import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

async function seed() {
  console.log('🌱 Iniciando semilla de base de datos...');

  // ─── Usuarios Demo ───────────────────────────────────────────────────────────
  const employeeEmail = 'empleado@imprentapro.com';
  const clientEmail = 'cliente@gmail.com';

  const existingEmployee = await prisma.user.findUnique({ where: { email: employeeEmail } });
  if (!existingEmployee) {
    await prisma.user.create({
      data: {
        name: 'Operador ImprentaPro (Empleado)',
        email: employeeEmail,
        password: await bcrypt.hash('admin123', 10),
        role: 'empleado',
        phone: '+54 9 11 4455-8899',
        address: 'Taller Central de Impresión, Planta 1',
      },
    });
    console.log('✅ Empleado demo creado:', employeeEmail);
  }

  const existingClient = await prisma.user.findUnique({ where: { email: clientEmail } });
  if (!existingClient) {
    await prisma.user.create({
      data: {
        name: 'Cliente Estudio Creativo',
        email: clientEmail,
        password: await bcrypt.hash('cliente123', 10),
        role: 'cliente',
        phone: '+54 9 11 9876-5432',
        address: 'Av. Santa Fe 2100, CABA',
      },
    });
    console.log('✅ Cliente demo creado:', clientEmail);
  }

  // ─── Productos ───────────────────────────────────────────────────────────────
  const productCount = await prisma.product.count();
  if (productCount === 0) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Lona Frontlight 440g c/ Ojales (2x1m)',
          description:
            'Lona vinílica impermeable con tintas solventes UV para intemperie. Incluye refuerzo perimetral y ojales metálicos.',
          price: 31.0,
          category: 'Lonas',
          stock: 50,
          imageUrl:
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
          featured: true,
        },
        {
          name: 'Pack 1000 Folletos A5 Couché 150g',
          description:
            'Impresión offset digital 4/4 colores (frente y dorso). Acabado brillante de alto impacto visual.',
          price: 42.0,
          category: 'Folletería',
          stock: 40,
          imageUrl:
            'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80',
          featured: true,
        },
        {
          name: 'Pack 500 Tarjetas Mate + Laca Sectorizada UV',
          description:
            'Cartulina 350g, polipropileno mate soft touch y brillo UV localizado para resaltar tu logotipo.',
          price: 34.0,
          category: 'Tarjetas',
          stock: 60,
          imageUrl:
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
          featured: true,
        },
        {
          name: 'Lote 10 Remeras Estampadas DTF Corporativas',
          description:
            '100% Algodón peinado 24/1 premium. Estampado digital textil sin límite de colores de alta durabilidad.',
          price: 185.0,
          category: 'Textil',
          stock: 30,
          imageUrl:
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
          featured: true,
        },
      ],
    });
    console.log('✅ 4 productos de imprenta creados.');
  }

  console.log('');
  console.log('🎉 Semilla completada exitosamente.');
  console.log('');
  console.log('  Demo Empleado → empleado@imprentapro.com / admin123');
  console.log('  Demo Cliente  → cliente@gmail.com / cliente123');
  console.log('');

  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error('❌ Error en semilla:', e);
  await prisma.$disconnect();
  process.exit(1);
});
