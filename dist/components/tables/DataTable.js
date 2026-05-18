'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Skeleton } from '@mui/material';
import { ActionButtons } from '../actions/ActionButtons';
import { colors } from '../../tokens/colors';
function getValue(row, key) {
    return key.split('.').reduce((obj, k) => {
        if (obj && typeof obj === 'object')
            return obj[k];
        return undefined;
    }, row);
}
function formatCurrency(value) {
    if (value == null)
        return '—';
    const num = typeof value === 'number' ? value : Number(value);
    return `$ ${num.toLocaleString('es-AR')}`;
}
function formatDate(value) {
    if (!value)
        return '—';
    const d = new Date(value);
    return d.toLocaleDateString('es-AR');
}
export function DataTable({ columns, data, onEdit, onDelete, deleteConfirmed = true, loading = false, emptyMessage = 'No hay datos para mostrar.', rowKey, }) {
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const hasActions = Boolean(onEdit || onDelete);
    function handleSort(key) {
        if (sortKey === key)
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    }
    const sortedData = useMemo(() => {
        if (!sortKey)
            return data;
        return [...data].sort((a, b) => {
            const av = getValue(a, sortKey);
            const bv = getValue(b, sortKey);
            if (av == null)
                return 1;
            if (bv == null)
                return -1;
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [data, sortKey, sortDir]);
    function renderCell(col, row) {
        const raw = getValue(row, String(col.key));
        if (col.render)
            return col.render(raw, row);
        switch (col.format) {
            case 'currency': return _jsx(Box, { component: "span", sx: { color: colors.danger.main, fontWeight: 600 }, children: formatCurrency(raw) });
            case 'date': return formatDate(raw);
            default: return raw == null ? '—' : String(raw);
        }
    }
    return (_jsx(TableContainer, { component: Paper, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [columns.map(col => {
                                var _a;
                                return (_jsx(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', width: col.width, children: col.sortable !== false ? (_jsx(TableSortLabel, { active: sortKey === String(col.key), direction: sortKey === String(col.key) ? sortDir : 'asc', onClick: () => handleSort(String(col.key)), sx: { '& .MuiTableSortLabel-icon': { opacity: 0.4 }, '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1 } }, children: col.label })) : col.label }, String(col.key)));
                            }), hasActions && _jsx(TableCell, { align: "right", width: 80 })] }) }), _jsx(TableBody, { children: loading ? (Array.from({ length: 5 }).map((_, i) => (_jsxs(TableRow, { children: [columns.map(col => _jsx(TableCell, { children: _jsx(Skeleton, { variant: "text", width: "80%" }) }, String(col.key))), hasActions && _jsx(TableCell, { children: _jsx(Skeleton, { variant: "text", width: 60 }) })] }, i)))) : sortedData.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length + (hasActions ? 1 : 0), align: "center", sx: { py: 4, color: colors.text.muted }, children: emptyMessage }) })) : (sortedData.map((row, i) => (_jsxs(TableRow, { children: [columns.map(col => {
                                var _a;
                                return (_jsx(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', children: renderCell(col, row) }, String(col.key)));
                            }), hasActions && (_jsx(TableCell, { align: "right", children: _jsx(ActionButtons, { onEdit: onEdit ? () => onEdit(row) : undefined, onDelete: onDelete ? () => onDelete(row) : undefined, deleteConfirmed: deleteConfirmed }) }))] }, rowKey ? String(getValue(row, String(rowKey))) : i)))) })] }) }));
}
