'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, Box, Skeleton,
} from '@mui/material';
import { ActionButtons } from '../actions/ActionButtons';
import { colors } from '../../tokens/colors';

export interface DataTableColumn<T = Record<string, unknown>> {
  key:         keyof T | string;
  label:       string;
  sortable?:   boolean;
  /** Renders a filter input below the header label */
  filterable?: boolean;
  /** Dot-path used for filtering when key points to an object (e.g. "comercial.nombre") */
  filterKey?:  string;
  /** Shows a drag handle on the right border to resize this column */
  resizable?:  boolean;
  align?:      'left' | 'center' | 'right';
  width?:      number | string;
  format?:     'currency' | 'date' | 'none';
  render?:     (value: unknown, row: T) => React.ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns:          DataTableColumn<T>[];
  data:             T[];
  onEdit?:          (row: T) => void;
  onDelete?:        (row: T) => void;
  deleteConfirmed?: boolean;
  loading?:         boolean;
  emptyMessage?:    string;
  rowKey?:          keyof T | string;
}

function getValue<T extends Record<string, unknown>>(row: T, key: string): unknown {
  return key.split('.').reduce((obj: unknown, k) => {
    if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k];
    return undefined;
  }, row);
}

function formatCurrency(value: unknown): string {
  if (value == null) return '—';
  const num = typeof value === 'number' ? value : Number(value);
  return `$ ${num.toLocaleString('es-AR')}`;
}

function formatDate(value: unknown): string {
  if (!value) return '—';
  const d = new Date(value as string);
  return d.toLocaleDateString('es-AR');
}

export function DataTable<T extends Record<string, unknown>>({
  columns, data, onEdit, onDelete, deleteConfirmed = true,
  loading = false, emptyMessage = 'No hay datos para mostrar.', rowKey,
}: DataTableProps<T>) {

  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const resizeRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const hasActions  = Boolean(onEdit || onDelete);
  const hasFilters  = columns.some(c => c.filterable);
  const hasResizable = columns.some(c => c.resizable !== false);

  function startResize(e: React.MouseEvent, col: DataTableColumn<T>) {
    e.preventDefault();
    const key = String(col.key);
    const currentWidth = colWidths[key] ?? (typeof col.width === 'number' ? col.width : 100);
    resizeRef.current = { key, startX: e.clientX, startWidth: currentWidth };

    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const { key: k, startX, startWidth } = resizeRef.current;
      setColWidths(prev => ({ ...prev, [k]: Math.max(40, startWidth + (ev.clientX - startX)) }));
    };
    const onUp = () => {
      resizeRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  function handleSort(key: string) {
    if (sortKey === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filteredData = useMemo(() => {
    const active = Object.entries(filters).filter(([, v]) => v.trim() !== '');
    if (active.length === 0) return data;
    return data.filter(row =>
      active.every(([colKey, val]) => {
        const col = columns.find(c => String(c.key) === colKey);
        const path = col?.filterKey ?? colKey;
        return String(getValue(row, path) ?? '').toLowerCase().includes(val.toLowerCase());
      })
    );
  }, [data, filters, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = getValue(a, sortKey);
      const bv = getValue(b, sortKey);
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortKey, sortDir]);

  function renderCell(col: DataTableColumn<T>, row: T): React.ReactNode {
    const raw = getValue(row, String(col.key));
    if (col.render) return col.render(raw, row);
    switch (col.format) {
      case 'currency': return (
        <Box component="span" sx={{ color: colors.danger.main, fontWeight: 600 }}>
          {formatCurrency(raw)}
        </Box>
      );
      case 'date': return formatDate(raw);
      default:     return raw == null ? '—' : String(raw);
    }
  }

  function getWidth(col: DataTableColumn<T>): number | string | undefined {
    const key = String(col.key);
    return colWidths[key] ?? col.width;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        width: '100%',
        overflowX: 'auto',
        border: `1px solid ${colors.border.default}`,
        borderRadius: '12px',
      }}
    >
      <Table
        size="small"
        sx={{ tableLayout: 'fixed', width: '100%', minWidth: 0 }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: '#f7f9fc' }}>
            {columns.map(col => {
              const w = getWidth(col);
              const isResizable = col.resizable !== false && hasResizable;
              return (
                <TableCell
                  key={String(col.key)}
                  align={col.align ?? 'left'}
                  sx={{
                    width: w,
                    position: 'relative',
                    verticalAlign: 'top',
                    overflow: 'hidden',
                    py: hasFilters ? 0.75 : undefined,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {col.sortable !== false ? (
                      <TableSortLabel
                        active={sortKey === String(col.key)}
                        direction={sortKey === String(col.key) ? sortDir : 'asc'}
                        onClick={() => handleSort(String(col.key))}
                        sx={{
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
                        }}
                      >
                        {col.label}
                      </TableSortLabel>
                    ) : (
                      <Box
                        component="span"
                        sx={{ whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 600, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                      >
                        {col.label}
                      </Box>
                    )}

                    {col.filterable && (
                      <input
                        value={filters[String(col.key)] ?? ''}
                        onChange={e => setFilters(prev => ({ ...prev, [String(col.key)]: e.target.value }))}
                        placeholder="Filtrar…"
                        onClick={e => e.stopPropagation()}
                        style={{
                          width: '100%',
                          padding: '2px 6px',
                          fontSize: '11px',
                          border: `1px solid ${colors.border.default}`,
                          borderRadius: 4,
                          outline: 'none',
                          background: '#fff',
                          boxSizing: 'border-box',
                          fontFamily: 'inherit',
                        }}
                        onFocus={e => { e.target.style.borderColor = colors.border.focus; }}
                        onBlur={e => { e.target.style.borderColor = colors.border.default; }}
                      />
                    )}
                  </Box>

                  {isResizable && (
                    <Box
                      onMouseDown={e => startResize(e, col)}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        cursor: 'col-resize',
                        zIndex: 1,
                        '&:hover': { bgcolor: colors.brand.mint, opacity: 0.5 },
                        userSelect: 'none',
                      }}
                    />
                  )}
                </TableCell>
              );
            })}
            {hasActions && <TableCell align="right" sx={{ width: 80 }} />}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map(col => (
                  <TableCell key={String(col.key)}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
                {hasActions && <TableCell><Skeleton variant="text" width={60} /></TableCell>}
              </TableRow>
            ))
          ) : sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasActions ? 1 : 0)}
                align="center"
                sx={{ py: 4, color: colors.text.muted }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, i) => (
              <TableRow
                key={rowKey ? String(getValue(row, String(rowKey))) : i}
                hover
              >
                {columns.map(col => (
                  <TableCell
                    key={String(col.key)}
                    align={col.align ?? 'left'}
                    sx={{ overflow: 'hidden', maxWidth: 0 }}
                  >
                    {renderCell(col, row)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell align="right">
                    <ActionButtons
                      onEdit={onEdit ? () => onEdit(row) : undefined}
                      onDelete={onDelete ? () => onDelete(row) : undefined}
                      deleteConfirmed={deleteConfirmed}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
