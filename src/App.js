import React, { useState, useEffect } from 'react';
import AddServiceForm from './components/AddServiceForm';
import Modal from './components/Modal';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Paper,
  Stack,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  Avatar
} from '@mui/material';

const LOCAL_KEY = 'passwords';

function App() {
  const [passwords, setPasswords] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({ site: '', login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setPasswords(JSON.parse(saved));
    else setPasswords([
      { site: 'gmail.com', login: 'myemail@gmail.com', password: '123456' }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(passwords));
  }, [passwords]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification('Скопировано!');
    setTimeout(() => setNotification(''), 1500);
  };

  const addPassword = (newPass) => {
    setPasswords([...passwords, newPass]);
    setNotification('Сервис добавлен!');
    setTimeout(() => setNotification(''), 1500);
    setShowModal(false);
  };

  const startEdit = () => {
    setEditFields(passwords[selectedIdx]);
    setEditMode(true);
  };

  const saveEdit = () => {
    const updated = passwords.map((item, idx) =>
      idx === selectedIdx ? editFields : item
    );
    setPasswords(updated);
    setEditMode(false);
    setNotification('Изменения сохранены!');
    setTimeout(() => setNotification(''), 1500);
  };

  const handleServiceClick = (idx) => {
    if (selectedIdx === idx) {
      setSelectedIdx(null);
      setEditMode(false);
      setShowPassword(false);
    } else {
      setSelectedIdx(idx);
      setEditMode(false);
      setShowPassword(false);
    }
  };

  const handleDelete = () => {
    setPasswords(passwords.filter((_, idx) => idx !== deleteIdx));
    setShowDeleteDialog(false);
    setSelectedIdx(null);
    setNotification('Сервис удалён!');
    setTimeout(() => setNotification(''), 1500);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      maxWidth: { xs: '100%', sm: 800 },
      margin: { xs: 0, sm: '40px auto' },
      bgcolor: '#181a20',
      color: '#f1f1f1',
      borderRadius: 3,
      boxShadow: 3,
      minHeight: 400,
      p: 0
    }}>
      {/* Sidebar */}
      <Box sx={{
        minWidth: { xs: '100%', sm: 220 },
        bgcolor: '#23262f',
        borderRadius: { xs: 0, sm: '12px 0 0 12px' },
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontSize: { xs: 22, sm: 20 } }}>Сервисы</Typography>
        <List sx={{ flex: 1 }}>
          {passwords.map((item, idx) => (
            <ListItemButton
              key={idx}
              selected={selectedIdx === idx}
              onClick={() => handleServiceClick(idx)}
              sx={{
                borderRadius: 2,
                mb: 1,
                bgcolor: selectedIdx === idx ? '#282c34' : 'inherit',
                color: '#f1f1f1',
                '&:hover': { bgcolor: '#393e4b' },
                py: { xs: 2, sm: 1 }
              }}
            >
              <Avatar
                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(item.site)}&sz=32`}
                alt={item.site}
                sx={{ width: 28, height: 28, mr: 1, bgcolor: '#222' }}
              />
              <ListItemText
                primary={item.site}
                primaryTypographyProps={{
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: { xs: 120, sm: 160 },
                    fontSize: { xs: 18, sm: 16 }
                  }
                }}
              />
              <Button
                onClick={e => {
                  e.stopPropagation();
                  setDeleteIdx(idx);
                  setShowDeleteDialog(true);
                }}
                variant="outlined"
                color="error"
                size="small"
                sx={{ ml: 1, minWidth: 0, px: 1, fontSize: { xs: 18, sm: 16 } }}
              >
                🗑
              </Button>
            </ListItemButton>
          ))}
        </List>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, fontWeight: 'bold', fontSize: { xs: 18, sm: 16 }, py: { xs: 2, sm: 1 } }}
          onClick={() => setShowModal(true)}
        >
          + Добавить сервис
        </Button>
        <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
          <DialogTitle>Удалить сервис?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setShowDeleteDialog(false)} color="primary">
              Отмена
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Main content */}
      <Box sx={{ flex: 1, p: { xs: 2, sm: 4 } }}>
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: 22, sm: 20 } }}>Данные</Typography>
        {selectedIdx !== null && passwords[selectedIdx] ? (
          editMode ? (
            <Paper sx={{ bgcolor: '#23262f', p: 3, borderRadius: 2 }}>
              <Stack spacing={2}>
                <TextField
                  label="Логин"
                  variant="outlined"
                  value={editFields.login}
                  onChange={e => setEditFields({ ...editFields, login: e.target.value })}
                  fullWidth
                  InputProps={{ style: { color: '#f1f1f1' } }}
                  sx={{
                    input: { color: '#f1f1f1' },
                    label: { color: '#bdbdbd' },
                    '.MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#888' },
                      '&.Mui-focused fieldset': { borderColor: '#1a73e8' }
                    }
                  }}
                />
                <TextField
                  label="Пароль"
                  variant="outlined"
                  type={showPassword ? 'text' : 'password'}
                  value={editFields.password}
                  onChange={e => setEditFields({ ...editFields, password: e.target.value })}
                  fullWidth
                  InputProps={{ style: { color: '#f1f1f1' } }}
                  sx={{
                    input: { color: '#f1f1f1' },
                    label: { color: '#bdbdbd' },
                    '.MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#555' },
                      '&:hover fieldset': { borderColor: '#888' },
                      '&.Mui-focused fieldset': { borderColor: '#1a73e8' }
                    }
                  }}
                />
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outlined"
                  color="secondary"
                  sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 2, sm: 1 } }}
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </Button>
                <Button onClick={saveEdit} variant="contained" color="success" sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 2, sm: 1 } }}>
                  Сохранить
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Paper sx={{ bgcolor: '#23262f', p: 3, borderRadius: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="#bdbdbd">Логин:</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" sx={{ color: '#fff', fontSize: { xs: 18, sm: 16 } }}>
                      {passwords[selectedIdx].login}
                    </Typography>
                    <Button
                      onClick={() => copyToClipboard(passwords[selectedIdx].login)}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 1, sm: 0.5 } }}
                    >
                      Копировать
                    </Button>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="#bdbdbd">Пароль:</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1" sx={{ color: '#fff', fontSize: { xs: 18, sm: 16 } }}>
                      {showPassword ? passwords[selectedIdx].password : '••••••••'}
                    </Typography>
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 1, sm: 0.5 } }}
                    >
                      {showPassword ? 'Скрыть' : 'Показать'}
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(passwords[selectedIdx].password)}
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 1, sm: 0.5 } }}
                    >
                      Копировать
                    </Button>
                  </Stack>
                </Box>
                <Button onClick={startEdit} variant="contained" color="warning" sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 2, sm: 1 } }}>
                  Редактировать
                </Button>
              </Stack>
            </Paper>
          )
        ) : (
          <Typography color="#bdbdbd" sx={{ fontSize: { xs: 18, sm: 16 } }}>Выберите сервис слева</Typography>
        )}
        {notification && (
          <Paper sx={{
            mt: 3,
            bgcolor: '#333',
            color: '#fff',
            p: 2,
            borderRadius: 2,
            textAlign: 'center',
            fontSize: { xs: 18, sm: 16 }
          }}>
            {notification}
          </Paper>
        )}
      </Box>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <AddServiceForm onAdd={addPassword} />
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, width: '100%', fontSize: { xs: 18, sm: 16 }, py: { xs: 2, sm: 1 } }}
          onClick={() => setShowModal(false)}
        >
          Отмена
        </Button>
      </Modal>
    </Box>
  );
}

export default App;