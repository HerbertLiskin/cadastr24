import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/main/MainPage';
import { DetailPage } from './pages/detail/DetailPage';
import { MismatchPage } from './pages/mismatches/MismatchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/apartment/:flatNumber" element={<DetailPage />} />
        <Route path="/mismatches" element={<MismatchPage />} />
        {/* Fallback route */}
        <Route path="*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

