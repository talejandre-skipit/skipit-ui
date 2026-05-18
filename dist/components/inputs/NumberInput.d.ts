export interface NumberInputProps {
    value: number | string;
    onChange: (value: number) => void;
    label?: string;
    placeholder?: string;
    prefix?: string;
    suffix?: string;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    size?: 'small' | 'medium';
    fullWidth?: boolean;
    width?: number | string;
}
export declare function NumberInput({ value, onChange, label, placeholder, prefix, suffix, min, max, step, disabled, error, helperText, size, fullWidth, width, }: NumberInputProps): import("react/jsx-runtime").JSX.Element;
