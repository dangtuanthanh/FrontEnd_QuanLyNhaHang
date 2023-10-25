
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import Navigation from './components/Navigation';
import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import HoaDon from "./pages/HoaDon"
import KhachHang from "./pages/KhachHang"
import KhuVuc from "./pages/KhuVuc"
import MatHang from "./pages/MatHang"
import NhanVien from "./pages/NhanVien"
function App() {
  return (
    <div className='container'>

      <div  class="row">
        <div class="col-2 ">
          <Navigation />
        </div>
        <div class="col-10">
          <Routes>
            <Route path="/vsell/HoaDon" element={<Dashboard />} />
            <Route path="/vsell/" element={<HoaDon />} />
            <Route path="/vsell/KhachHang" element={<KhachHang />} />
            <Route path="/vsell/KhuVuc" element={<KhuVuc />} />
            <Route path="/vsell/MatHang" element={<MatHang />} />
            <Route path="/vsell/NhanVien" element={<NhanVien />} />
          </Routes>
        </div>
      </div>

    </div>
  );
}

export default App;
