import '../src/css/App.css';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/NavBar';
import Home from './pages/homepage';
import Fav from './pages/FavoritesPage';
import { MovieProvider } from './context/MovieContext';
import Chatbot from './components/chatbotUI';

function App() {
  return (
    <MovieProvider>
      <Nav />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <Chatbot /> {/* Only show chatbot on homepage */}
              </>
            }
          />
          <Route path="/favorites" element={<Fav />} />
        </Routes>
      </main>
    </MovieProvider>
  );
}

export default App;
