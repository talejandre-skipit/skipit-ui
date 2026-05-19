'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { DataGrid, GridToolbar, } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { ActionButtons } from '../actions/ActionButtons';
import { colors } from '../../tokens/colors';
export function DataTable({ rows, columns, onEdit, onDelete, deleteConfirmed = true, loading = false, pageSize = 25, getRowId, hideToolbar = false, hideFooter = false, autoHeight = true, }) {
    const hasActions = Boolean(onEdit || onDelete);
    const actionsCol = {
        field: '__actions',
        headerName: '',
        width: 90,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        hideable: false,
        align: 'right',
        renderCell: (params) => (_jsx(ActionButtons, { onEdit: onEdit ? () => onEdit(params.row) : undefined, onDelete: onDelete ? () => onDelete(params.row) : undefined, deleteConfirmed: deleteConfirmed })),
    };
    const allColumns = hasActions ? [...columns, actionsCol] : columns;
    return (_jsx(Box, { sx: { width: '100%' }, children: _jsx(DataGrid, { rows: rows, columns: allColumns, loading: loading, getRowId: getRowId, autoHeight: autoHeight, density: "compact", initialState: {
                pagination: { paginationModel: { pageSize, page: 0 } },
            }, pageSizeOptions: [10, 25, 50, 100], slots: hideToolbar ? undefined : { toolbar: GridToolbar }, slotProps: hideToolbar ? undefined : {
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 200 },
                },
            }, hideFooter: hideFooter, disableRowSelectionOnClick: true, sx: dataGridSx }) }));
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
