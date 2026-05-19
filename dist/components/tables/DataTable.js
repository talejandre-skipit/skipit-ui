'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Skeleton, Tooltip, } from '@mui/material';
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
    const [colWidths, setColWidths] = useState({});
    const resizeRef = useRef(null);
    const hasActions = Boolean(onEdit || onDelete);
    function startResize(e, col) {
        var _a;
        e.preventDefault();
        const key = String(col.key);
        const cell = e.currentTarget.closest('th');
        const currentWidth = (_a = colWidths[key]) !== null && _a !== void 0 ? _a : (cell ? cell.getBoundingClientRect().width : (typeof col.width === 'number' ? col.width : 100));
        resizeRef.current = { key, startX: e.clientX, startWidth: currentWidth };
        const onMove = (ev) => {
            if (!resizeRef.current)
                return;
            const { key: k, startX, startWidth } = resizeRef.current;
            setColWidths(prev => (Object.assign(Object.assign({}, prev), { [k]: Math.max(50, startWidth + (ev.clientX - startX)) })));
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
            case 'currency': return (_jsx(Box, { component: "span", sx: { color: colors.danger.main, fontWeight: 600, fontFamily: 'monospace' }, children: formatCurrency(raw) }));
            case 'date': return formatDate(raw);
            default: return raw == null ? '—' : String(raw);
        }
    }
    const headerSx = {
        fontSize: '0.6875rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: colors.text.secondary,
        whiteSpace: 'nowrap',
        overflow: 'visible',
        lineHeight: 1.3,
    };
    const sortLabelSx = Object.assign(Object.assign({}, headerSx), { display: 'inline-flex', alignItems: 'center', gap: '2px', '& .MuiTableSortLabel-icon': {
            opacity: 0.3,
            marginLeft: '2px',
            marginRight: 0,
            flexShrink: 0,
            fontSize: '0.85rem',
        }, '&.Mui-active': { color: colors.text.secondary }, '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1, color: colors.brand.mint }, '&:hover': { color: colors.text.secondary }, '&:hover .MuiTableSortLabel-icon': { opacity: 0.7 } });
    return (_jsx(TableContainer, { component: Paper, elevation: 0, sx: {
            width: '100%',
            overflowX: 'auto',
            border: `1px solid ${colors.border.default}`,
            borderRadius: '10px',
        }, children: _jsxs(Table, { size: "small", sx: { tableLayout: 'auto', width: '100%' }, children: [_jsx(TableHead, { children: _jsxs(TableRow, { sx: { bgcolor: '#f7f9fc' }, children: [columns.map(col => {
                                var _a, _b;
                                const key = String(col.key);
                                const w = (_a = colWidths[key]) !== null && _a !== void 0 ? _a : col.width;
                                const isResizable = col.resizable === true;
                                return (_jsxs(TableCell, { align: (_b = col.align) !== null && _b !== void 0 ? _b : 'left', sx: {
                                        width: w,
                                        minWidth: col.minWidth,
                                        position: 'relative',
                                        px: 1.5,
                                        py: 1.25,
                                        borderBottom: `1px solid ${colors.border.default}`,
                                        userSelect: isResizable ? 'none' : undefined,
                                    }, children: [col.sortable !== false ? (_jsx(TableSortLabel, { active: sortKey === key, direction: sortKey === key ? sortDir : 'asc', onClick: () => handleSort(key), sx: sortLabelSx, children: col.label })) : (_jsx(Box, { component: "span", sx: headerSx, children: col.label })), isResizable && (_jsx(Box, { onMouseDown: e => startResize(e, col), sx: {
                                                position: 'absolute',
                                                right: 0,
                                                top: '20%',
                                                bottom: '20%',
                                                width: 3,
                                                cursor: 'col-resize',
                                                zIndex: 1,
                                                borderRadius: 2,
                                                transition: 'background 0.15s',
                                                '&:hover': { bgcolor: colors.brand.mint },
                                            } }))] }, key));
                            }), hasActions && (_jsx(TableCell, { align: "right", sx: {
                                    width: 80,
                                    px: 1.5,
                                    py: 1.25,
                                    borderBottom: `1px solid ${colors.border.default}`,
                                } }))] }) }), _jsx(TableBody, { children: loading ? (Array.from({ length: 5 }).map((_, i) => (_jsxs(TableRow, { children: [columns.map(col => (_jsx(TableCell, { sx: { px: 1.5, py: 1 }, children: _jsx(Skeleton, { variant: "text", width: "80%" }) }, String(col.key)))), hasActions && (_jsx(TableCell, { sx: { px: 1.5, py: 1 }, children: _jsx(Skeleton, { variant: "text", width: 60 }) }))] }, i)))) : sortedData.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: columns.length + (hasActions ? 1 : 0), align: "center", sx: { py: 5, color: colors.text.muted, fontSize: '0.875rem' }, children: emptyMessage }) })) : (sortedData.map((row, i) => (_jsxs(TableRow, { hover: true, sx: {
                            '&:last-child td': { borderBottom: 0 },
                            '&:hover': { bgcolor: '#f7f9fc' },
                        }, children: [columns.map(col => {
                                var _a;
                                const content = renderCell(col, row);
                                const isText = typeof content === 'string' || typeof content === 'number';
                                return (_jsx(TableCell, { align: (_a = col.align) !== null && _a !== void 0 ? _a : 'left', sx: {
                                        px: 1.5,
                                        py: 1,
                                        fontSize: '0.8125rem',
                                        color: colors.text.primary,
                                        maxWidth: col.width ? undefined : 220,
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }, children: isText ? (_jsx(Tooltip, { title: String(content), placement: "top", disableHoverListener: String(content).length < 30, children: _jsx(Box, { component: "span", sx: { display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: content }) })) : content }, String(col.key)));
                            }), hasActions && (_jsx(TableCell, { align: "right", sx: { px: 1.5, py: 0.75, whiteSpace: 'nowrap' }, children: _jsx(ActionButtons, { onEdit: onEdit ? () => onEdit(row) : undefined, onDelete: onDelete ? () => onDelete(row) : undefined, deleteConfirmed: deleteConfirmed }) }))] }, rowKey ? String(getValue(row, String(rowKey))) : i)))) })] }) }));
}
