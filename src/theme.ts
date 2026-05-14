import { createTheme } from '@mui/material/styles';
import { colors, muiPalette } from './tokens/colors';

export const SkipitTheme = createTheme({
  palette: muiPalette,

  typography: {
    fontFamily: '"Neulis Sans", "Nunito Sans", "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h1: { fontWeight: 700, color: colors.dark[900] },
    h2: { fontWeight: 700, color: colors.dark[900] },
    h3: { fontWeight: 600, color: colors.dark[900] },
    h4: { fontWeight: 600, color: colors.dark[900] },
    h5: { fontWeight: 600, color: colors.dark[900] },
    h6: { fontWeight: 600, color: colors.dark[900] },
    body1: { color: colors.text.primary },
    body2: { color: colors.text.secondary },
    caption: { color: colors.text.muted, fontSize: '0.75rem' },
  },

  shape: { borderRadius: 8 },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.hover,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.focus,
            borderWidth: 2,
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: colors.light.gray1,
            color: colors.text.secondary,
            fontWeight: 600,
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: `1px solid ${colors.border.default}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: colors.light.gray1 },
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${colors.border.default}`,
            color: colors.text.primary,
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: `1px solid ${colors.border.default}`,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
            backgroundColor: colors.brand.mint,
            color: colors.dark[900],
            '&:hover': { backgroundColor: colors.brand.green2 },
          }),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.75rem', borderRadius: 6, height: 26 },
      },
    },
  },
});
