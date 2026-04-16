// ── Bennett Bites – utils.js ──────────────────────────────────────────────

/** Tailwind custom config – paste this into tailwind.config on each page. */
export const TAILWIND_CONFIG = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'on-secondary-fixed':         '#002020',
        'surface-container-high':     '#e8e8e8',
        'on-tertiary-fixed-variant':  '#604100',
        'on-primary-fixed-variant':   '#802a00',
        'tertiary-container':         '#9b6b00',
        'tertiary-fixed':             '#ffdeac',
        'primary':                    '#a43700',
        'on-primary':                 '#ffffff',
        'primary-container':          '#cd4700',
        'primary-fixed':              '#ffdbcf',
        'on-error':                   '#ffffff',
        'error-container':            '#ffdad6',
        'on-primary-fixed':           '#380d00',
        'surface-bright':             '#f9f9f9',
        'on-secondary-container':     '#006e6e',
        'tertiary':                   '#7b5500',
        'inverse-on-surface':         '#f1f1f1',
        'secondary-fixed-dim':        '#76d6d5',
        'surface-variant':            '#e2e2e2',
        'surface-container-lowest':   '#ffffff',
        'secondary-fixed':            '#93f2f2',
        'on-tertiary-fixed':          '#281900',
        'on-primary-container':       '#fffbff',
        'tertiary-fixed-dim':         '#ffba38',
        'surface':                    '#f9f9f9',
        'on-surface-variant':         '#5a4138',
        'primary-fixed-dim':          '#ffb59a',
        'surface-dim':                '#dadada',
        'on-surface':                 '#1a1c1c',
        'secondary':                  '#006a6a',
        'on-error-container':         '#93000a',
        'on-secondary-fixed-variant': '#004f4f',
        'on-tertiary':                '#ffffff',
        'surface-container-low':      '#f3f3f3',
        'on-secondary':               '#ffffff',
        'surface-container-highest':  '#e2e2e2',
        'error':                      '#ba1a1a',
        'inverse-primary':            '#ffb59a',
        'surface-tint':               '#a83900',
        'outline':                    '#8f7066',
        'outline-variant':            '#e3bfb2',
        'background':                 '#f9f9f9',
        'on-background':              '#1a1c1c',
        'inverse-surface':            '#2f3131',
        'on-tertiary-container':      '#fffbff',
        'secondary-container':        '#90efef',
        'surface-container':          '#eeeeee',
      },
      borderRadius: {
        DEFAULT: '1rem', lg: '2rem', xl: '3rem', full: '9999px',
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans'],
        body:     ['Be Vietnam Pro'],
      },
    },
  },
};

// ── Toast ─────────────────────────────────────────────────────────────────
/**
 * Show a brief pill toast notification.
 * @param {string} msg
 * @param {number} [dur=2200] ms
 */
