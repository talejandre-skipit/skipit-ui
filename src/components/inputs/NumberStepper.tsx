'use client';

import React from 'react';
import { Box, TextField, IconButton, InputAdornment, FormHelperText, FormLabel } from '@mui/material';
import KeyboardArrowUpIcon   from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors } from '../../tokens/colors';

export interface NumberStepperProps {
  value:         number;
  onChange:      (value: number) => void;
  label?:        string;
  min?:          number;
  max?:          number;
  step?:         number;
  suffix?:       string;
  disabled?:     boolean;
  error?:        boolean;
  helperText?:   string;
  size?:         'small' | 'medium';
  width?:        number | string;
}

export function NumberStepper({
  value, onChange, label, min, max, step = 1,
  suffix, disabled = false, error = false,
  helperText, size = 'small', width = 100,
}: NumberStepperProps) {

  function clamp(v: number): number {
    let r = v;
    if (min !== undefined) r = Math.max(min, r);
    if (max !== undefined) r = Math.min(max, r);
    return r;
  }

  const increment = () => onChange(clamp(parseFloat((value + step).toFixed(10))));
  const decrement = () => onChange(clamp(parseFloat((value - step).toFixed(10))));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    if (raw === '' || raw === '-') return;
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(clamp(num));
  }

  const canIncrement = !disabled && (max === undefined || value < max);
  const canDecrement = !disabled && (min === undefined || value > min);

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5 }}>
      {label && (
        <FormLabel sx={{ fontSize: '0.8rem', fontWeight: 500, color: error ? colors.danger.main : colors.text.secondary, mb: 0.25 }}>
          {label}
        </FormLabel>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          value={value}
          onChange={handleChange}
          disabled={disabled}
          error={error}
          size={size}
          inputProps={{ min, max, step, style: { textAlign: 'right', fontWeight: 600 } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ mr: -1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <IconButton
                    size="small" onClick={increment} disabled={!canIncrement} tabIndex={-1}
                    sx={{ p: '1px', borderRadius: '2px 4px 0 0', color: canIncrement ? colors.text.secondary : colors.text.disabled, '&:hover': { color: colors.dark[900] } }}
                  >
                    <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small" onClick={decrement} disabled={!canDecrement} tabIndex={-1}
                    sx={{ p: '1px', borderRadius: '0 0 4px 2px', color: canDecrement ? colors.text.secondary : colors.text.disabled, '&:hover': { color: colors.dark[900] } }}
                  >
                    <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          }}
          sx={{
            width,
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.border.focus,
              borderWidth: 2,
            },
          }}
        />
        {suffix && (
          <Box component="span" sx={{ color: colors.text.muted, fontSize: '0.875rem', userSelect: 'none' }}>
            {suffix}
          </Box>
        )}
      </Box>
      {helperText && <FormHelperText error={error} sx={{ mx: 0 }}>{helperText}</FormHelperText>}
    </Box>
  );
}
