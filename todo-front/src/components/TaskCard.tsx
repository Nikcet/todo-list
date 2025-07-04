import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked, Delete } from '@mui/icons-material';
import type { Task } from '../types';
import { api } from '../services';
import { useAuth, useTask } from '../contexts';
import ErrorMessage from './ErrorMessage';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAdmin, refreshAuthStatus } = useAuth();
  const { refreshTasks } = useTask();

  const handleDelete = async () => {
    // Проверяем авторизацию перед удалением
    refreshAuthStatus();
    
    if (!api.isAuthenticated()) {
      setError('Для удаления задач необходимо авторизоваться как администратор');
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
        {error && <ErrorMessage message={error} />}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Box display="flex" alignItems="center" mb={1}>
              {task.status ? (
                <CheckCircle color="success" sx={{ mr: 1 }} />
              ) : (
                <RadioButtonUnchecked sx={{ mr: 1 }} />
              )}
              <Typography variant="h6" component="h2">
                {task.username}
              </Typography>
            </Box>
            <Typography color="textSecondary" gutterBottom>
              {task.email}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {task.text}
            </Typography>
            {task.edited_by_admin && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontStyle: 'italic' }}>
                Отредактировано администратором
              </Typography>
            )}
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
            <Chip
              label={task.status ? 'Выполнено' : 'В работе'}
              color={task.status ? 'success' : 'default'}
              size="small"
            />
            {task.edited_by_admin && (
              <Chip
                label="Отредактировано"
                color="warning"
                size="small"
                variant="outlined"
              />
            )}
            {isAdmin && (
              <IconButton
                onClick={handleDelete}
                color="error"
                size="small"
                disabled={deleteLoading}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 