export function showToast(msg, dur = 2200) {
  const t = document.getElementById('bb-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), dur);
}

// ── Formatters ────────────────────────────────────────────────────────────
export const formatPrice  = (n) => '$' + Number(n).toFixed(2);
export const generateCode = ()  => String(Math.floor(1000 + Math.random() * 9000));

// ── Menu Data ─────────────────────────────────────────────────────────────
export const MEMBER_COLORS = ['#a43700','#006a6a','#7b5500','#1a1c1c','#93000a'];

export const MENU_ITEMS = [
  {
    id: 'avocado_bowl', name: 'Avocado Power Bowl', price: 8.50, cal: 420,
    protein: 18, carbs: 52, fat: 16, tag: 'HIGH PROTEIN',
    tagStyle: 'background:#006a6a;color:#fff',
    note: 'Smashed avocado, warm quinoa, roasted chickpeas, and a citrus-tahini drizzle.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn01_Ayw-F4GTQpM178gQt2PiPIe6zp5ncodJcdvLZDFtZb8liRyCVR8gia8uCcUrodk8eHF55KSfvrYDfT9P2ycX5M9_qpmDGngqHYmuMv1pieuOAHTOd4988i22GSAZAQUzJ-sA-dLsPKqNl8TJxQgtiCmRiu6mrjTjY15b-5t-SIL3Z8ICdXXTQ5rePhkspbZOozUTKD7z_sc0U0RFWT39hzI6k42zDHU_Bc2VRyJZOHiHHywe_TIv0gPeIpoFSeUIFGhiDcrI4',
    style: 'featured', filter: ['all','5to10'],
  },
  {
    id: 'honey_greek', name: 'Honey Greek Curd', price: 4.25, cal: 210,
    protein: 9, carbs: 28, fat: 5, tag: 'BUDGET PICK',
    tagStyle: 'background:#ffdeac;color:#281900',
    note: 'Creamy Greek yogurt with local honey and house-made granola.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMTvm8uz_lzFWJD_Ld5W8XOKuwrotRB2c9A6UpJIlN8WpKushQCL_1DTK8fzmY3sHgBPhdp-PxBY9rB_6Wp-vwmhKLKM3VfnpwRPQgvaIqlcSGQlyPi4DFs0nGwKg2ej_Qw46NuIvGOSyBYGcwxMniMty4Q-FqoL-ydQ1GhzeiwX5W_p4uRDmZ3RYOchz_huhnlSt1Raa6hkUpftL2RDkhgeUnHsGUkeDTnF8tad3InxpruE4mNGihdWgsKVFdLgelnW3AvCP98he4',
    style: 'compact', filter: ['all','under5'],
  },
  {
    id: 'terra_latte', name: 'Terra Signature Latte', price: 5.50, cal: 180,
    protein: 6, carbs: 22, fat: 7, tag: 'SIGNATURE',
    tagStyle: 'background:#ffdbcf;color:#380d00',
    note: 'Double shot espresso, oat milk, and a hint of lavender.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuyGPufb3FJOrbq1n3TItrha0oLe9iZfTNT9SR2O3NgCyGY7CqnYjG_Fr_RWCvycGE59eIRsUaPo2sw1gfKhuIFu6ZN1exy-bvYi2k3Jrj2iqSljfG_lwRslFjXdEVPVK7LDUcInZNDjo8DQbdCzpC0SaQSsvKNXeFUfnwekkFaMyIuVxQc3J1sfxzTluD_3x9gwA1YVlMn3XYVdL8mGMzsIZeaF0VXNYa1pF_uDYNKySuS4ct-hfCHsyYc8-jMZ5',
    style: 'featured', filter: ['all','5to10'],
  },
  {
    id: 'spicy_salmon', name: 'Spicy Salmon Quinoa Bowl', price: 14.50, cal: 490,
    protein: 38, carbs: 44, fat: 14, tag: 'HIGH PROTEIN',
    tagStyle: 'background:#006a6a;color:#fff',
    note: 'Fresh salmon, quinoa, cucumber, and house gochujang sauce.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArnuuWypGAoy5poADW_Co6wjNLGUEYzO4_lJIo-w1mX7Cqj7RIKgt_wP9EVXOHL696xqbN1wWnqcZuFAfBciRoWfxBW0YET_CNwxZcq_B7jYEiZ_Tk-Wk0346h99QTiqn9YYmppZ-ojzXKcgczQyNmGmGysXw748cnAu826zy5hvyQoLgg4Pe7zqjE8DyYi7vnT-1msHJkO-R0CHgBqttdOsk1zwnlDrGUHYY0c0JidhRv95727TAUqWyXxJMzVVRvFzikz_xJdhKO',
    style: 'featured', filter: ['all'],
  },
  {
    id: 'cold_brew', name: 'Oat Milk Cold Brew', price: 5.75, cal: 90,
    protein: 4, carbs: 8, fat: 3, tag: 'BESTSELLER',
    tagStyle: 'background:#93f2f2;color:#002020',
    note: '18-hour cold brew concentrate with oat milk and vanilla syrup.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3wVDrkEcPvQWivgbGe9MQmJBjMWY_JwDGKto6PS0ZwVGDTHo8F_bZPBrYqsrfwsVuzUPu2VAqWdZ4dYMJW-9XtsJfES5OB8iGYHslLotABjLP100pI5x13wgAPKuGCd4QZuZzM0Qm7tk3DK0B5TzS0Cr_Fk7lTb5BBW6SyaGlUh_x7T-rTeMwRjuiciNqHbaJFXrt5PSzYE6QeEI0BXBLgrEsLnAKRVAxNkBhVM6OF3bdk3wIbCb0FQv7jWxRH5FyyLrA_ETR-',
    style: 'compact', filter: ['all','5to10'],
  },
];
