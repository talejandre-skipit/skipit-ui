export interface ActionButtonsProps {
    onEdit?: () => void;
    onDelete?: () => void;
    deleteConfirmed?: boolean;
    editTooltip?: string;
    deleteTooltip?: string;
    disabled?: boolean;
}
export declare function ActionButtons({ onEdit, onDelete, deleteConfirmed, editTooltip, deleteTooltip, disabled, }: ActionButtonsProps): import("react/jsx-runtime").JSX.Element;
