'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Skeleton, Tooltip, IconButton } from '@mui/material';
import LockOutlinedIcon  from '@mui/icons-material/LockOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { colors } from '../../tokens/colors';

export interface SimpleTableColumn<T = Record<string, unknown>> {
  key:               keyof T | string;
  label:             string;
  width?:            number | string;
  align?:            'left' | 'center' | 'right';
  muted?:            boolean;
  bold?:             boolean;
  emptyPlaceholder?: string;
  render?:           (value: unknown, row: T) => React.ReactNode;
}

export interface SimpleTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
  columns:        SimpleTableColumn<T>[];
  data:           T[];
  onDelete?:      (row: T) => void;
  showLockIcon?:  (row: T) => boolean;
  lockTooltip?:   string;
  loading?:       boolean;
  emptyMessage?:  string;
  rowKey?:        keyof T | string;
}

function getValue<T extends Record<string, unknown>>(row: T, key: string): unknown {
  return key.split('.').reduce((obj: unknown, k) => {
    if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k];
    return undefined;
  }, row);
}

export function SimpleTable<T extends Record<string, unknown>>({
  columns, data, onDelete, showLockIcon, lockTooltip = 'Tiene contrato activo',
  loading = false, emptyMessage = 'No hay datos para mostrar.', rowKey,
}: SimpleTableProps<T>) {

  const hasActions = Boolean(onDelete || showLockIcon);

  function renderCell(col: SimpleTableColumn<T>, row: T): React.ReactNode {
    const raw = getValue(row, String(col.key));
    if (col.render) return col.render(raw, row);
    if (raw == null || raw === '') {
      return <Box component="span" sx={{ color: colors.text.muted }}>{col.emptyPlaceholder ?? '—'}</Box>;
    }
    return (
      <Box component="span" sx={{ fontWeight: col.bold ? 600 : 400, color: col.muted ? colors.text.muted : colors.text.primary }}>
        {String(raw)}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell key={String(col.key)} align={col.align ?? 'left'} width={col.width}>
                {col.label}
              </TableCell>
            ))}
            {hasActions && <TableCell width={80} />}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map(col => <TableCell key={String(col.key)}><Skeleton variant="text" width="70%" /></TableCell>)}
                {hasActions && <TableCell><Skeleton variant="circular" width={24} height={24} /></TableCell>}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} align="center" sx={{ py: 4, color: colors.text.muted }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow key={rowKey ? String(getValue(row, String(rowKey))) : i}>
                {columns.map(col => (
                  <TableCell key={String(col.key)} align={col.align ?? 'left'}>{renderCell(col, row)}</TableCell>
                ))}
                {hasActions && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                      {showLockIcon?.(row) && (
                        <Tooltip title={lockTooltip} placement="top">
                          <LockOutlinedIcon sx={{ fontSize: 16, color: colors.text.muted }} />
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar" placement="top">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(row)}
                            sx={{ color: colors.light.gray3, '&:hover': { color: colors.danger.main, backgroundColor: colors.danger.light } }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
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
