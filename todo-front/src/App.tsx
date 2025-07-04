import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import TaskList from './components/TaskList';
import CreateTaskForm from './components/CreateTaskForm';
import AdminLogin from './components/AdminLogin';
import { api } from './services';
import type { Task } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#43464b',
    },
  },
});

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Проверяем, авторизован ли администратор при загрузке
    setIsAdmin(api.isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    api.logout();
    setIsAdmin(false);
  };

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTaskUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Todo List
            </Typography>
            {isAdmin ? (
              <Button
                color="inherit"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Выйти
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => setShowLogin(true)}
              >
                Вход для администратора
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {showLogin && !isAdmin ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Box display="flex" gap={3} sx={{ width: '100%' }}>
            <Box sx={{ width: '35%' }}>
              <CreateTaskForm onTaskCreated={handleTaskCreated} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TaskList
                key={refreshKey}
                isAdmin={isAdmin}
                onTaskUpdated={handleTaskUpdated}
              />
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
