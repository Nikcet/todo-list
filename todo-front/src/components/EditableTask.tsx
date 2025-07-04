import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import type { Task, TaskCreate } from '../types';
import { api } from '../services';

interface EditableTaskProps {
  task: Task;
  onTaskUpdated: () => void;
}

const EditableTask: React.FC<EditableTaskProps> = ({ task, onTaskUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskCreate>({
    username: task.username,
    email: task.email,
    text: task.text,
    status: task.status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof TaskCreate) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'status' ? event.target.checked : event.target.value;
    setEditedTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await api.updateTask(task.id, editedTask);
      setIsEditing(false);
      onTaskUpdated();
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
      status: task.status
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

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
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ mr: 1 }}
                  >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
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
              </Box>
            )}
          </Box>
          
          {!isEditing && (
            <IconButton
              onClick={() => setIsEditing(true)}
              color="primary"
              size="small"
            >
              <Edit />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EditableTask; 