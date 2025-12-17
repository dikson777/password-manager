import React from 'react';
import { Dialog, DialogContent } from '@mui/material';

export default function Modal({ open, onClose, children }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{
        background: '#23262f',
        color: '#f1f1f1',
        p: { xs: 2, sm: 4 },
        borderRadius: 2,
        minWidth: { xs: '90vw', sm: 320 },
        maxWidth: { xs: '95vw', sm: 400 }
      }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
