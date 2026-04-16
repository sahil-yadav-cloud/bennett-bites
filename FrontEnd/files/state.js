// ── Bennett Bites – state.js ──────────────────────────────────────────────
// Single source of truth: one JSON blob in localStorage.
// All mutations go through update() to keep reads + writes atomic.

const KEY = 'bb_state';

const DEFAULTS = () => ({
  user:          null,
  cart:          [],
  groupMembers:  [{ id:'you', name:'You (Alex)', initial:'A', color:'#a43700', active:true }],
  splitData:     {},
  currentOrder:  null,
  orderStatus:   'placed',
  orderPlacedAt: null,
});

// ── Core I/O ──────────────────────────────────────────────────────────────
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS(), ...JSON.parse(raw) } : DEFAULTS();
  } catch {
    return DEFAULTS();
  }
}

export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
}

/** Immutable-style updater: receive a mutator fn, save, and return new state. */
export function update(mutator) {
  const state = loadState();
  mutator(state);
  saveState(state);
  return state;
}

// ── User ──────────────────────────────────────────────────────────────────
export const getUser   = ()  => loadState().user;
export const setUser   = (u) => update(s => { s.user = u; });
export const clearUser = ()  => update(s => { s.user = null; });

// ── Cart ──────────────────────────────────────────────────────────────────
export const getCart  = ()  => loadState().cart;
export const setCart  = (c) => update(s => { s.cart = c; });

/**
 * Add item to cart. If already present, increments qty.
 * @param {{ id:string, name:string, price:number, [key:string]:any }} item
 */
export function addToCart(item) {
  update(s => {
    const existing = s.cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      s.cart.push({ ...item, qty: 1 });
    }
  });
  // Broadcast change to other pages open in parallel tabs.
  window.dispatchEvent(new Event('bb:cart-changed'));
}

/**
 * Adjust qty of a cart item by delta (+1 or -1). Removes if qty reaches 0.
 */
export function updateQty(id, delta) {
  update(s => {
    const item = s.cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) s.cart = s.cart.filter(i => i.id !== id);
  });
  window.dispatchEvent(new Event('bb:cart-changed'));
}

export function removeFromCart(id) {
  update(s => { s.cart = s.cart.filter(i => i.id !== id); });
  window.dispatchEvent(new Event('bb:cart-changed'));
}

export const getCartTotal = () => getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
export const getCartCount = () => getCart().reduce((sum, i) => sum + i.qty, 0);

// ── Groups ────────────────────────────────────────────────────────────────
export const getGroupMembers = ()    => loadState().groupMembers;
export const addGroupMember  = (m)   => update(s => {
  if (!s.groupMembers.find(x => x.id === m.id)) s.groupMembers.push(m);
});
export const getSplitData      = ()      => loadState().splitData;
export const toggleItemSplit   = (itemId) => update(s => {
  const memberIds = s.groupMembers.map(m => m.id);
  if (s.splitData[itemId]) delete s.splitData[itemId];
  else s.splitData[itemId] = memberIds;
});

// ── Orders ────────────────────────────────────────────────────────────────
export function setCurrentOrder(order) {
  update(s => {
    s.currentOrder  = order;
    s.orderPlacedAt = Date.now();
    s.orderStatus   = 'placed';
  });
}
export const getCurrentOrder  = () => loadState().currentOrder;
export const getOrderPlacedAt = () => loadState().orderPlacedAt;

// ── Seed ──────────────────────────────────────────────────────────────────
/** Populate cart with demo items on first login. */
export function seedDemo() {
  if (getCart().length === 0) {
    setCart([
      {
        id: 'item_1', name: 'Spicy Salmon Quinoa Bowl', price: 14.50, qty: 1,
        note: 'No onions, extra dressing on side',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArnuuWypGAoy5poADW_Co6wjNLGUEYzO4_lJIo-w1mX7Cqj7RIKgt_wP9EVXOHL696xqbN1wWnqcZuFAfBciRoWfxBW0YET_CNwxZcq_B7jYEiZ_Tk-Wk0346h99QTiqn9YYmppZ-ojzXKcgczQyNmGmGysXw748cnAu826zy5hvyQoLgg4Pe7zqjE8DyYi7vnT-1msHJkO-R0CHgBqttdOsk1zwnlDrGUHYY0c0JidhRv95727TAUqWyXxJMzVVRvFzikz_xJdhKO',
        protein: 28, carbs: 42, fat: 12,
      },
      {
        id: 'item_2', name: 'Oat Milk Cold Brew', price: 5.75, qty: 1,
        note: 'Regular ice, 2 pumps vanilla',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3wVDrkEcPvQWivgbGe9MQmJBjMWY_JwDGKto6PS0ZwVGDTHo8F_bZPBrYqsrfwsVuzUPu2VAqWdZ4dYMJW-9XtsJfES5OB8iGYHslLotABjLP100pI5x13wgAPKuGCd4QZuZzM0Qm7tk3DK0B5TzS0Cr_Fk7lTb5BBW6SyaGlUh_x7T-rTeMwRjuiciNqHbaJFXrt5PSzYE6QeEI0BXBLgrEsLnAKRVAxNkBhVM6OF3bdk3wIbCb0FQv7jWxRH5FyyLrA_ETR-',
        protein: 4, carbs: 8, fat: 3,
      },
    ]);
  }
}
