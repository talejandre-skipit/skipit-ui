'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField, IconButton, InputAdornment, FormHelperText, FormLabel } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors } from '../../tokens/colors';
export function NumberStepper({ value, onChange, label, min, max, step = 1, suffix, disabled = false, error = false, helperText, size = 'small', width = 100, }) {
    function clamp(v) {
        let r = v;
        if (min !== undefined)
            r = Math.max(min, r);
        if (max !== undefined)
            r = Math.min(max, r);
        return r;
    }
    const increment = () => onChange(clamp(parseFloat((value + step).toFixed(10))));
    const decrement = () => onChange(clamp(parseFloat((value - step).toFixed(10))));
    function handleChange(e) {
        const raw = e.target.value;
        if (raw === '' || raw === '-')
            return;
        const num = parseFloat(raw);
        if (!isNaN(num))
            onChange(clamp(num));
    }
    const canIncrement = !disabled && (max === undefined || value < max);
    const canDecrement = !disabled && (min === undefined || value > min);
    return (_jsxs(Box, { sx: { display: 'inline-flex', flexDirection: 'column', gap: 0.5 }, children: [label && (_jsx(FormLabel, { sx: { fontSize: '0.8rem', fontWeight: 500, color: error ? colors.danger.main : colors.text.secondary, mb: 0.25 }, children: label })), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(TextField, { value: value, onChange: handleChange, disabled: disabled, error: error, size: size, slotProps: {
                            htmlInput: { min, max, step, style: { textAlign: 'right', fontWeight: 600 } },
                            input: {
                                endAdornment: (_jsx(InputAdornment, { position: "end", sx: { mr: -1 }, children: _jsxs(Box, { sx: { display: 'flex', flexDirection: 'column' }, children: [_jsx(IconButton, { size: "small", onClick: increment, disabled: !canIncrement, tabIndex: -1, sx: { p: '1px', borderRadius: '2px 4px 0 0', color: canIncrement ? colors.text.secondary : colors.text.disabled, '&:hover': { color: colors.dark[900] } }, children: _jsx(KeyboardArrowUpIcon, { sx: { fontSize: 16 } }) }), _jsx(IconButton, { size: "small", onClick: decrement, disabled: !canDecrement, tabIndex: -1, sx: { p: '1px', borderRadius: '0 0 4px 2px', color: canDecrement ? colors.text.secondary : colors.text.disabled, '&:hover': { color: colors.dark[900] } }, children: _jsx(KeyboardArrowDownIcon, { sx: { fontSize: 16 } }) })] }) })),
                            },
                        }, sx: {
                            width,
                            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: colors.border.focus,
                                borderWidth: 2,
                            },
                        } }), suffix && (_jsx(Box, { component: "span", sx: { color: colors.text.muted, fontSize: '0.875rem', userSelect: 'none' }, children: suffix }))] }), helperText && _jsx(FormHelperText, { error: error, sx: { mx: 0 }, children: helperText })] }));
}
