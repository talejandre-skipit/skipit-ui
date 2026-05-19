'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TableSortLabel, Box, Skeleton, Tooltip,
} from '@mui/material';
import { ActionButtons } from '../actions/ActionButtons';
import { colors } from '../../tokens/colors';

export interface DataTableColumn<T = Record<string, unknown>> {
  key:        keyof T | string;
  label:      string;
  sortable?:  boolean;
  resizable?: boolean;
  align?:     'left' | 'center' | 'right';
  width?:     number | string;
  minWidth?:  number;
  format?:    'currency' | 'date' | 'none';
  render?:    (value: unknown, row: T) => React.ReactNode;
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
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const resizeRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const hasActions = Boolean(onEdit || onDelete);

  function startResize(e: React.MouseEvent, col: DataTableColumn<T>) {
    e.preventDefault();
    const key = String(col.key);
    const cell = (e.currentTarget as HTMLElement).closest('th') as HTMLElement | null;
    const currentWidth = colWidths[key] ?? (cell ? cell.getBoundingClientRect().width : (typeof col.width === 'number' ? col.width : 100));
    resizeRef.current = { key, startX: e.clientX, startWidth: currentWidth };

    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const { key: k, startX, startWidth } = resizeRef.current;
      setColWidths(prev => ({ ...prev, [k]: Math.max(50, startWidth + (ev.clientX - startX)) }));
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

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = getValue(a, sortKey);
      const bv = getValue(b, sortKey);
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  function renderCell(col: DataTableColumn<T>, row: T): React.ReactNode {
    const raw = getValue(row, String(col.key));
    if (col.render) return col.render(raw, row);
    switch (col.format) {
      case 'currency': return (
        <Box component="span" sx={{ color: colors.danger.main, fontWeight: 600, fontFamily: 'monospace' }}>
          {formatCurrency(raw)}
        </Box>
      );
      case 'date': return formatDate(raw);
      default:     return raw == null ? '—' : String(raw);
    }
  }

  const headerSx = {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: colors.text.secondary,
    whiteSpace: 'nowrap' as const,
    overflow: 'visible',
    lineHeight: 1.3,
  };

  const sortLabelSx = {
    ...headerSx,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    '& .MuiTableSortLabel-icon': {
      opacity: 0.3,
      marginLeft: '2px',
      marginRight: 0,
      flexShrink: 0,
      fontSize: '0.85rem',
    },
    '&.Mui-active': { color: colors.text.secondary },
    '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1, color: colors.brand.mint },
    '&:hover': { color: colors.text.secondary },
    '&:hover .MuiTableSortLabel-icon': { opacity: 0.7 },
  };

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        width: '100%',
        overflowX: 'auto',
        border: `1px solid ${colors.border.default}`,
        borderRadius: '10px',
      }}
    >
      <Table
        size="small"
        sx={{ tableLayout: 'auto', width: '100%' }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: '#f7f9fc' }}>
            {columns.map(col => {
              const key = String(col.key);
              const w = colWidths[key] ?? col.width;
              const isResizable = col.resizable === true;
              return (
                <TableCell
                  key={key}
                  align={col.align ?? 'left'}
                  sx={{
                    width: w,
                    minWidth: col.minWidth,
                    position: 'relative',
                    px: 1.5,
                    py: 1.25,
                    borderBottom: `1px solid ${colors.border.default}`,
                    userSelect: isResizable ? 'none' : undefined,
                  }}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={sortKey === key}
                      direction={sortKey === key ? sortDir : 'asc'}
                      onClick={() => handleSort(key)}
                      sx={sortLabelSx}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    <Box component="span" sx={headerSx}>
                      {col.label}
                    </Box>
                  )}

                  {isResizable && (
                    <Box
                      onMouseDown={e => startResize(e, col)}
                      sx={{
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
                      }}
                    />
                  )}
                </TableCell>
              );
            })}
            {hasActions && (
              <TableCell
                align="right"
                sx={{
                  width: 80,
                  px: 1.5,
                  py: 1.25,
                  borderBottom: `1px solid ${colors.border.default}`,
                }}
              />
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map(col => (
                  <TableCell key={String(col.key)} sx={{ px: 1.5, py: 1 }}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell sx={{ px: 1.5, py: 1 }}>
                    <Skeleton variant="text" width={60} />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : sortedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (hasActions ? 1 : 0)}
                align="center"
                sx={{ py: 5, color: colors.text.muted, fontSize: '0.875rem' }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, i) => (
              <TableRow
                key={rowKey ? String(getValue(row, String(rowKey))) : i}
                hover
                sx={{
                  '&:last-child td': { borderBottom: 0 },
                  '&:hover': { bgcolor: '#f7f9fc' },
                }}
              >
                {columns.map(col => {
                  const content = renderCell(col, row);
                  const isText = typeof content === 'string' || typeof content === 'number';
                  return (
                    <TableCell
                      key={String(col.key)}
                      align={col.align ?? 'left'}
                      sx={{
                        px: 1.5,
                        py: 1,
                        fontSize: '0.8125rem',
                        color: colors.text.primary,
                        maxWidth: col.width ? undefined : 220,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {isText ? (
                        <Tooltip title={String(content)} placement="top" disableHoverListener={String(content).length < 30}>
                          <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {content}
                          </Box>
                        </Tooltip>
                      ) : content}
                    </TableCell>
                  );
                })}
                {hasActions && (
                  <TableCell align="right" sx={{ px: 1.5, py: 0.75, whiteSpace: 'nowrap' }}>
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
