import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { Navigation } from './components/organisms';
import { Home, About, Contact, NotFound } from './components/pages';

function App() {
  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navigation />

        <Container component='main' sx={{ flexGrow: 1, py: 3 }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
