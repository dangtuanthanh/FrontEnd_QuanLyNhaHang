import React, { useState } from "react";
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCog, faBell, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'

import { getCookie, deleteCookie } from "../components/Cookie";
import { urlLogout } from "../components/url";
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import loadingGif from '../assets/img/loading/loading1.gif'
import TabLoaiSanPham from "../components/Tabs/TabLoaiSanPham";
import TabSanPham from "../components/Tabs/TabSanPham";
import TabNguyenLieu from "../components/Tabs/TabNguyenLieu";
import Logout_ChotCa from "../components/Popup/Logout_ChotCa";
import '../App.css';
function ThucDon() {
    const [thongTinDangNhap, setThongTinDangNhap] = useState({
        menu: [],
        NhanVien: {},
        ChotCa: false
    });
    const xuLyLayThongTinDangNhap = (data) => {
        setThongTinDangNhap(data);
    };
    const [popupChotCa, setPopupChotCa] = useState(false);
    //xử lý redux
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const loading = useSelector(state => state.loading.loading)
    const logout = () => {
        if (thongTinDangNhap.ChotCa)
            setPopupChotCa(true)
        else {
            dispatch({ type: 'SET_LOADING', payload: true })
            fetch(urlLogout, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss')
                },
            })
                .then(response => {
                    if (response.status === 200) {
                        deleteCookie('ss')
                        dispatch({ type: 'SET_LOADING', payload: false })
                        navigate(`/`);
                        //window.location.href = "/";//Chuyển trang
                    } else if (response.status === 401) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else if (response.status === 500) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else {
                        return;
                    }
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    if (error instanceof TypeError) {
                        alert('Không thể kết nối tới máy chủ');
                    } else {
                        alert(error);
                    }

                });
        }
    }

    //Xử lý menu
    const [showNavigation, setShowNavigation] = useState(true);
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";


    const tabs = {
        tab1: 'TabSanPham',
        tab2: 'TabNguyenLieu',
        tab3: 'TabLoaiSanPham'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabSanPham;
    }

    if (activeTab === tabs.tab2) {
        TabComponent = TabNguyenLieu;
    }
    if (activeTab === tabs.tab3) {
        TabComponent = TabLoaiSanPham;
    }

    return (
        <CheckLogin thongTinDangNhap={xuLyLayThongTinDangNhap}  >
            {loading && <div className="loading">
                <img src={loadingGif} style={{ width: '30%' }} />
            </div>}
            <div className="row">
                <div className={navigationColumnClass}>
                    {showNavigation && <Navigation menu={thongTinDangNhap.menu} />}
                </div>
                <div className={contentColumnClass}>
                    <div style={{ marginLeft: '2%', marginRight: '1%' }}>
                        <div style={{ marginLeft: '0px' }} className="row">
                            <ul class="nav nav-tabs col-6">
                                <li class="nav-item">
                                    <button class="nav-link " onClick={handleToggleNavigation}>
                                        {showNavigation ? "<<" : ">>"}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabSanPham' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab1)}>Sản Phẩm</button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabNguyenLieu' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab2)}>Nguyên Liệu</button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabLoaiSanPham' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab3)}>Loại Sản Phẩm</button>
                                </li>
                            </ul>
                            <div className="col-6 d-flex justify-content-end align-items-center">
                                <span style={{ marginLeft: '20px' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                    <FontAwesomeIcon icon={faUser} />  Chào! <span style={{ color: 'blue' }}>{thongTinDangNhap.NhanVien.TenNhanVien}</span>
                                </span>
                                <span style={{ marginLeft: '20px' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                    <FontAwesomeIcon icon={faCog} />
                                </span>
                                <span style={{ marginLeft: '20px' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                    <FontAwesomeIcon icon={faBell} />
                                </span>
                                <button style={{ marginLeft: '20px' }} onClick={() => logout()} className="btn btn-primary btn-sm mb-0">
                                    Đăng Xuất <FontAwesomeIcon icon={faSignOut} />
                                </button>
                            </div>
                        </div>
                        <TabComponent thongTinDangNhap={thongTinDangNhap.NhanVien}/>
                        {popupChotCa && <Logout_ChotCa
                            setPopupChotCa={setPopupChotCa}
                            thongTinDangNhap={thongTinDangNhap}
                        />}
                    </div>
                </div>
            </div>
        </CheckLogin>
    );
}

export default ThucDon