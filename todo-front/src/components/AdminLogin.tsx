import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import type { Admin } from '../types';
import { api } from '../services';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<Admin>({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof Admin) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Введите имя пользователя и пароль');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await api.login(formData);
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto' }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Вход для администратора
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Имя пользователя"
            value={formData.username}
            onChange={handleInputChange('username')}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            margin="normal"
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminLogin; 