'use client';

import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, FormLabel, Box, FormHelperText } from '@mui/material';
import { colors } from '../../tokens/colors';

export interface NumberInputProps {
  value:         number | string;
  onChange:      (value: number) => void;
  label?:        string;
  placeholder?:  string;
  prefix?:       string;
  suffix?:       string;
  min?:          number;
  max?:          number;
  step?:         number;
  disabled?:     boolean;
  error?:        boolean;
  helperText?:   string;
  size?:         'small' | 'medium';
  fullWidth?:    boolean;
  width?:        number | string;
}

function toText(v: number | string): string {
  if (v === '' || v === null || v === undefined) return '';
  if (typeof v === 'number') return Number.isNaN(v) ? '' : String(v);
  return v;
}

function toNum(v: number | string): number {
  return typeof v === 'number' ? v : parseFloat(v);
}

export function NumberInput({
  value, onChange, label, placeholder = '0',
  prefix, suffix, min, max, step,
  disabled = false, error = false, helperText,
  size = 'small', fullWidth = false, width,
}: NumberInputProps) {

  // Texto crudo del input. Permite que el campo quede vacío mientras se edita,
  // sin forzar un 0 en cada tecla.
  const [text, setText] = useState<string>(() => toText(value));

  // Sincroniza con cambios de `value` que vienen desde afuera, pero NO pisa
  // un estado de edición intermedio (vacío o sólo el signo). Compara de forma
  // numérica para no interrumpir lo que el usuario está tipeando.
  useEffect(() => {
    if (text === '' || text === '-') return;
    if (parseFloat(text) !== toNum(value)) setText(toText(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setText(raw);
    // Estados intermedios de edición: dejamos el campo como está, sin emitir.
    if (raw === '' || raw === '-') return;
    const num = parseFloat(raw);
    if (Number.isNaN(num)) return;
    let clamped = num;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
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

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, width: fullWidth ? '100%' : width }}>
      {label && (
        <FormLabel sx={{ fontSize: '0.8rem', fontWeight: 500, color: error ? colors.danger.main : colors.text.secondary, mb: 0.25 }}>
          {label}
        </FormLabel>
      )}
      <TextField
        type="number"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        size={size}
        fullWidth={fullWidth}
        slotProps={{
          htmlInput: { min, max, step },
          input: {
            startAdornment: prefix ? (
              <InputAdornment position="start">
                <Box component="span" sx={{ color: colors.text.muted, fontWeight: 500, fontSize: '0.875rem' }}>{prefix}</Box>
              </InputAdornment>
            ) : undefined,
            endAdornment: suffix ? (
              <InputAdornment position="end">
                <Box component="span" sx={{ color: colors.text.muted, fontWeight: 500, fontSize: '0.875rem' }}>{suffix}</Box>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          width: fullWidth ? '100%' : width,
          '& input[type=number]': { MozAppearance: 'textfield' },
          '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
          '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.focus,
            borderWidth: 2,
          },
        }}
      />
      {helperText && <FormHelperText error={error} sx={{ mx: 0 }}>{helperText}</FormHelperText>}
    </Box>
  );
}
