'use client';

import { Chip } from '@mui/material';
import { colors } from '../../tokens/colors';

export type StatusValue =
  | 'activo'  | 'Activo'  | 'ACTIVO'
  | 'pausado' | 'Pausado' | 'PAUSADO'
  | 'perdido' | 'Perdido' | 'PERDIDO'
  | string;

export interface StatusBadgeProps {
  status:  StatusValue;
  label?:  string;
  size?:   'small' | 'medium';
}

const styleMap: Record<string, { bg: string; text: string; border: string; label: string }> = {
  activo: {
    bg:     colors.status.active.bg,
    text:   colors.status.active.text,
    border: colors.status.active.border,
    label:  'Activo',
  },
  pausado: {
    bg:     colors.status.paused.bg,
    text:   colors.status.paused.text,
    border: colors.status.paused.border,
    label:  'Pausado',
  },
  perdido: {
    bg:     colors.status.lost.bg,
    text:   colors.status.lost.text,
    border: colors.status.lost.border,
    label:  'Perdido',
  },
  green:  { bg: '#DCFCE7', text: '#176640', border: '#3BD58B', label: '' },
  yellow: { bg: '#FEF9C3', text: '#CA8A04', border: '#FDE047', label: '' },
  red:    { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5', label: '' },
  blue:   { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', label: '' },
  gray:   { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', label: '' },
};

const fallbackStyle = {
  bg:     colors.light.gray2,
  text:   colors.text.secondary,
  border: colors.border.default,
};

export function StatusBadge({ status, label, size = 'small' }: StatusBadgeProps) {
  const normalized   = status?.toLowerCase();
  const style        = styleMap[normalized] ?? { ...fallbackStyle, label: status };
  const displayLabel = label ?? style.label ?? status;

  return (
    <Chip
      label={displayLabel}
      size={size}
      sx={{
        backgroundColor: style.bg,
        color:           style.text,
        border:          `1px solid ${style.border}`,
        fontWeight:      600,
        fontSize:        '0.72rem',
        height:          24,
        '& .MuiChip-label': { px: 1.25 },
      }}
    />
  );
}
