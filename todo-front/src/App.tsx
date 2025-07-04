import React from 'react';
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
import { AuthProvider, useAuth, TaskProvider, useTask, UIProvider, useUI } from './contexts';

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

const AppContent: React.FC = () => {
  const { isAdmin, logout, loading } = useAuth();
  const { showLoginModal, openLoginModal } = useUI();
  const { refreshKey } = useTask();

  if (loading) {
    return null; 
  }

  return (
    <>
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
                onClick={logout}
              >
                Выйти
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={openLoginModal}
              >
                Вход для администратора
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {showLoginModal && !isAdmin ? (
          <AdminLogin />
        ) : (
          <Box display="flex" gap={3} sx={{ width: '100%' }}>
            <Box sx={{ width: '35%' }}>
              <CreateTaskForm />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TaskList key={refreshKey} />
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TaskProvider>
          <UIProvider>
            <AppContent />
          </UIProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
