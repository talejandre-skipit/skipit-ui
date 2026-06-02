'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TextField, InputAdornment, FormLabel, Box, FormHelperText } from '@mui/material';
import { colors } from '../../tokens/colors';
function toText(v) {
    if (v === '' || v === null || v === undefined)
        return '';
    if (typeof v === 'number')
        return Number.isNaN(v) ? '' : String(v);
    return v;
}
function toNum(v) {
    return typeof v === 'number' ? v : parseFloat(v);
}
export function NumberInput({ value, onChange, label, placeholder = '0', prefix, suffix, min, max, step, disabled = false, error = false, helperText, size = 'small', fullWidth = false, width, }) {
    // Texto crudo del input. Permite que el campo quede vacío mientras se edita,
    // sin forzar un 0 en cada tecla.
    const [text, setText] = useState(() => toText(value));
    // Sincroniza con cambios de `value` que vienen desde afuera, pero NO pisa
    // un estado de edición intermedio (vacío o sólo el signo). Compara de forma
    // numérica para no interrumpir lo que el usuario está tipeando.
    useEffect(() => {
        if (text === '' || text === '-')
            return;
        if (parseFloat(text) !== toNum(value))
            setText(toText(value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    function handleChange(e) {
        const raw = e.target.value;
        setText(raw);
        // Estados intermedios de edición: dejamos el campo como está, sin emitir.
        if (raw === '' || raw === '-')
            return;
        const num = parseFloat(raw);
        if (Number.isNaN(num))
            return;
        let clamped = num;
        if (min !== undefined)
            clamped = Math.max(min, clamped);
        if (max !== undefined)
            clamped = Math.min(max, clamped);
        onChange(clamped);
    }
    function handleBlur() {
        // Al salir del campo, si quedó vacío se toma como 0 (o el mínimo si 0 lo viola).
        if (text === '' || text === '-') {
            const fallback = min !== undefined ? Math.max(min, 0) : 0;
            setText(String(fallback));
            onChange(fallback);
        }
    }
    return (_jsxs(Box, { sx: { display: 'inline-flex', flexDirection: 'column', gap: 0.5, width: fullWidth ? '100%' : width }, children: [label && (_jsx(FormLabel, { sx: { fontSize: '0.8rem', fontWeight: 500, color: error ? colors.danger.main : colors.text.secondary, mb: 0.25 }, children: label })), _jsx(TextField, { type: "number", value: text, onChange: handleChange, onBlur: handleBlur, placeholder: placeholder, disabled: disabled, error: error, size: size, fullWidth: fullWidth, slotProps: {
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
