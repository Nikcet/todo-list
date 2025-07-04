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
import type { TaskCreate } from '../types';
import { api } from '../services';
import { isEmail } from 'validator';

interface CreateTaskFormProps {
  onTaskCreated: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState<TaskCreate>({
    username: '',
    email: '',
    text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof TaskCreate) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.text.trim()) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (!isEmail(formData.email)) {
      setError('Введите корректный email');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.createTask(formData);

      setSuccess(true);
      setFormData({
        username: '',
        email: '',
        text: ''
      });

      onTaskCreated();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании задачи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Создать новую задачу
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Задача успешно создана!
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
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Текст задачи"
            value={formData.text}
            onChange={handleInputChange('text')}
            margin="normal"
            required
            multiline
            rows={3}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Создание...' : 'Создать задачу'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm; 