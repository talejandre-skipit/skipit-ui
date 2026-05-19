'use client';

import {
  DataGrid,
  GridToolbar,
  type GridColDef,
  type GridRowModel,
  type GridRowId,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ActionButtons } from '../actions/ActionButtons';
import { colors } from '../../tokens/colors';

export type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export interface DataTableProps {
  rows: GridRowModel[];
  columns: GridColDef[];
  onEdit?: (row: GridRowModel) => void;
  onDelete?: (row: GridRowModel) => void;
  deleteConfirmed?: boolean;
  loading?: boolean;
  pageSize?: number;
  getRowId?: (row: GridRowModel) => GridRowId;
  hideToolbar?: boolean;
  hideFooter?: boolean;
  autoHeight?: boolean;
}

export function DataTable({
  rows,
  columns,
  onEdit,
  onDelete,
  deleteConfirmed = true,
  loading = false,
  pageSize = 25,
  getRowId,
  hideToolbar = false,
  hideFooter = false,
  autoHeight = true,
}: DataTableProps) {
  const hasActions = Boolean(onEdit || onDelete);

  const actionsCol: GridColDef = {
    field: '__actions',
    headerName: '',
    width: 90,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    hideable: false,
    align: 'right',
    renderCell: (params: GridRenderCellParams) => (
      <ActionButtons
        onEdit={onEdit ? () => onEdit(params.row as GridRowModel) : undefined}
        onDelete={onDelete ? () => onDelete(params.row as GridRowModel) : undefined}
        deleteConfirmed={deleteConfirmed}
      />
    ),
  };

  const allColumns = hasActions ? [...columns, actionsCol] : columns;

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={allColumns}
        loading={loading}
        getRowId={getRowId}
        autoHeight={autoHeight}
        density="compact"
        initialState={{
          pagination: { paginationModel: { pageSize, page: 0 } },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        slots={hideToolbar ? undefined : { toolbar: GridToolbar }}
        slotProps={hideToolbar ? undefined : {
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 200 },
          },
        }}
        hideFooter={hideFooter}
        disableRowSelectionOnClick
        sx={dataGridSx}
      />
    </Box>
  );
}

const dataGridSx = {
  border: `1px solid ${colors.border.default}`,
  borderRadius: '10px',
  fontFamily: 'inherit',
  fontSize: '0.8125rem',
  '& .MuiDataGrid-toolbarContainer': {
    padding: '8px 12px 6px',
    borderBottom: `1px solid ${colors.border.default}`,
    gap: 0.5,
    '& .MuiButtonBase-root': {
      fontSize: '0.75rem',
      color: colors.text.secondary,
      textTransform: 'none',
    },
    '& .MuiInputBase-root': {
      fontSize: '0.8125rem',
    },
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f7f9fc',
    borderBottom: `1px solid ${colors.border.default}`,
  },
  '& .MuiDataGrid-columnHeader': {
    '&:focus, &:focus-within': {
      outline: `2px solid ${colors.brand.mint}`,
      outlineOffset: -2,
    },
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: colors.text.secondary,
  },
  '& .MuiDataGrid-sortIcon': {
    color: colors.text.muted,
    fontSize: '1rem',
  },
  '& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
    color: colors.brand.mint,
  },
  '& .MuiDataGrid-row': {
    '&:hover': { backgroundColor: '#f7f9fc' },
    '&.Mui-selected': {
      backgroundColor: `${colors.brand.mint}14`,
      '&:hover': { backgroundColor: `${colors.brand.mint}20` },
    },
  },
  '& .MuiDataGrid-cell': {
    fontSize: '0.8125rem',
    color: colors.text.primary,
    '&:focus, &:focus-within': {
      outline: `2px solid ${colors.brand.mint}`,
      outlineOffset: -2,
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `1px solid ${colors.border.default}`,
    fontSize: '0.75rem',
    minHeight: 44,
  },
  '& .MuiDataGrid-selectedRowCount': { visibility: 'hidden', width: 0 },
  '& .MuiCheckbox-root.Mui-checked': { color: colors.brand.mint },
};
