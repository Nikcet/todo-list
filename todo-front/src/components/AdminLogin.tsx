import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Admin } from '../types';
import { useAuth, useUI } from '../contexts';
import { useForm } from '../hooks/useForm';
import ErrorMessage from './ErrorMessage';
import LoadingButton from './LoadingButton';

const AdminLogin: React.FC = () => {
  const { formData, handleChange } = useForm<Admin>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const { closeLoginModal } = useUI();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLoginModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeLoginModal]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Введите имя пользователя и пароль');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await login(formData.username, formData.password);
      closeLoginModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={closeLoginModal}
    >
      <Card 
        sx={{ 
          maxWidth: 400, 
          width: '90%',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={closeLoginModal}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1
          }}
        >
          <Close />
        </IconButton>
        
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Вход для администратора
          </Typography>

          {error && <ErrorMessage message={error} />}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Имя пользователя"
              value={formData.username}
              onChange={handleChange('username')}
              margin="normal"
              required
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              margin="normal"
              required
              disabled={loading}
            />
            
            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              loading={loading}
              loadingText="Вход..."
            >
              Войти
            </LoadingButton>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLogin; 