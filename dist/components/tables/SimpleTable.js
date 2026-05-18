'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Skeleton, Tooltip, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { colors } from '../../tokens/colors';
function getValue(row, key) {
    return key.split('.').reduce((obj, k) => {
        if (obj && typeof obj === 'object')
            return obj[k];
        return undefined;
    }, row);
}
export function SimpleTable({ columns, data, onDelete, showLockIcon, lockTooltip = 'Tiene contrato activo', loading = false, emptyMessage = 'No hay datos para mostrar.', rowKey, }) {
    const hasActions = Boolean(onDelete || showLockIcon);
    function renderCell(col, row) {
        var _a;
        const raw = getValue(row, String(col.key));
        if (col.render)
            return col.render(raw, row);
        if (raw == null || raw === '') {
            return _jsx(Box, { component: "span", sx: { color: colors.text.muted }, children: (_a = col.emptyPlaceholder) !== null && _a !== void 0 ? _a : '—' });
        }
        return (_jsx(Box, { component: "span", sx: { fontWeight: col.bold ? 600 : 400, color: col.muted ? colors.text.muted : colors.text.primary }, children: String(raw) }));
    }
    return (_jsx(TableContainer, { component: Paper, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [columns.map(col => {
                                var _a;
                                return (_jsx(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', width: col.width, children: col.label }, String(col.key)));
                            }), hasActions && _jsx(TableCell, { width: 80 })] }) }), _jsx(TableBody, { children: loading ? (Array.from({ length: 5 }).map((_, i) => (_jsxs(TableRow, { children: [columns.map(col => _jsx(TableCell, { children: _jsx(Skeleton, { variant: "text", width: "70%" }) }, String(col.key))), hasActions && _jsx(TableCell, { children: _jsx(Skeleton, { variant: "circular", width: 24, height: 24 }) })] }, i)))) : data.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length + (hasActions ? 1 : 0), align: "center", sx: { py: 4, color: colors.text.muted }, children: emptyMessage }) })) : (data.map((row, i) => (_jsxs(TableRow, { children: [columns.map(col => {
                                var _a;
                                return (_jsx(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', children: renderCell(col, row) }, String(col.key)));
                            }), hasActions && (_jsx(TableCell, { align: "right", children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }, children: [(showLockIcon === null || showLockIcon === void 0 ? void 0 : showLockIcon(row)) && (_jsx(Tooltip, { title: lockTooltip, placement: "top", children: _jsx(LockOutlinedIcon, { sx: { fontSize: 16, color: colors.text.muted } }) })), onDelete && (_jsx(Tooltip, { title: "Eliminar", placement: "top", children: _jsx(IconButton, { size: "small", onClick: () => onDelete(row), sx: { color: colors.light.gray3, '&:hover': { color: colors.danger.main, backgroundColor: colors.danger.light } }, children: _jsx(DeleteOutlineIcon, { sx: { fontSize: 18 } }) }) }))] }) }))] }, rowKey ? String(getValue(row, String(rowKey))) : i)))) })] }) }));
}
