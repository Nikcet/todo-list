import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip
} from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
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
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard; 