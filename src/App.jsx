import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';

function App() {
  return (
    <>
      <Header />
      <div className="app-container">
        <Hero />
        <Features />
      </div>
    </>
  );
}

export default App;
