'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Chip } from '@mui/material';
import { colors } from '../../tokens/colors';
const styleMap = {
    activo: {
        bg: colors.status.active.bg,
        text: colors.status.active.text,
        border: colors.status.active.border,
        label: 'Activo',
    },
    pausado: {
        bg: colors.status.paused.bg,
        text: colors.status.paused.text,
        border: colors.status.paused.border,
        label: 'Pausado',
    },
    perdido: {
        bg: colors.status.lost.bg,
        text: colors.status.lost.text,
        border: colors.status.lost.border,
        label: 'Perdido',
    },
    green: { bg: '#DCFCE7', text: '#176640', border: '#3BD58B', label: '' },
    yellow: { bg: '#FEF9C3', text: '#CA8A04', border: '#FDE047', label: '' },
    red: { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5', label: '' },
    blue: { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', label: '' },
    gray: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', label: '' },
};
const fallbackStyle = {
    bg: colors.light.gray2,
    text: colors.text.secondary,
    border: colors.border.default,
};
export function StatusBadge({ status, label, size = 'small' }) {
    var _a, _b;
    const normalized = status === null || status === void 0 ? void 0 : status.toLowerCase();
    const style = (_a = styleMap[normalized]) !== null && _a !== void 0 ? _a : Object.assign(Object.assign({}, fallbackStyle), { label: status });
    const displayLabel = (_b = label !== null && label !== void 0 ? label : style.label) !== null && _b !== void 0 ? _b : status;
    return (_jsx(Chip, { label: displayLabel, size: size, sx: {
            backgroundColor: style.bg,
            color: style.text,
            border: `1px solid ${style.border}`,
            fontWeight: 600,
            fontSize: '0.72rem',
            height: 24,
            '& .MuiChip-label': { px: 1.25 },
        } }));
}
