import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import type { Task } from '../types';
import { api } from '../services';
import EditableTask from './EditableTask';

type SortOption = 'username' | 'email' | 'status' | 'none';

interface TaskListProps {
  isAdmin?: boolean;
  onTaskUpdated?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ isAdmin = false, onTaskUpdated }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [totalPages, setTotalPages] = useState(1);

  const limit = 3;
  const offset = (page - 1) * limit;

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const totalTasks = await api.getTasksCount();
      setTotalPages(Math.ceil(totalTasks / limit) || 1);
      
      let fetchedTasks: Task[];
      
      switch (sortBy) {
        case 'username':
          fetchedTasks = await api.getTasksSortedByUsername(offset, limit);
          break;
        case 'email':
          fetchedTasks = await api.getTasksSortedByEmail(offset, limit);
          break;
        case 'status':
          fetchedTasks = await api.getTasksSortedByStatus(offset, limit);
          break;
        default:
          fetchedTasks = await api.getTasksPaginated(offset, limit);
      }
      
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке задач');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, sortBy]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
    setPage(1); 
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Список задач
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortBy}
            label="Сортировка"
            onChange={handleSortChange}
          >
            <MenuItem value="none">Без сортировки</MenuItem>
            <MenuItem value="username">По имени пользователя</MenuItem>
            <MenuItem value="email">По email</MenuItem>
            <MenuItem value="status">По статусу</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {tasks.length === 0 ? (
        <Alert severity="info">
          Задачи не найдены
        </Alert>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            {tasks.map((task) => (
              <Box key={task.id}>
                {isAdmin ? (
                  <EditableTask 
                    task={task} 
                    onTaskUpdated={onTaskUpdated || (() => fetchTasks())}
                  />
                ) : (
                  <Card>
                    <CardContent>
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
                        </Box>
                        <Chip
                          label={task.status ? 'Выполнено' : 'В работе'}
                          color={task.status ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default TaskList; 