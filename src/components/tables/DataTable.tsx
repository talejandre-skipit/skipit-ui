'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box, Skeleton } from '@mui/material';
import { ActionButtons } from '../actions/ActionButtons';
import { colors } from '../../tokens/colors';

export interface DataTableColumn<T = Record<string, unknown>> {
  key:       keyof T | string;
  label:     string;
  sortable?: boolean;
  align?:    'left' | 'center' | 'right';
  width?:    number | string;
  format?:   'currency' | 'date' | 'none';
  render?:   (value: unknown, row: T) => React.ReactNode;
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
  const hasActions = Boolean(onEdit || onDelete);

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
      case 'currency': return <Box component="span" sx={{ color: colors.danger.main, fontWeight: 600 }}>{formatCurrency(raw)}</Box>;
      case 'date':     return formatDate(raw);
      default:         return raw == null ? '—' : String(raw);
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={String(col.key)} align={col.align ?? 'left'} width={col.width}>
                {col.sortable !== false ? (
                  <TableSortLabel
                    active={sortKey === String(col.key)}
                    direction={sortKey === String(col.key) ? sortDir : 'asc'}
                    onClick={() => handleSort(String(col.key))}
                    sx={{ '& .MuiTableSortLabel-icon': { opacity: 0.4 }, '&.Mui-active .MuiTableSortLabel-icon': { opacity: 1 } }}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : col.label}
              </TableCell>
            ))}
            {hasActions && <TableCell align="right" width={80} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map(col => <TableCell key={String(col.key)}><Skeleton variant="text" width="80%" /></TableCell>)}
                {hasActions && <TableCell><Skeleton variant="text" width={60} /></TableCell>}
              </TableRow>
            ))
          ) : sortedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} align="center" sx={{ py: 4, color: colors.text.muted }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, i) => (
              <TableRow key={rowKey ? String(getValue(row, String(rowKey))) : i}>
                {columns.map(col => (
                  <TableCell key={String(col.key)} align={col.align ?? 'left'}>{renderCell(col, row)}</TableCell>
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
