'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextField, InputAdornment, FormLabel, Box, FormHelperText } from '@mui/material';
import { colors } from '../../tokens/colors';
export function NumberInput({ value, onChange, label, placeholder = '0', prefix, suffix, min, max, step, disabled = false, error = false, helperText, size = 'small', fullWidth = false, width, }) {
    function handleChange(e) {
        const raw = e.target.value;
        if (raw === '' || raw === '-') {
            onChange(0);
            return;
        }
        const num = parseFloat(raw);
        if (isNaN(num))
            return;
        let clamped = num;
        if (min !== undefined)
            clamped = Math.max(min, clamped);
        if (max !== undefined)
            clamped = Math.min(max, clamped);
        onChange(clamped);
    }
    return (_jsxs(Box, { sx: { display: 'inline-flex', flexDirection: 'column', gap: 0.5, width: fullWidth ? '100%' : width }, children: [label && (_jsx(FormLabel, { sx: { fontSize: '0.8rem', fontWeight: 500, color: error ? colors.danger.main : colors.text.secondary, mb: 0.25 }, children: label })), _jsx(TextField, { type: "number", value: value, onChange: handleChange, placeholder: placeholder, disabled: disabled, error: error, size: size, fullWidth: fullWidth, slotProps: {
                    htmlInput: { min, max, step },
                    input: {
                        startAdornment: prefix ? (_jsx(InputAdornment, { position: "start", children: _jsx(Box, { component: "span", sx: { color: colors.text.muted, fontWeight: 500, fontSize: '0.875rem' }, children: prefix }) })) : undefined,
                        endAdornment: suffix ? (_jsx(InputAdornment, { position: "end", children: _jsx(Box, { component: "span", sx: { color: colors.text.muted, fontWeight: 500, fontSize: '0.875rem' }, children: suffix }) })) : undefined,
                    },
                }, sx: {
                    width: fullWidth ? '100%' : width,
                    '& input[type=number]': { MozAppearance: 'textfield' },
                    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.border.focus,
                        borderWidth: 2,
                    },
                } }), helperText && _jsx(FormHelperText, { error: error, sx: { mx: 0 }, children: helperText })] }));
}
