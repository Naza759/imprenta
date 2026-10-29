import { Request } from 'express';

// ─── Auth / User ──────────────────────────────────────────────────────────────

export type UserRole = 'cliente' | 'empleado';

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  address?: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface CreateProductBody {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  imageUrl?: string;
  featured?: boolean;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItemInput {
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderBody {
  items: OrderItemInput[];
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
}

// ─── Quotes ───────────────────────────────────────────────────────────────────

export type QuoteCategory = 'lonas' | 'folletos' | 'tarjetas' | 'textil';

export interface LonaParams {
  material?: 'frontlight' | 'blackout' | 'microperforada';
  width?: number;
  height?: number;
  finish?: 'ojales' | 'bolsillo' | 'al-ras';
  quantity?: number;
}

export interface FolletoParams {
  size?: 'a5' | 'a6' | 'triptico';
  paper?: '150g' | '300g';
  lamination?: 'brillante' | 'mate' | 'ninguno';
  quantity?: number;
}

export interface TarjetaParams {
  finish?: 'mate-uv' | 'mate' | 'clasica';
  corners?: boolean;
  quantity?: number;
}

export interface TextilParams {
  type?: 'remera' | 'buzo';
  printArea?: 'frente' | 'frente-espalda';
  color?: string;
  quantity?: number;
}

export interface QuoteRequestBody {
  category: QuoteCategory;
  params: LonaParams | FolletoParams | TarjetaParams | TextilParams;
}
