'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon  from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { colors } from '../../tokens/colors';

export interface ActionButtonsProps {
  onEdit?:          () => void;
  onDelete?:        () => void;
  deleteConfirmed?: boolean;
  editTooltip?:     string;
  deleteTooltip?:   string;
  disabled?:        boolean;
}

// REGLA DE COLOR:
// deleteConfirmed=true  → tacho ROJO  (acción directa o con modal propio)
// deleteConfirmed=false → tacho GRIS  (requiere paso de confirmación adicional)
// El lápiz es SIEMPRE gris. Nunca cambia.

export function ActionButtons({
  onEdit,
  onDelete,
  deleteConfirmed = true,
  editTooltip     = 'Editar',
  deleteTooltip   = 'Eliminar',
  disabled        = false,
}: ActionButtonsProps) {

  const trashColor      = deleteConfirmed ? colors.danger.main  : colors.light.gray3;
  const trashHoverColor = deleteConfirmed ? colors.danger.dark  : colors.danger.main;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>

      {onEdit && (
        <Tooltip title={editTooltip} placement="top">
          <span>
            <IconButton
              size="small"
              onClick={onEdit}
              disabled={disabled}
              sx={{
                color: colors.text.secondary,
                '&:hover': { color: colors.dark[900], backgroundColor: colors.light.gray2 },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      )}

      {onDelete && (
        <Tooltip title={deleteTooltip} placement="top">
          <span>
            <IconButton
              size="small"
              onClick={onDelete}
              disabled={disabled}
              sx={{
                color: trashColor,
                '&:hover': { color: trashHoverColor, backgroundColor: colors.danger.light },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      )}

    </Box>
  );
}
