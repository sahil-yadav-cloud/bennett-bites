// ── Bennett Bites – router.js ─────────────────────────────────────────────
// Multi-page navigation helpers. No global state – pure functions.

/** Map route name → page filename (relative to /pages/). */
const ROUTES = {
  index:   'index.html',
  login:   'login.html',
  home:    'home.html',
  menu:    'menu.html',
  cart:    'cart.html',
  admin:   'admin.html',
  tracker: 'tracker.html',
  profile: 'profile.html',
};

/**
 * Navigate to a named route.
 * @param {string} route - Key from ROUTES.
 */
export function navigate(route) {
  const page = ROUTES[route];
  if (!page) { console.warn(`[router] Unknown route: "${route}"`); return; }
  window.location.href = page;
}

/**
 * Guard a page that requires an authenticated user.
 * Call at top of each protected page's module script.
 * @param {Function} getUser - State getter from state.js
 * @returns {boolean} true if auth OK, false if redirected.
 */
export function guardAuth(getUser) {
  if (!getUser()) {
    window.location.replace('login.html');
    return false;
  }
  return true;
}

/**
 * Guard a page that should only be shown to unauthenticated users (login).
 * @param {Function} getUser
 * @returns {boolean} true if unauthenticated, false if redirected.
 */
export function guardGuest(getUser) {
  if (getUser()) {
    window.location.replace('home.html');
    return false;
  }
  return true;
}

/**
 * Sync a cart-count badge element with current cart count.
 * Pass null/undefined getCartCount to skip.
 * @param {string} badgeId - Element ID of the badge span.
 * @param {Function} getCartCount - From state.js.
 */
export function syncCartBadge(badgeId, getCartCount) {
  const badge = document.getElementById(badgeId);
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}
