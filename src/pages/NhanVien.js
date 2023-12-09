import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCog, faBell, faSignOut } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { getCookie, deleteCookie } from "../components/Cookie";
import { urlLogout } from "../components/url";

import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import NavTop from "../components/NavTop";
import loadingGif from '../assets/img/loading/loading1.gif'
import TabNhanVien from "../components/Tabs/TabNhanVien";
import TabVaiTroTruyCap from "../components/Tabs/TabVaiTroTruyCap";
import TabViTriCongViec from "../components/Tabs/TabViTriCongViec";
import '../App.css';

function NhanVien() {
    //xử lý redux
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const logout = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(urlLogout, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
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

    //Xử lý menu
    const [showNavigation, setShowNavigation] = useState(false);
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";

    const [menu, setMenu] = useState([]);
    const xuLyLayMenuTuCheckLogin = (data) => {
        setMenu(data);
    };
    const [thongTinDangNhap, setThongTinDangNhap] = useState([]);
    const xuLyLayThongTinDangNhap = (data) => {
        setThongTinDangNhap(data);
    };

    const loading = useSelector(state => state.loading.loading)
    const tabs = {
        tab1: 'TabNhanVien',
        tab2: 'TabVaiTroTruyCap',
        tab3: 'TabViTriCongViec'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabNhanVien;
    }

    if (activeTab === tabs.tab2) {
        TabComponent = TabVaiTroTruyCap;
    }
    if (activeTab === tabs.tab3) {
        TabComponent = TabViTriCongViec;
    }

    return (
        <CheckLogin menu={xuLyLayMenuTuCheckLogin} thongTinDangNhap={xuLyLayThongTinDangNhap} >
            {loading && <div className="loading">
                <img src={loadingGif} style={{ width: '30%' }} />
            </div>}
            <div className="row">
                <div className={navigationColumnClass}>
                    {showNavigation && <Navigation menu={menu} />}
                </div>
                <div className={contentColumnClass}>
                    <div style={{ marginLeft: '2%', marginRight: '1%' }}>
                        <div className="row">
                            <ul class="nav nav-tabs col-6">
                                <li class="nav-item">
                                    <button class="nav-link " onClick={handleToggleNavigation}>
                                        {showNavigation ? "<<" : ">>"}
                                    </button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabNhanVien' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab1)}>Nhân Viên</button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabVaiTroTruyCap' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab2)}>Vai Trò Truy Cập</button>
                                </li>
                                <li class="nav-item">
                                    <button
                                        className={activeTab === 'TabViTriCongViec' ? 'nav-link active' : 'nav-link'}
                                        onClick={() => handleTabClick(tabs.tab3)}>Vị Trí Công Việc</button>
                                </li>

                            </ul>
                            <div className="col-6 d-flex justify-content-end align-items-center">
                                <span className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                <FontAwesomeIcon icon={faUser}/>  Chào! <span style={{color:'blue'}}>{thongTinDangNhap.TenNhanVien}</span>     
                                </span>
                                <span className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                <FontAwesomeIcon icon={faCog}/>     
                                </span>
                                <span className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                <FontAwesomeIcon icon={faBell}/>     
                                </span>
                                <button onClick={() => logout()}className="btn btn-primary btn-sm mb-0">
                                    Đăng Xuất <FontAwesomeIcon icon={faSignOut} />
                                </button>
                            </div>
                        </div>
                        <TabComponent />

                    </div>
                </div>
            </div>
        </CheckLogin>
    );
}

export default NhanVien