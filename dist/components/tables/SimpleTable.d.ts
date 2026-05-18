import React from 'react';
export interface SimpleTableColumn<T = Record<string, unknown>> {
    key: keyof T | string;
    label: string;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    muted?: boolean;
    bold?: boolean;
    emptyPlaceholder?: string;
    render?: (value: unknown, row: T) => React.ReactNode;
}
export interface SimpleTableProps<T extends Record<string, unknown> = Record<string, unknown>> {
    columns: SimpleTableColumn<T>[];
    data: T[];
    onDelete?: (row: T) => void;
    showLockIcon?: (row: T) => boolean;
    lockTooltip?: string;
    loading?: boolean;
    emptyMessage?: string;
    rowKey?: keyof T | string;
}
export declare function SimpleTable<T extends Record<string, unknown>>({ columns, data, onDelete, showLockIcon, lockTooltip, loading, emptyMessage, rowKey, }: SimpleTableProps<T>): import("react/jsx-runtime").JSX.Element;
