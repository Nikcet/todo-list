import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField
} from '@mui/material';
import type { TaskCreate } from '../types';
import { api } from '../services';
import { isEmail } from 'validator';
import { useTask } from '../contexts';
import { useForm } from '../hooks/useForm';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import LoadingButton from './LoadingButton';

const CreateTaskForm: React.FC = () => {
  const { formData, handleChange, reset } = useForm<TaskCreate>({
    username: '',
    email: '',
    text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { refreshTasks } = useTask();

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
      reset();

      refreshTasks();

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

        {error && <ErrorMessage message={error} />}

        {success && <SuccessMessage message="Задача успешно создана!" />}

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
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Текст задачи"
            value={formData.text}
            onChange={handleChange('text')}
            margin="normal"
            required
            multiline
            rows={3}
            disabled={loading}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
            loading={loading}
            loadingText="Создание..."
          >
            Создать задачу
          </LoadingButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm; 