import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Suspense, lazy } from 'react';
import { Navigation, ErrorBoundary } from './components/organisms';
import { AppTypography, SkipNavigation } from './components/atoms';

// Lazy load pages for better performance
const Home = lazy(() => import('./components/pages/Home'));
const About = lazy(() => import('./components/pages/About'));
const Contact = lazy(() => import('./components/pages/Contact'));
const Login = lazy(() => import('./components/pages/Login'));
const Register = lazy(() => import('./components/pages/Register'));
const NotFound = lazy(() => import('./components/pages/NotFound'));

// Loading component
const PageLoader = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }}
  >
    <AppTypography variant='h6' color='text.secondary'>
      Ładowanie...
    </AppTypography>
  </Box>
);

function App() {
  return (
    <ErrorBoundary>
      <SkipNavigation />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Navigation />

          <Container
            component='main'
            sx={{ flexGrow: 1, py: 3 }}
            id='main-content'
            tabIndex={-1}
          >
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/about' element={<About />} />
                  <Route path='/contact' element={<Contact />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </Container>
        </Box>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
