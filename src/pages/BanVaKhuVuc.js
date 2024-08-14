import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTimes, faBars, faSignOut, faTable, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { getCookie, deleteCookie } from "../components/Cookie";
import { urlLogout } from "../components/url";
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import loadingGif from '../assets/img/loading/loading1.gif'
import TabKhuVuc from "../components/Tabs/TabKhuVuc";
import TabBan from "../components/Tabs/TabBan";
import Logout_ChotCa from "../components/Popup/Logout_ChotCa";
import '../App.css';
function BanVaKhuVuc() {
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
                        deleteCookie('IDDoiTac')
                        dispatch({ type: 'SET_LOADING', payload: false })
                        navigate(`/Login`);
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
    const [isMobile, setIsMobile] = useState(() => {
        return window.innerWidth < 1250;
    });
    const [errHeight, setErrHeight] = useState(window.innerHeight < 600);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1250);
            const isMobileRedux = window.innerWidth < 1250;
            dispatch({
                type: 'SET_ISMOBILE',
                payload: isMobileRedux
            });
            if (window.innerHeight < 600) {
                setErrHeight(true)
            } else setErrHeight(false)
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const [showNavigation, setShowNavigation] = useState(() => {
        return isMobile ? false : true;
    });
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";


    const tabs = {
        tab1: 'TabBan',
        tab2: 'TabKhuVuc'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabBan;
    }

    if (activeTab === tabs.tab2) {
        TabComponent = TabKhuVuc;
    }

    return (
        <CheckLogin thongTinDangNhap={xuLyLayThongTinDangNhap}  >
            {loading && <div className="loading">
                <img src={loadingGif} style={{ width: '30%' }} />
            </div>}
            {
                errHeight ? <div className="popup">
                    <div className="popup-box">
                        <div className="box">
                            <div className="conten-modal" >
                                <h6>Bạn đang sử dụng thiết bị có chiều cao nhỏ hơn 600px.</h6>
                                <p>Để đảm bảo ứng dụng được hiển thị đầy đủ hãy sử dụng thiết bị có chiều cao lớn hơn như máy tính, máy tính bảng.</p>
                                <strong style={{ fontSize: '0.9rem', color: 'red' }}>Nếu bạn đang sử dụng điện thoại, hãy xoay dọc điện thoại của mình.</strong>
                            </div>
                        </div>
                    </div>
                </div>
                    :
                    <div className="row">
                        <div className={navigationColumnClass}>
                            {showNavigation && <Navigation menu={thongTinDangNhap.menu} logo={thongTinDangNhap.Logo}/>}
                        </div>
                        <div className={contentColumnClass} style={{
                            opacity: isMobile && showNavigation ? 0.3 : 1,
                            pointerEvents: isMobile && showNavigation ? 'none' : 'auto'
                        }}>
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
                                                style={{ color: '#ff8c00' }}
                                                className={activeTab === 'TabBan' ? 'nav-link active' : 'nav-link'}
                                                onClick={() => handleTabClick(tabs.tab1)}>
                                                {isMobile ? (
                                                    <FontAwesomeIcon icon={faTable} />
                                                ) : (
                                                    'Bàn Ăn'
                                                )}
                                            </button>
                                        </li>
                                        <li class="nav-item">
                                            <button
                                                style={{ color: '#ff8c00' }}
                                                className={activeTab === 'TabKhuVuc' ? 'nav-link active' : 'nav-link'}
                                                onClick={() => handleTabClick(tabs.tab2)}>
                                                {isMobile ? (
                                                    <FontAwesomeIcon icon={faMapLocation} />
                                                ) : (
                                                    'Khu Vực'
                                                )}

                                            </button>
                                        </li>
                                    </ul>
                                    <div className="col-6 d-flex justify-content-end align-items-center">
                                        <span style={{ marginLeft: '20px' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                            <div onClick={() => {
                                                navigate(`/TrangCaNhan`);
                                            }}>
                                                <FontAwesomeIcon icon={faUser} />  Chào! <span style={{ color: 'blue' }}>{thongTinDangNhap.NhanVien.TenNhanVien}</span>
                                            </div>
                                        </span>

                                        <button style={{ marginLeft: '20px' }} onClick={() => logout()} className="btn btn-primary btn-sm mb-0">
                                            {isMobile ? (
                                                <FontAwesomeIcon icon={faSignOut} />
                                            ) : (
                                                <>
                                                    Đăng Xuất  <FontAwesomeIcon icon={faSignOut} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <TabComponent />
                                {popupChotCa && <Logout_ChotCa
                                    setPopupChotCa={setPopupChotCa}
                                    thongTinDangNhap={thongTinDangNhap}
                                />}
                            </div>
                        </div>
                        {
                            isMobile && <button
                                id="ButtonMenu"
                                className="btn bg-gradient-primary"
                                style={{
                                    position: 'fixed',
                                    top: '3rem',
                                    right: '1.5rem',
                                    padding: '8px 16px',
                                    width: '3rem'
                                }}
                                onClick={() => {
                                    setShowNavigation(!showNavigation)
                                }}
                            >
                                {showNavigation ? (
                                    <FontAwesomeIcon icon={faTimes} />
                                ) : (
                                    <FontAwesomeIcon icon={faBars} />
                                )}
                            </button>
                        }
                    </div>
            }

        </CheckLogin>
    );
}

export default BanVaKhuVuc