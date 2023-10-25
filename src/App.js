
import React from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
//import Navigation from './components/Navigation';
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BangDieuKhien from "./pages/BangDieuKhien"
import HoaDon from "./pages/HoaDon"
import ThucDon from "./pages/ThucDon"
import BanVaKhuVuc from "./pages/BanVaKhuVuc"
import NhanVien from "./pages/NhanVien"
import VaiTroVaQuyen from "./pages/VaiTroVaQuyen"
import CaLamViec from "./pages/CaLamViec"
import KhachHang from "./pages/KhachHang"
import Kho from "./pages/Kho"
import NotFound from "./pages/NotFound";
import Login from './login/Login';

function App() {
  // const router = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <Login />,
  //   },
  //   {
  //     path: "/BangDieuKhien",
  //     element: <BangDieuKhien />,
  //   },
  //   {
  //     path: "/NhanVien",
  //     element: <NhanVien />,
  //   },
  //   {
  //     path: "/HoaDon",
  //     element: <HoaDon />,
  //   },
  //   {
  //     path: "/ThucDon",
  //     element: <ThucDon />,
  //   },
  // ]);
  return (

    //  <RouterProvider router={router} />
    //Chuyển trang
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/BangDieuKhien" element={<BangDieuKhien />} />
        <Route path="/HoaDon" element={<HoaDon />} />
        <Route path="/ThucDon" element={<ThucDon />} />
        <Route path="/BanVaKhuVuc" element={<BanVaKhuVuc />} />
        <Route path="/NhanVien" element={<NhanVien />} />
        <Route path="/VaiTroVaQuyen" element={<VaiTroVaQuyen />} />
        <Route path="/CaLamViec" element={<CaLamViec />} />
        <Route path="/KhachHang" element={<KhachHang />} />
        <Route path="/Kho" element={<Kho />} />
        <Route element={NotFound} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
