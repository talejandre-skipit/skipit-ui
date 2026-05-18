export type StatusValue = 'activo' | 'Activo' | 'ACTIVO' | 'pausado' | 'Pausado' | 'PAUSADO' | 'perdido' | 'Perdido' | 'PERDIDO' | string;
export interface StatusBadgeProps {
    status: StatusValue;
    label?: string;
    size?: 'small' | 'medium';
}
export declare function StatusBadge({ status, label, size }: StatusBadgeProps): import("react/jsx-runtime").JSX.Element;
