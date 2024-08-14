import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTimes, faBars, faSignOut, faUserFriends, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, deleteCookie } from "../components/Cookie";
import CheckLogin from "../components/CheckLogin"
import loadingGif from '../assets/img/loading/loading1.gif'
import TabSuperAdmin from "../components/Tabs/TabSuperAdmin";
import '../App.css';
function SuperAdmin() {
    //xử lý redux
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const loading = useSelector(state => state.loading.loading)
    const logout = () => {
        deleteCookie('loginsuperadmin')
        navigate(`/Admin`);
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


    const tabs = {
        tab1: 'TabSuperAdmin'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabSuperAdmin;
    }

    return (
        <div>
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
                        <div className='col-12'>
                            <div style={{ marginLeft: '2%', marginRight: '1%' }}>
                                <div style={{ marginLeft: '0px' }} className="row">
                                    <ul class="nav nav-tabs col-6">
                                        <li class="nav-item">
                                            <button
                                                style={{ color: '#ff8c00' }}
                                                className={activeTab === 'TabSuperAdmin' ? 'nav-link active' : 'nav-link'}
                                                onClick={() => handleTabClick(tabs.tab1)}>
                                                {isMobile ? (
                                                    <FontAwesomeIcon icon={faHandshake} />
                                                ) : (
                                                    'Đối Tác'
                                                )}
                                            </button>
                                        </li>

                                    </ul>
                                    <div className="col-6 d-flex justify-content-end align-items-center">
                                        <span style={{ marginLeft: '20px' }} className="mb-0 d-sm-inline d-none text-body font-weight-bold px-0">
                                            <div>
                                                <FontAwesomeIcon icon={faUser} />  Chào! <span style={{ color: 'blue' }}>SuperAdmin</span>
                                            </div>
                                        </span>

                                        <button style={{ marginLeft: '20px' }} onClick={() => logout()} className="btn btn-primary btn-sm mb-0">
                                            {isMobile ? (
                                                <FontAwesomeIcon icon={faSignOut} />
                                            ) : (
                                                'Đăng Xuất'
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <TabComponent />
                            </div>
                        </div>
                    </div>
            }

        </div>
    );
}

export default SuperAdmin