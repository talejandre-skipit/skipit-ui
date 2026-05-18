'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, Tooltip } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { colors } from '../../tokens/colors';
// REGLA DE COLOR:
// deleteConfirmed=true  → tacho ROJO  (acción directa o con modal propio)
// deleteConfirmed=false → tacho GRIS  (requiere paso de confirmación adicional)
// El lápiz es SIEMPRE gris. Nunca cambia.
export function ActionButtons({ onEdit, onDelete, deleteConfirmed = true, editTooltip = 'Editar', deleteTooltip = 'Eliminar', disabled = false, }) {
    const trashColor = deleteConfirmed ? colors.danger.main : colors.light.gray3;
    const trashHoverColor = deleteConfirmed ? colors.danger.dark : colors.danger.main;
    return (_jsxs(Box, { sx: { display: 'inline-flex', alignItems: 'center', gap: 0.25 }, children: [onEdit && (_jsx(Tooltip, { title: editTooltip, placement: "top", children: _jsx("span", { children: _jsx(IconButton, { size: "small", onClick: onEdit, disabled: disabled, sx: {
                            color: colors.text.secondary,
                            '&:hover': { color: colors.dark[900], backgroundColor: colors.light.gray2 },
                        }, children: _jsx(EditOutlinedIcon, { sx: { fontSize: 18 } }) }) }) })), onDelete && (_jsx(Tooltip, { title: deleteTooltip, placement: "top", children: _jsx("span", { children: _jsx(IconButton, { size: "small", onClick: onDelete, disabled: disabled, sx: {
                            color: trashColor,
                            '&:hover': { color: trashHoverColor, backgroundColor: colors.danger.light },
                        }, children: _jsx(DeleteOutlineIcon, { sx: { fontSize: 18 } }) }) }) }))] }));
}
