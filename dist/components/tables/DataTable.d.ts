import { type GridColDef, type GridRowModel, type GridRowId } from '@mui/x-data-grid';
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
export declare function DataTable({ rows, columns, onEdit, onDelete, deleteConfirmed, loading, pageSize, getRowId, hideToolbar, hideFooter, autoHeight, }: DataTableProps): import("react/jsx-runtime").JSX.Element;
