'use client';

import React from 'react';
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

export function NumberInput({
  value, onChange, label, placeholder = '0',
  prefix, suffix, min, max, step,
  disabled = false, error = false, helperText,
  size = 'small', fullWidth = false, width,
}: NumberInputProps) {

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '' || raw === '-') { onChange(0); return; }
    const num = parseFloat(raw);
    if (isNaN(num)) return;
    let clamped = num;
    if (min !== undefined) clamped = Math.max(min, clamped);
    if (max !== undefined) clamped = Math.min(max, clamped);
    onChange(clamped);
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
        value={value}
        onChange={handleChange}
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
