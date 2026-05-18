// ============================================================
// SKIPIT — Design Tokens / Colores
// Fuente de verdad para todos los colores del sistema.
// NUNCA hardcodear colores en los componentes, siempre importar desde acá.
// ============================================================
export const colors = {
    // ── Brand verde (de claro a oscuro) ────────────────────────
    brand: {
        mint: '#61F8A9', // acento principal, CTAs, focus rings
        green2: '#3BD58B',
        green3: '#299E66',
        dark: '#176640', // verde oscuro brand
    },
    // ── Principal oscuro (de claro a oscuro) ───────────────────
    dark: {
        900: '#062E35', // el más usado — headers, texto dark, fondos oscuros
        800: '#04252B',
        700: '#031C21',
        600: '#021418', // el más oscuro
    },
    // ── Blancos y grises claros ────────────────────────────────
    light: {
        white: '#FDFDFD', // background principal
        gray1: '#F7F7F7',
        gray2: '#F2F2F2',
        gray3: '#D6DADB', // bordes, separadores
    },
    // ── Paleta secundaria (púrpura) ────────────────────────────
    purple: {
        100: '#D0C6FB',
        200: '#C1B4FD',
        300: '#B1A1FF',
        400: '#8376FF', // principal — usar para destacados secundarios
    },
    // ── Semánticos (derivados de la paleta) ───────────────────
    status: {
        active: {
            bg: '#DCFCE7',
            text: '#176640', // brand.dark
            border: '#3BD58B', // brand.green2
        },
        paused: {
            bg: '#FEF9C3',
            text: '#CA8A04',
            border: '#FDE047',
        },
        lost: {
            bg: '#FEE2E2',
            text: '#DC2626',
            border: '#FCA5A5',
        },
    },
    // ── Destructivo ────────────────────────────────────────────
    danger: {
        main: '#EF4444',
        light: '#FEE2E2',
        dark: '#DC2626',
    },
    // ── Texto ──────────────────────────────────────────────────
    text: {
        primary: '#062E35', // dark.900
        secondary: '#64748B',
        muted: '#94A3B8',
        disabled: '#D6DADB', // light.gray3
    },
    // ── Bordes ─────────────────────────────────────────────────
    border: {
        default: '#D6DADB', // light.gray3
        focus: '#61F8A9', // brand.mint — SIEMPRE en focus
        hover: '#B1A1FF', // purple.300 — hover sutil
    },
};
// ── Paleta para MUI ThemeProvider ─────────────────────────────
export const muiPalette = {
    primary: {
        main: colors.brand.mint,
        dark: colors.dark[900],
        contrastText: colors.dark[900],
    },
    secondary: {
        main: colors.purple[400],
        contrastText: colors.light.white,
    },
    error: {
        main: colors.danger.main,
    },
    text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
        disabled: colors.text.disabled,
    },
    background: {
        default: colors.light.white,
        paper: '#FFFFFF',
    },
    divider: colors.border.default,
};
