import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
import SuperheroDetail from './components/SuperheroDetail';
import SuperheroForm from './components/SuperheroForm';
import EditSuperhero from './components/EditSuperhero';
import AddSuperhero from './components/AddSuperhero';
// Component to handle data fetching based on route
function AppContent() {
  const [superheroes, setSuperheroes] = useState([]);
  const location = useLocation();

  const fetchSuperheroes = async (house = '') => {
    try {
      const url = house ? `http://localhost:5000/api/superheroes?house=${house}` : 'http://localhost:5000/api/superheroes';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSuperheroes(data);
      return data;
    } catch (err) {
      toast.error('Failed to fetch superheroes');
      return [];
    }
  };

  useEffect(() => {
    const house = location.pathname === '/marvel' ? 'Marvel' : location.pathname === '/dc' ? 'DC' : '';
    fetchSuperheroes(house);
  }, [location.pathname]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            superheroes={superheroes}
            setSuperheroes={setSuperheroes}
            house=""
          />
        }
      />
      <Route
        path="/marvel"
        element={
          <Home
            superheroes={superheroes}
            setSuperheroes={setSuperheroes}
            house="Marvel"
          />
        }
      />
      <Route
        path="/dc"
        element={
          <Home
            superheroes={superheroes}
            setSuperheroes={setSuperheroes}
            house="DC"
          />
        }
      />
      <Route path="/superhero/:id" element={<SuperheroDetail />} />
      <Route path="/add" element={<AddSuperhero setSuperheroes={setSuperheroes} />} />
      <Route path="/edit/:id" element={<EditSuperhero setSuperheroes={setSuperheroes} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AppContent />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;