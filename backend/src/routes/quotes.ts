import { Router, Request, Response } from 'express';
import { QuoteRequestBody, LonaParams, FolletoParams, TarjetaParams, TextilParams } from '../types';

const router = Router();

// POST /api/quotes/calculate
router.post('/calculate', (req: Request, res: Response): void => {
  try {
    const { category, params } = req.body as QuoteRequestBody;

    if (!category || !params) {
      res.status(400).json({ error: 'Categoría y parámetros requeridos.' });
      return;
    }

    let title = '';
    let description = '';
    let unitPrice = 0;
    let totalPrice = 0;
    let estimatedDays = '48 a 72 hs hábiles';

    switch (category) {
      case 'lonas': {
        const {
          material = 'frontlight',
          width = 2,
          height = 1,
          finish = 'ojales',
          quantity = 1,
        } = params as LonaParams;

        const w = parseFloat(String(width)) || 1;
        const h = parseFloat(String(height)) || 1;
        const qty = parseInt(String(quantity), 10) || 1;
        const area = Math.max(0.2, w * h);

        const baseM2 =
          material === 'blackout' ? 18.5 : material === 'microperforada' ? 21.0 : 14.0;
        const finishCost = finish === 'ojales' ? 3.0 : finish === 'bolsillo' ? 4.0 : 0;

        unitPrice = Number((area * baseM2 + finishCost).toFixed(2));
        totalPrice = Number((unitPrice * qty).toFixed(2));

        const matName =
          material === 'blackout'
            ? 'Blackout Doble Faz'
            : material === 'microperforada'
            ? 'Microperforada'
            : 'Frontlight 440g';
        const finName =
          finish === 'ojales'
            ? 'Ojales perimetrales cada 30cm'
            : finish === 'bolsillo'
            ? 'Bolsillo p/ caño'
            : 'Al ras';

        title = `Lona ${matName} (${w}x${h}m)`;
        description = `Superficie: ${area.toFixed(2)} m². Terminación: ${finName}. Cantidad: ${qty} u.`;
        estimatedDays = '24 a 48 hs hábiles';
        break;
      }

      case 'folletos': {
        const {
          size = 'a5',
          paper = '150g',
          lamination = 'brillante',
          quantity = 1000,
        } = params as FolletoParams;

        const qty = parseInt(String(quantity), 10) || 1000;
        const base = size === 'triptico' ? 55 : size === 'a5' ? 42 : 28;
        const paperMult = paper === '300g' ? 1.3 : 1.0;
        const lamMult = lamination !== 'ninguno' ? 1.25 : 1.0;

        totalPrice = Number(((base / 1000) * qty * paperMult * lamMult).toFixed(2));
        unitPrice = Number((totalPrice / qty).toFixed(3));

        title = `Folletos Publicitarios ${size.toUpperCase()} Full Color`;
        description = `Papel Couché ${paper}. Laminado: ${lamination}. Tirada: ${qty} unidades.`;
        estimatedDays = '48 a 72 hs hábiles';
        break;
      }

      case 'tarjetas': {
        const { finish = 'mate-uv', corners = false, quantity = 500 } = params as TarjetaParams;
        const qty = parseInt(String(quantity), 10) || 500;
        const base100 = finish === 'mate-uv' ? 34 : finish === 'mate' ? 26 : 19;
        const mult = qty === 100 ? 1 : qty === 250 ? 2.1 : qty === 500 ? 3.6 : 6.0;

        totalPrice = Number((base100 * mult + (corners ? 5 : 0)).toFixed(2));
        unitPrice = Number((totalPrice / qty).toFixed(2));

        const finishName =
          finish === 'mate-uv'
            ? 'Laminado Mate + Laca UV Sectorizada'
            : finish === 'mate'
            ? 'Laminado Mate Soft Touch'
            : 'Couché 350g Clásica';

        title = `Tarjetas Personales 350g (${qty} u.)`;
        description = `Acabado: ${finishName}. ${corners ? 'Puntas redondeadas troqueladas.' : 'Corte recto clásico.'}`;
        estimatedDays = '72 a 96 hs hábiles';
        break;
      }

      case 'textil': {
        const {
          type = 'remera',
          printArea = 'frente-espalda',
          color = 'negro',
          quantity = 10,
        } = params as TextilParams;

        const qty = parseInt(String(quantity), 10) || 10;
        const base = type === 'buzo' ? 32 : 16;
        const printCost = printArea === 'frente-espalda' ? 8 : 4.5;
        const discount = qty >= 20 ? 0.85 : 1.0;

        unitPrice = Number(((base + printCost) * discount).toFixed(2));
        totalPrice = Number((unitPrice * qty).toFixed(2));

        const typeName =
          type === 'buzo' ? 'Buzos Hoodie con Capucha' : 'Remeras 100% Algodón Peinado';
        const areaName =
          printArea === 'frente-espalda' ? 'Frente y Espalda DTF' : 'Frente Único DTF';

        title = `${typeName} Estampadas (${qty} u.)`;
        description = `Color: ${color}. Estampado: ${areaName}. ${qty >= 20 ? 'Descuento por volumen 15% aplicado.' : ''}`;
        estimatedDays = '4 a 6 días hábiles';
        break;
      }

      default:
        res.status(400).json({ error: 'Categoría no soportada.' });
        return;
    }

    res.json({
      ok: true,
      category,
      title,
      description,
      unitPrice,
      totalPrice,
      estimatedDays,
      prepress: 'Bonificado 100%',
      digitalProof: 'Incluida sin cargo',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al calcular presupuesto.';
    res.status(500).json({ error: message });
  }
});

export default router;
