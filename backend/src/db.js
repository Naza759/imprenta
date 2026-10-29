import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'imprenta.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('cliente', 'empleado')),
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Products / Packs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER NOT NULL DEFAULT 50,
      image_url TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'En Revisión Técnica',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // 4. Order Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
    );
  `);

  // Seed default users
  const salt = bcrypt.genSaltSync(10);
  const employeePassword = bcrypt.hashSync('admin123', salt);
  const clientPassword = bcrypt.hashSync('cliente123', salt);

  const existingEmp = db.prepare('SELECT id FROM users WHERE email = ?').get('empleado@imprentapro.com');
  if (!existingEmp) {
    db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Operador ImprentaPro (Empleado)',
      'empleado@imprentapro.com',
      employeePassword,
      'empleado',
      '+54 9 11 4455-8899',
      'Taller Central de Impresión, Planta 1'
    );
  }

  const existingClient = db.prepare('SELECT id FROM users WHERE email = ?').get('cliente@gmail.com');
  if (!existingClient) {
    db.prepare(`
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      'Cliente Estudio Creativo',
      'cliente@gmail.com',
      clientPassword,
      'cliente',
      '+54 9 11 9876-5432',
      'Av. Santa Fe 2100, CABA'
    );
  }

  // Seed print shop products
  const count = db.prepare('SELECT COUNT(*) as c FROM products').get();
  if (count.c === 0) {
    const insert = db.prepare(`
      INSERT INTO products (name, description, price, category, stock, image_url, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      'Lona Frontlight 440g c/ Ojales (2x1m)',
      'Lona vinílica impermeable con tintas solventes UV para intemperie. Incluye refuerzo perimetral y ojales metálicos.',
      31.0,
      'Lonas',
      50,
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      1
    );

    insert.run(
      'Pack 1000 Folletos A5 Couché 150g',
      'Impresión offset digital 4/4 colores (frente y dorso). Acabado brillante de alto impacto visual.',
      42.0,
      'Folletería',
      40,
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80',
      1
    );

    insert.run(
      'Pack 500 Tarjetas Mate + Laca Sectorizada UV',
      'Cartulina 350g, polipropileno mate soft touch y brillo UV localizado para resaltar tu logotipo.',
      34.0,
      'Tarjetas',
      60,
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
      1
    );

    insert.run(
      'Lote 10 Remeras Estampadas DTF Corporativas',
      '100% Algodón peinado 24/1 premium. Estampado digital textil sin límite de colores de alta durabilidad.',
      185.0,
      'Textil',
      30,
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
      1
    );
  }
}

initDatabase();

export default db;
