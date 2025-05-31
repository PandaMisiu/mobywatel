import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/organisms';
import { Home, About, Contact, NotFound } from './components/pages';
import './App.css';

function App() {
  return (
    <Router>
      <div className='app'>
        <Navigation />

        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
