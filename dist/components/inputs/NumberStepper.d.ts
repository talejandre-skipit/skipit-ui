export interface NumberStepperProps {
    value: number;
    onChange: (value: number) => void;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    suffix?: string;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    size?: 'small' | 'medium';
    width?: number | string;
}
export declare function NumberStepper({ value, onChange, label, min, max, step, suffix, disabled, error, helperText, size, width, }: NumberStepperProps): import("react/jsx-runtime").JSX.Element;
