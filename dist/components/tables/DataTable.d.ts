import React from 'react';
export interface DataTableColumn<T = Record<string, unknown>> {
    key: keyof T | string;
    label: string;
    sortable?: boolean;
    /** Renders a filter input below the header label */
    filterable?: boolean;
    /** Dot-path used for filtering when key points to an object (e.g. "comercial.nombre") */
    filterKey?: string;
    /** Shows a drag handle on the right border to resize this column */
    resizable?: boolean;
    align?: 'left' | 'center' | 'right';
    width?: number | string;
    format?: 'currency' | 'date' | 'none';
    render?: (value: unknown, row: T) => React.ReactNode;
}
export interface DataTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
    columns: DataTableColumn<T>[];
    data: T[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    deleteConfirmed?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    rowKey?: keyof T | string;
}
export declare function DataTable<T extends Record<string, unknown>>({ columns, data, onEdit, onDelete, deleteConfirmed, loading, emptyMessage, rowKey, }: DataTableProps<T>): import("react/jsx-runtime").JSX.Element;
