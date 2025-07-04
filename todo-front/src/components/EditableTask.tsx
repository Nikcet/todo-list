import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton
} from '@mui/material';
import { Edit, Save, Cancel, Delete } from '@mui/icons-material';
import type { Task, TaskCreate } from '../types';
import { api } from '../services';
import { useTask } from '../contexts';
import { useAuth, useUI } from '../contexts';
import ErrorMessage from './ErrorMessage';
import LoadingButton from './LoadingButton';

interface EditableTaskProps {
  task: Task;
}

const EditableTask: React.FC<EditableTaskProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskCreate>({
    username: task.username,
    email: task.email,
    text: task.text,
    status: task.status,
    edited_by_admin: task.edited_by_admin
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { refreshTasks } = useTask();
  const { isAdmin, refreshAuthStatus } = useAuth();
  const { openLoginModal, showLoginModal } = useUI();

  useEffect(() => {
    if (isAdmin && error?.includes('авторизоваться')) {
      setError(null);
    }
  }, [isAdmin, error]);

  useEffect(() => {
    if (!showLoginModal && error?.includes('авторизоваться')) {
      setError(null);
    }
  }, [showLoginModal, error]);

  const handleInputChange = (field: keyof TaskCreate) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'status' ? event.target.checked : event.target.value;
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditClick = () => {
    refreshAuthStatus();

    if (!api.isAuthenticated()) {
      setError('Для редактирования задач необходимо авторизоваться как администратор');
      openLoginModal();
      return;
    }
    setIsEditing(true);
    setError(null);
  };

    const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const taskToUpdate = {
        ...editedTask,
        edited_by_admin: true
      };
      
      await api.updateTask(task.id, taskToUpdate);
      setIsEditing(false);
      refreshTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении задачи');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedTask({
      username: task.username,
      email: task.email,
      text: task.text,
      status: task.status,
      edited_by_admin: task.edited_by_admin
    });
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    refreshAuthStatus();
    
    if (!api.isAuthenticated()) {
      setError('Для удаления задач необходимо авторизоваться как администратор');
      openLoginModal();
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError(null);
      
      await api.deleteTask(task.id);
      refreshTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при удалении задачи');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            {error && <ErrorMessage message={error} />}

            {isEditing ? (
              <Box>
                <TextField
                  fullWidth
                  label="Имя пользователя"
                  value={editedTask.username}
                  onChange={handleInputChange('username')}
                  margin="normal"
                  disabled={loading}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editedTask.email}
                  onChange={handleInputChange('email')}
                  margin="normal"
                  disabled={loading}
                />

                <TextField
                  fullWidth
                  label="Текст задачи"
                  value={editedTask.text}
                  onChange={handleInputChange('text')}
                  margin="normal"
                  multiline
                  rows={3}
                  disabled={loading}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedTask.status}
                      onChange={handleInputChange('status')}
                      disabled={loading}
                    />
                  }
                  label="Задача выполнена"
                  sx={{ mt: 1 }}
                />

                <Box sx={{ mt: 2 }}>
                  <LoadingButton
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    loading={loading}
                    loadingText="Сохранение..."
                    sx={{ mr: 1 }}
                  >
                    Сохранить
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {task.username}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {task.email}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                  {task.text}
                </Typography>
                <Typography variant="body2" color={task.status ? 'success.main' : 'text.secondary'}>
                  Статус: {task.status ? 'Выполнено' : 'В работе'}
                </Typography>
                {task.edited_by_admin && (
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Отредактировано администратором
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {!isEditing && (
            <Box display="flex" gap={1}>
              <IconButton
                onClick={handleEditClick}
                color="primary"
                size="small"
                disabled={deleteLoading}
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                color="error"
                size="small"
                disabled={deleteLoading}
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditableTask; 