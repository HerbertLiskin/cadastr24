import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/main/MainPage';
import { DetailPage } from './pages/detail/DetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/apartment/:flatNumber" element={<DetailPage />} />
        {/* Fallback route */}
        <Route path="*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

