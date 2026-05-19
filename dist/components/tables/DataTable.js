'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Skeleton, } from '@mui/material';
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
    const [filters, setFilters] = useState({});
    const [colWidths, setColWidths] = useState({});
    const resizeRef = useRef(null);
    const hasActions = Boolean(onEdit || onDelete);
    const hasFilters = columns.some(c => c.filterable);
    const hasResizable = columns.some(c => c.resizable !== false);
    function startResize(e, col) {
        var _a;
        e.preventDefault();
        const key = String(col.key);
        const currentWidth = (_a = colWidths[key]) !== null && _a !== void 0 ? _a : (typeof col.width === 'number' ? col.width : 100);
        resizeRef.current = { key, startX: e.clientX, startWidth: currentWidth };
        const onMove = (ev) => {
            if (!resizeRef.current)
                return;
            const { key: k, startX, startWidth } = resizeRef.current;
            setColWidths(prev => (Object.assign(Object.assign({}, prev), { [k]: Math.max(40, startWidth + (ev.clientX - startX)) })));
        };
        const onUp = () => {
            resizeRef.current = null;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }
    function handleSort(key) {
        if (sortKey === key)
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        else {
            setSortKey(key);
            setSortDir('asc');
        }
    }
    const filteredData = useMemo(() => {
        const active = Object.entries(filters).filter(([, v]) => v.trim() !== '');
        if (active.length === 0)
            return data;
        return data.filter(row => active.every(([colKey, val]) => {
            var _a, _b;
            const col = columns.find(c => String(c.key) === colKey);
            const path = (_a = col === null || col === void 0 ? void 0 : col.filterKey) !== null && _a !== void 0 ? _a : colKey;
            return String((_b = getValue(row, path)) !== null && _b !== void 0 ? _b : '').toLowerCase().includes(val.toLowerCase());
        }));
    }, [data, filters, columns]);
    const sortedData = useMemo(() => {
        if (!sortKey)
            return filteredData;
        return [...filteredData].sort((a, b) => {
            const av = getValue(a, sortKey);
            const bv = getValue(b, sortKey);
            if (av == null)
                return 1;
            if (bv == null)
                return -1;
            const cmp = av < bv ? -1 : av > bv ? 1 : 0;
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [filteredData, sortKey, sortDir]);
    function renderCell(col, row) {
        const raw = getValue(row, String(col.key));
        if (col.render)
            return col.render(raw, row);
        switch (col.format) {
            case 'currency': return (_jsx(Box, { component: "span", sx: { color: colors.danger.main, fontWeight: 600 }, children: formatCurrency(raw) }));
            case 'date': return formatDate(raw);
            default: return raw == null ? '—' : String(raw);
        }
    }
    function getWidth(col) {
        var _a;
        const key = String(col.key);
        return (_a = colWidths[key]) !== null && _a !== void 0 ? _a : col.width;
    }
    return (_jsx(TableContainer, { component: Paper, elevation: 0, sx: {
            width: '100%',
            overflowX: 'auto',
            border: `1px solid ${colors.border.default}`,
            borderRadius: '12px',
        }, children: _jsxs(Table, { size: "small", sx: { tableLayout: 'fixed', width: '100%', minWidth: 0 }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f7f9fc' }, children: [columns.map(col => {
                                var _a, _b;
                                const w = getWidth(col);
                                const isResizable = col.resizable !== false && hasResizable;
                                return (_jsxs(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', sx: {
                                        width: w,
                                        position: 'relative',
                                        verticalAlign: 'top',
                                        overflow: 'hidden',
                                        py: hasFilters ? 0.75 : undefined,
                                    }, children: [_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', gap: '4px' }, children: [col.sortable !== false ? (_jsx(TableSortLabel, { active: sortKey === String(col.key), direction: sortKey === String(col.key) ? sortDir : 'asc', onClick: () => handleSort(String(col.key)), sx: {
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        whiteSpace: 'nowrap',
                                                        '& .MuiTableSortLabel-icon': {
                                                            opacity: 0.35,
                                                            marginLeft: '2px',
                                                            marginRight: 0,
                                                            flexShrink: 0,
                                                        },
                                                        '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1 },
                                                    }, children: col.label })) : (_jsx(Box, { component: "span", sx: { whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }, children: col.label })), col.filterable && (_jsx("input", { value: (_b = filters[String(col.key)]) !== null && _b !== void 0 ? _b : '', onChange: e => setFilters(prev => (Object.assign(Object.assign({}, prev), { [String(col.key)]: e.target.value }))), placeholder: "Filtrar\u2026", onClick: e => e.stopPropagation(), style: {
                                                        width: '100%',
                                                        padding: '2px 6px',
                                                        fontSize: '11px',
                                                        border: `1px solid ${colors.border.default}`,
                                                        borderRadius: 4,
                                                        outline: 'none',
                                                        background: '#fff',
                                                        boxSizing: 'border-box',
                                                        fontFamily: 'inherit',
                                                    }, onFocus: e => { e.target.style.borderColor = colors.border.focus; }, onBlur: e => { e.target.style.borderColor = colors.border.default; } }))] }), isResizable && (_jsx(Box, { onMouseDown: e => startResize(e, col), sx: {
                                                position: 'absolute',
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: 4,
                                                cursor: 'col-resize',
                                                zIndex: 1,
                                                '&:hover': { bgcolor: colors.brand.mint, opacity: 0.5 },
                                                userSelect: 'none',
                                            } }))] }, String(col.key)));
                            }), hasActions && _jsx(TableCell, { align: "right", sx: { width: 80 } })] }) }), _jsx(TableBody, { children: loading ? (Array.from({ length: 5 }).map((_, i) => (_jsxs(TableRow, { children: [columns.map(col => (_jsx(TableCell, { children: _jsx(Skeleton, { variant: "text", width: "80%" }) }, String(col.key)))), hasActions && _jsx(TableCell, { children: _jsx(Skeleton, { variant: "text", width: 60 }) })] }, i)))) : sortedData.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length + (hasActions ? 1 : 0), align: "center", sx: { py: 4, color: colors.text.muted }, children: emptyMessage }) })) : (sortedData.map((row, i) => (_jsxs(TableRow, { hover: true, children: [columns.map(col => {
                                var _a;
                                return (_jsx(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', sx: { overflow: 'hidden', maxWidth: 0 }, children: renderCell(col, row) }, String(col.key)));
                            }), hasActions && (_jsx(TableCell, { align: "right", children: _jsx(ActionButtons, { onEdit: onEdit ? () => onEdit(row) : undefined, onDelete: onDelete ? () => onDelete(row) : undefined, deleteConfirmed: deleteConfirmed }) }))] }, rowKey ? String(getValue(row, String(rowKey))) : i)))) })] }) }));
}
