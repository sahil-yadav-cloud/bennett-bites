// ── Bennett Bites – api.js ────────────────────────────────────────────────
// All communication with the Python backend (FastAPI / Flask at localhost:8000).

/**
 * BennettAPI – thin async wrapper around the REST API.
 *
 * Usage:
 *   import { BennettAPI } from '../src/api.js';
 *   const api = new BennettAPI();
 *   const menu = await api.getMenu();
 */
export class BennettAPI {
  /**
   * @param {string} [base='http://localhost:8000'] - Backend base URL.
   */
  constructor(base = 'http://localhost:8000') {
    this.base = base.replace(/\/$/, ''); // strip trailing slash
  }

  // ── Menu ────────────────────────────────────────────────────────────────
  /**
   * Fetch the full food catalogue.
   * GET /menu
   * @returns {Promise<Array>} Array of menu item objects.
   */
  async getMenu() {
    const res = await fetch(`${this.base}/menu`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`getMenu failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  // ── Orders ───────────────────────────────────────────────────────────────
  /**
   * Submit a cart as a new order.
   * POST /orders  { userId, items, total, pickupCode, placedAt }
   * @param {{ userId:string, items:Array, total:number, pickupCode:string, placedAt:number }} cartData
   * @returns {Promise<{ orderId:string, estimatedMins:number }>}
   */
  async placeOrder(cartData) {
    const res = await fetch(`${this.base}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(cartData),
    });
    if (!res.ok) throw new Error(`placeOrder failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  // ── Admin ────────────────────────────────────────────────────────────────
  /**
   * Upload a new food item (admin only).
   * POST /admin/food  multipart/form-data
   *   Fields: name (string), price (number), calories (number),
   *           category (string), image (File)
   *
   * NOTE: Do NOT set Content-Type manually – let the browser set the
   *       boundary for multipart/form-data automatically.
   *
   * @param {FormData} formData
   * @returns {Promise<{ id:string, message:string }>}
   */
  async uploadFood(formData) {
    const res = await fetch(`${this.base}/admin/food`, {
      method: 'POST',
      // No Content-Type header – browser injects multipart boundary.
      body: formData,
    });
    if (!res.ok) throw new Error(`uploadFood failed: ${res.status} ${res.statusText}`);
    return res.json();
  }
}
