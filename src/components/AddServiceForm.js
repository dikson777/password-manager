import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, LinearProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AutorenewIcon from '@mui/icons-material/Autorenew';

// Функция генерации пароля
function generatePassword(length = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Оценка силы пароля (очень простая)
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const strengthLabels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Сильный'];

const textFieldSx = {
  input: { color: '#f1f1f1' },
  label: { color: '#bdbdbd' },
  '.MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#555' },
    '&:hover fieldset': { borderColor: '#888' },
    '&.Mui-focused fieldset': { borderColor: '#1a73e8' }
  }
};

const AddServiceForm = ({ onAdd }) => {
  const [site, setSite] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!site || !login || !password) return;
    onAdd({ site, login, password });
    setSite('');
    setLogin('');
    setPassword('');
  };

  const handleGenerate = () => {
    const newPass = generatePassword();
    setPassword(newPass);
  };

  const strength = getPasswordStrength(password);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minWidth: { xs: '90vw', sm: 300 },
        maxWidth: { xs: '95vw', sm: 400 },
        mx: 'auto'
      }}
      autoComplete="off"
    >
      <Typography variant="h6" sx={{ mb: 1, fontSize: { xs: 22, sm: 20 } }}>Добавить сервис</Typography>
      <TextField
        label="Сервис"
        variant="outlined"
        value={site}
        onChange={e => setSite(e.target.value)}
        required
        fullWidth
        sx={textFieldSx}
      />
      <TextField
        label="Логин"
        variant="outlined"
        value={login}
        onChange={e => setLogin(e.target.value)}
        required
        fullWidth
        sx={textFieldSx}
      />
      <TextField
        label="Пароль"
        variant="outlined"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        fullWidth
        sx={textFieldSx}
        InputProps={{
          endAdornment: (
            <>
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  tabIndex={-1}
                  aria-label="Показать/скрыть пароль"
                  sx={{ color: '#bdbdbd' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
              <InputAdornment position="end">
                <IconButton
                  onClick={handleGenerate}
                  edge="end"
                  tabIndex={-1}
                  aria-label="Сгенерировать пароль"
                  sx={{ color: '#bdbdbd' }}
                >
                  <AutorenewIcon />
                </IconButton>
              </InputAdornment>
            </>
          )
        }}
      />
      {password && (
        <Box>
          <LinearProgress
            variant="determinate"
            value={(strength / 5) * 100}
            sx={{
              height: 8,
              borderRadius: 5,
              background: '#333',
              '& .MuiLinearProgress-bar': {
                background: strength < 3 ? '#e53935' : strength < 4 ? '#fbc02d' : '#43a047'
              }
            }}
          />
          <Typography variant="caption" sx={{ color: strength < 3 ? '#e53935' : strength < 4 ? '#fbc02d' : '#43a047' }}>
            {strengthLabels[strength - 1] || 'Очень слабый'}
          </Typography>
        </Box>
      )}
      <Button type="submit" variant="contained" color="primary" sx={{ fontSize: { xs: 18, sm: 16 }, py: { xs: 2, sm: 1 } }}>
        Добавить
      </Button>
    </Box>
  );
};

export default AddServiceForm;