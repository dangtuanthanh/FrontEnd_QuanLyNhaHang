import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlInsertInvoice, urlGetInvoice, urlUpdateInvoice, urlGetTable, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faIdCard, faTrashAlt, faXmark, faBars, faClone, faFile, faPencil, faTable, faTag, faCheckCircle, faCheck, faCartShopping, faSpinner, faCheckToSlot, faBan } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faMinusSquare } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { arialFont } from "../Font";
import logo from '../../assets/img/logos/logo-removebg-preview.png';
// import TabChonBan from "./ChonBan";
import TabChonMon from "./ChonMon";
import ChonKhachHang from "./ChonKhachHang";
import ChonGiamGia from "./ChonGiamGia";
import ChonTachGhep from "./ChonTachGhep";
import ChonThanhToan from "./ChonThanhToan";
import ChonInHoaDon from "./ChonInHoaDon";
const GoiMonChoKhach = (props) => {
    const dispatch = useDispatch()
    // popup hộp thoại thông báo
    const [popupAlert, setPopupAlert] = useState(false);//trạng thái thông báo
    const [popupMessageAlert, setPopupMessageAlert] = useState('');
    const [onAction, setOnAction] = useState(() => { });
    const PopupAlert = (props) => {
        return (
            <div className="popup">
                <div className="popup-box">
                    <div className="box" style={{ textAlign: 'center', marginTop: '1%', padding: '1rem', width: isMobile && '100%' }}>
                        <h5>Thông Báo</h5>

                        <p>{props.message}</p>
                        {props.onAction ? <div>
                            <button style={{ float: 'left' }} className="btn btn-danger" onClick={props.onClose}>Thoát</button>
                            <button style={{ float: 'right' }} className="btn btn-success" onClick={handleConfirm}>Xác Nhận</button>
                        </div> :
                            <button className="btn btn-success" onClick={props.onClose}>Xác Nhận</button>
                        }
                    </div>
                </div>
            </div>
        );
    };
    const openPopupAlert = (message, actionHandler) => {
        setPopupMessageAlert(message);
        setPopupAlert(true);
        setOnAction(() => actionHandler);
    }
    const closePopupAlert = () => {
        setPopupAlert(false);
    };
    const handleConfirm = () => {
        onAction();
        closePopupAlert();
    }

    //popup thông báo góc màn hình
    const [notifications, setNotifications] = useState([]);
    const addNotification = (message, btn, duration = 3000) => {
        const newNotification = {
            id: Date.now(),
            message,
            btn,
            duration,
        };
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, duration);
    };
    const removeNotification = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    };
    const NotificationContainer = ({ notifications }) => {
        return (
            <div className="notification-container">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={` btn btn-${notification.btn}`}
                        onClick={() => removeNotification(notification.id)}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
        );
    };
    // Lấy URL hiện tại từ thanh địa chỉ
    const currentUrl = window.location.href;
    // Tạo đối tượng URL từ URL hiện tại
    const urlObj = new URL(currentUrl);
    // Sử dụng URLSearchParams để lấy giá trị của tham số 'answer'
    const params = new URLSearchParams(urlObj.search);
    const IDBan = params.get('IDBan');

    // In ra giá trị của tham số 'answer'
    console.log('IDBan', IDBan);

    const [dataReq, setDataReq] = useState({
        IDNhanVien: 120007,
        DanhSach: [],
        IDBan: Number(IDBan)
    });
    const [dataUser, setDataUser] = useState(0)
    const [popupChonKhachHang, setPopupChonKhachHang] = useState(false);

    const [popupChonGiamGia, setPopupChonGiamGia] = useState(false);
    const [popupTachGhep, setPopupTachGhep] = useState(false);
    const [popupChonThanhToan, setPopupChonThanhToan] = useState(false);
    const [popupChonInHoaDon, setPopupChonInHoaDon] = useState(false);
    const [styleButton, setStyleButton] = useState(false);
    const [tongTien, setTongTien] = useState(0);
    useEffect(() => {
        console.log('dữ liệu gửi đi: dataReq chính ', dataReq);
        setTongTien(dataReq.DanhSach.reduce((total, item) => {
            return total + item.SoLuong * item.GiaBan;
        }, 0))
    }, [dataReq]);


    const [isInsert, setIsInsert] = useState(false);
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`${urlGetTable}?id=${IDBan}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401 || response.status === 500) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                } else {
                    return null;
                }
            })
            .then(data => {
                if (data.IDHoaDon) {
                    setIsInsert(false)
                    fetch(`${urlGetInvoice}?id=${data.IDHoaDon}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error', response.message);
                            }
                            return response.json();
                        })
                        .then(data => {
                            setDataReq(data);
                            //ẩn loading
                            dispatch({ type: 'SET_LOADING', payload: false })
                        })
                        .catch(error => {
                            if (error instanceof TypeError) {
                                openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                            } else {
                                addNotification(error.message, 'warning', 5000)
                            }
                            dispatch({ type: 'SET_LOADING', payload: false })
                        });
                } else setIsInsert(true)
                //ẩn loading
                dispatch({ type: 'SET_LOADING', payload: false })
            })
            .catch(error => {
                dispatch({ type: 'SET_LOADING', payload: false })
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
    }, []);




    const tabs = {
        // tab1: 'TabChonBan',
        tab2: 'TabChonMon',
        tab3: 'TabDonViTinh'
    }

    const [activeTab, setActiveTab] = useState(
        tabs.tab2
    );

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;
    if (activeTab === tabs.tab2) {
        TabComponent = TabChonMon;
    }

    // Phân tách dữ liệu thành các dòng
    const lines = JSON.stringify(dataReq)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    /*xử lý phần chi tiết*/
    function handleDetailChange(ID, value, TenCot) {
        const index = dataReq.DanhSach.findIndex(
            item => {
                return item.IDSanPham === ID;
            }
        );
        dataReq.DanhSach[index][TenCot] = value
        setDataReq({
            ...dataReq,
            DanhSach: [...dataReq.DanhSach]
        })
    }

    //xử lý thông báo bếp
    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.IDNhanVien && dataReq.DanhSach.length > 0) {
            dispatch({ type: 'SET_LOADING', payload: true })
            if (isInsert === true) {
                fetch(urlInsertInvoice, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(dataReq)
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        }
                    })
                    .then(data => {
                        addNotification('Bếp đã nhận được thông báo', 'success', 3000)
                        window.location.reload();
                        //ẩn loading
                        dispatch({ type: 'SET_LOADING', payload: false })
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        console.log('err', error);
                        if (error instanceof TypeError) {
                            openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            addNotification(error.message, 'warning', 5000)
                        }

                    });
            }
            else {
                fetch(urlUpdateInvoice, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(dataReq)
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else if (response.status === 401) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else if (response.status === 500) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else {
                            return;
                        }
                    })
                    .then(data => {
                        addNotification('Bếp đã nhận được thông báo', 'success', 3000)
                        setDataUser(dataUser + 1)
                        //ẩn loading
                        dispatch({ type: 'SET_LOADING', payload: false })
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        console.log('error', error);
                        if (error instanceof TypeError) {
                            openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            addNotification(error.message, 'warning', 5000)
                        }

                    });
            }
        }
        else openPopupAlert('Vui lòng chọn ít nhất một món ăn')

    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const [showNavigation, setShowNavigation] = useState((false));
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    return (
        <div className="full-popup-box">
            <div className="full-box" style={{ overflowY: 'hidden' }}>
                <NotificationContainer notifications={notifications} />
                <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                    <div className={`${isMobile ? 'col-12 card' : 'col-8 card'}`}
                        style={{ display: showNavigation && 'none' }}>
                        <ul class="nav nav-tabs">
                            {/* <li class="nav-item">
                                <button class="nav-link " onClick={() => {
                                    props.setPopupInsertUpdate(false)

                                }}>
                                    {"<<"}
                                </button>
                            </li> */}
                            {/* <li class="nav-item">
                                <button
                                    className={activeTab === 'TabChonBan' ? 'nav-link active' : 'nav-link'}
                                    onClick={() => handleTabClick(tabs.tab1)}>Bàn</button>
                            </li> */}
                            {/* <li class="nav-item">
                                <button
                                    className={activeTab === 'TabChonMon' ? 'nav-link active' : 'nav-link'}
                                    onClick={() => {
                                        if (dataReq.IDBan) {
                                            handleTabClick(tabs.tab2)
                                        } else
                                            addNotification('Vui lòng chọn một bàn ăn', 'warning', 5000)

                                    }}>Chọn Món</button>
                            </li> */}
                            {/* <li class="nav-item">
                                        <button
                                            className={activeTab === 'TabDonViTinh' ? 'nav-link active' : 'nav-link'}
                                            onClick={() => handleTabClick(tabs.tab3)}>Đơn Vị Tính</button>
                                    </li> */}
                        </ul>
                        <TabComponent
                            addNotification={addNotification}
                            openPopupAlert={openPopupAlert}
                            dataReq={dataReq}
                            setDataReq={setDataReq}
                            setActiveTab={setActiveTab}
                            handleDetailChange={handleDetailChange}
                            setIsInsert={props.setIsInsert}
                            setIDAction={props.setIDAction}
                            dataUser={dataUser}
                            setDataUser={setDataUser}
                            IDNhanVien={dataReq.IDNhanVien}
                        />

                    </div>
                    {(!isMobile || showNavigation) &&
                        <div div className={`${isMobile ? 'col-12 card' : 'col-4 card'}`}>
                            {dataReq.IDBan ? <div>
                                <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Hoá Đơn
                                    <span style={{ color: 'blue' }}> {dataReq.IDHoaDon}</span></h3>
                                <div style={{ height: '35em', maxHeight: '57%', overflow: 'auto', overflowX: 'hidden' }}>
                                    {dataReq.DanhSach && dataReq.DanhSach.length > 0 ? <div>
                                        {dataReq.DanhSach.map((item, index) => (
                                            <div key={item.IDSanPham}
                                                className="row card-body"
                                                style={{ paddingBottom: '0', boxShadow: '0 20px 27px 0 rgba(0,0,0,.05)', borderRadius: '30px' }}
                                            >
                                                <div className="col-6" style={{ paddingRight: 0 }}>
                                                    <h6>{index + 1}. {item.TenSanPham} </h6>
                                                    <label
                                                        onClick={() => {
                                                            let GhiChuMonAn = null
                                                            if (item.GhiChu) {
                                                                GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:", item.GhiChu.toString());
                                                            } else {
                                                                GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:");
                                                            }

                                                            if (GhiChuMonAn) {
                                                                handleDetailChange(item.IDSanPham,
                                                                    GhiChuMonAn,
                                                                    'GhiChu'
                                                                )
                                                            }
                                                        }}
                                                        style={{ color: '#9d9d9d' }}
                                                    >
                                                        {item.GhiChu ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faFile} style={{
                                                                    marginRight: '4px'
                                                                }} />
                                                                {
                                                                    item.GhiChu.length > 20
                                                                        ? item.GhiChu.slice(0, 20) + '...'
                                                                        : item.GhiChu
                                                                }
                                                            </>
                                                        ) : <><FontAwesomeIcon icon={faFile} style={{
                                                            marginRight: '4px'
                                                        }} />
                                                            Nhập Ghi Chú / Món Thêm
                                                        </>
                                                        }
                                                    </label>
                                                </div>
                                                <div className="col-2"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        paddingLeft: 0
                                                    }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            fontSize: '20px'
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faMinusSquare}
                                                            style={{ fontSize: '20px' }}
                                                            onClick={() => {
                                                                if (item.SoLuong !== 1) {
                                                                    if (!isInsert) {
                                                                        if (!item.SanPhamThanhPham) {
                                                                            if (item.IDTrangThai == 2 || item.IDTrangThai == 3) {
                                                                                addNotification('Bạn không thể giảm số lượng vì sản phẩm đã được chế biến xong', 'warning', 5000)
                                                                            } else {
                                                                                handleDetailChange(item.IDSanPham, item.SoLuong - 1, 'SoLuong')
                                                                            }
                                                                        } else if (item.IDTrangThai == 3)
                                                                            addNotification('Bạn không thể giảm số lượng vì sản phẩm đã được giao', 'warning', 5000)
                                                                        else handleDetailChange(item.IDSanPham, item.SoLuong - 1, 'SoLuong')
                                                                    } else {
                                                                        handleDetailChange(item.IDSanPham, item.SoLuong - 1, 'SoLuong')
                                                                    }

                                                                }
                                                            }}
                                                        />

                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                fontSize: '20px',
                                                                margin: '0 5px'
                                                            }}
                                                            onClick={() => {
                                                                const SoLuong = prompt("Nhập Số Lượng:");
                                                                if (SoLuong) {
                                                                    if (SoLuong.toString().match(/^\d+$/)) {
                                                                        handleDetailChange(item.IDSanPham, Number(SoLuong), 'SoLuong');
                                                                    } else {
                                                                        addNotification('Số bạn nhập không hợp lệ', 'warning', 4000);
                                                                        return;
                                                                    }
                                                                } else {
                                                                    addNotification('Bạn không nhập gì', 'warning', 4000);
                                                                    return;
                                                                }
                                                            }}
                                                        >
                                                            {item.SoLuong}
                                                        </div>

                                                        <FontAwesomeIcon
                                                            icon={faSquarePlus}
                                                            style={{ fontSize: '20px' }}
                                                            onClick={() => {
                                                                handleDetailChange(item.IDSanPham, item.SoLuong + 1, 'SoLuong')
                                                                handleDetailChange(item.IDSanPham, item.SoLuong + 1, 'SanPhamThanhPham')
                                                                handleDetailChange(
                                                                    item.IDSanPham, 1, 'IDTrangThai'
                                                                );
                                                            }}
                                                        />
                                                    </div>


                                                </div>
                                                <div className="col-3">
                                                    <strong
                                                        style={{
                                                            fontSize: '13px',
                                                            margin: '0 5px',
                                                            float: 'right'
                                                        }}
                                                    >
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(item.GiaBan)}
                                                    </strong>
                                                    <label
                                                        style={{
                                                            fontSize: '17px',
                                                            margin: '0 5px',
                                                            float: 'right'
                                                        }}
                                                    >
                                                        {new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                            // }).format(item.ThanhTien)}
                                                        }).format(item.GiaBan * item.SoLuong)}
                                                    </label>
                                                </div>
                                                <div className="col-1" style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    borderLeft: '2px #bebaba solid',
                                                    justifyContent: 'center'
                                                }}>
                                                    <FontAwesomeIcon
                                                        icon={
                                                            item.IDTrangThai === 1 ? faSpinner :
                                                                item.IDTrangThai === 2 ? faCheckToSlot :
                                                                    item.IDTrangThai === 3 ? faCheck :
                                                                        item.IDTrangThai === 4 ? faBan :
                                                                            null
                                                        }
                                                        style={{ fontSize: '20px' }}
                                                    // onClick={() => {
                                                    //     setDataReq({
                                                    //         ...dataReq,
                                                    //         DanhSach: dataReq.DanhSach.filter(newitem => newitem.IDSanPham !== item.IDSanPham)
                                                    //     })
                                                    // }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faTrashAlt}
                                                        style={{ fontSize: '20px' }}
                                                        onClick={() => {
                                                            if (item.IDTrangThai !== 2 && item.IDTrangThai !== 3) {
                                                                setDataReq({
                                                                    ...dataReq,
                                                                    DanhSach: dataReq.DanhSach.filter(newitem => newitem.IDSanPham !== item.IDSanPham)
                                                                });
                                                            } else addNotification('Không thể xoá sản phẩm khi sản phẩm đã chế biến xong hoặc đã giao', 'warning', 5000)
                                                        }}
                                                    />
                                                </div>
                                                <hr></hr>
                                            </div>
                                        ))}
                                        {/* <pre
                                        style={{
                                            background: '#333',
                                            color: '#fff',
                                            padding: '10px',
                                            margin: '20px auto',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-all'
                                        }}
                                    >
                                        Đã chọn: {lines.map(line => <div>{line}</div>)}
                                    </pre> */}
                                    </div>
                                        : <div style={{
                                            position: 'absolute',
                                            top: '40%',
                                            left: '15%'
                                        }}>
                                            <h3 style={{ color: 'gray' }} >Vui lòng chọn một món ăn</h3>
                                        </div>
                                    }
                                </div>





                                <div style={{ width: '100%' }}>
                                    {dataReq.SuDungDiemKhachHang &&
                                        <label style={{ color: 'grey' }}>Hoá đơn này đang sử dụng điểm khách hàng với số điểm: {dataReq.DiemKhachHang}</label>
                                    }
                                    <div style={{ width: '100%', float: 'right' }}>

                                        <p style={{ float: 'left', marginLeft: '2%', marginBottom: '0px' }}>
                                            <strong style={{
                                                fontSize: '20px',
                                                color: 'black',
                                                marginRight: '4px'
                                            }}>
                                                {
                                                    dataReq.DanhSach.reduce((total, item) => {
                                                        return total + item.SoLuong;
                                                    }, 0)

                                                }
                                            </strong>
                                            {dataReq.GiamGia ? 'SP' : 'Sản Phẩm'}
                                        </p>
                                        {(dataReq.GiamGia) &&
                                            <p style={{ float: 'right', marginLeft: '2%', marginBottom: '0px' }}>
                                                Tổng Tiền Sau Khi Giảm:  <strong style={{
                                                    fontSize: '20px',
                                                    color: 'black',
                                                    marginRight: '5px'
                                                }}>

                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(tongTien -
                                                        (dataReq.PhuongThucGiamGia === 'Phần Trăm'
                                                            ? tongTien * (dataReq.GiamGia / 100)
                                                            : dataReq.GiamGia)
                                                        - (dataReq.SuDungDiemKhachHang == true ? dataReq.DiemKhachHang : 0)
                                                    )}
                                                </strong>

                                            </p>
                                        }
                                        {!dataReq.GiamGia && <p style={{ float: 'right', marginBottom: '0px' }}>
                                            Tổng Tiền:  <strong style={{
                                                fontSize: '20px',
                                                color: 'black',
                                                marginRight: '5px'
                                            }}>

                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(tongTien)}
                                            </strong>
                                        </p>
                                        }
                                    </div>
                                </div>

                                <div className="row" style={{ marginLeft: '2%' }}>

                                    <div className="col-6" style={{
                                        padding: '0'
                                    }}>
                                        <button
                                            style={{ width: '85%' }}
                                            className="btn btn-light btn-sm"
                                        ><FontAwesomeIcon icon={faTable} style={{
                                            marginRight: '4px'
                                        }} />  {dataReq.TenBan}
                                            {!isMobile && (
                                                <>
                                                    {' / '}
                                                    {dataReq.TenKhuVuc && dataReq.TenKhuVuc.length > 6
                                                        ? dataReq.TenKhuVuc.slice(0, 6) + '...'
                                                        : dataReq.TenKhuVuc}
                                                </>
                                            )}</button>

                                    </div>
                                    <div className="col-6" style={{ padding: '0' }}>

                                        {/* Ghi chú bàn ăn */}
                                        <button
                                            className="btn btn-light btn-sm"
                                            onClick={() => {
                                                let GhiChu = null
                                                if (dataReq.GhiChu) {
                                                    GhiChu = prompt("Nhập Ghi Chú Cho Bàn Ăn:", dataReq.GhiChu.toString());
                                                } else {
                                                    GhiChu = prompt("Nhập Ghi Chú Cho Bàn Ăn:");
                                                }

                                                if (GhiChu) {
                                                    setDataReq({
                                                        ...dataReq,
                                                        GhiChu: GhiChu
                                                    })
                                                }
                                            }}
                                            style={{
                                                width: isInsert ? '85%' : '85%',
                                                ...(isInsert
                                                    ? {}
                                                    : {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        marginBottom: '6px'
                                                    })
                                            }}
                                        >
                                            {dataReq.GhiChu ? (
                                                <>
                                                    <FontAwesomeIcon icon={faPencil} style={{
                                                        marginRight: '4px'
                                                    }} />
                                                    {
                                                        dataReq.GhiChu.length > 10
                                                            ? dataReq.GhiChu.slice(0, 10) + '...'
                                                            : dataReq.GhiChu
                                                    }

                                                </>
                                            ) : <><FontAwesomeIcon icon={faPencil} style={{
                                                marginRight: '4px'
                                            }} />
                                                Ghi Chú
                                            </>
                                            }
                                        </button>
                                    </div>
                                </div>

                                <div className="row" style={{ marginLeft: '4%', marginRight: '6%' }}>
                                    <div className="col-12" style={{ padding: '0' }}>
                                        <button
                                            style={{ width: '100%' }}
                                            className="btn btn-primary"
                                            onClick={handleSubmit}
                                        >
                                            <FontAwesomeIcon icon={faCheckCircle} style={{
                                                marginRight: '4px'
                                            }} />Lưu và Báo Bếp
                                        </button>
                                    </div>
                                </div>
                            </div>
                                : <div style={{
                                    position: 'absolute',
                                    top: '40%',
                                    left: '15%'
                                }}>
                                    <h3 style={{ color: 'gray' }} >Vui lòng chọn một bàn ăn</h3>
                                </div>
                            }
                        </div>
                    }

                </div>
                {
                    isMobile &&
                    <div style={{
                        position: 'fixed',
                        bottom: '4rem',
                        right: '2.5rem',
                        padding: '8px 8px',
                        width: '4rem',
                        fontSize: '1.4rem',
                        borderRadius: '30px'
                    }}>
                        <label style={{ position: 'absolute',right:'1%',color:'white',fontSize: '0.8rem', }}>{
                            dataReq.DanhSach.reduce((total, item) => {
                                return total + item.SoLuong;
                            }, 0)

                        }</label>
                        <button
                            id="ButtonMenu"
                            className="btn bg-gradient-primary"
                            onClick={() => {
                                setShowNavigation(!showNavigation)
                            }}
                            style={{
                                fontSize: '1.4rem',
                                borderRadius: '2x0px'
                            }}
                        >
                            {showNavigation ? (
                                <FontAwesomeIcon icon={faXmark} />
                            ) : (
                                <FontAwesomeIcon icon={faCartShopping} />
                            )}
                        </button>
                    </div>
                }
            </div>

            {
                popupChonKhachHang && <div className="popup">
                    <ChonKhachHang
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        dataReq={dataReq}
                        setDataReq={setDataReq}
                        setPopupChonKhachHang={setPopupChonKhachHang}
                    />
                </div>
            }
            {
                popupChonGiamGia && <div className="popup">
                    <ChonGiamGia
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        dataReq={dataReq}
                        setDataReq={setDataReq}
                        setPopupChonGiamGia={setPopupChonGiamGia}
                        dataUser={dataUser}
                        setDataUser={setDataUser}
                        isInsert={isInsert}
                    />
                </div>
            }
            {
                popupChonThanhToan && <div className="popup">
                    <ChonThanhToan
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        dataReq={dataReq}
                        setDataReq={setDataReq}
                        setPopupChonThanhToan={setPopupChonThanhToan}
                        dataUser={props.dataUser}
                        setdataUser={props.setdataUser}
                        isInsert={isInsert}
                        loadTrang={dataUser}
                        setLoadTrang={setDataUser}
                        setPopupInsertUpdate={props.setPopupInsertUpdate}
                    />
                </div>
            }
            {
                popupTachGhep && <div className="popup">
                    <ChonTachGhep
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        dataReq={dataReq}
                        setDataReq={setDataReq}
                        setPopupTachGhep={setPopupTachGhep}
                        IDNhanVien={dataReq.IDNhanVien}
                        dataUser={dataUser}
                        setDataUser={setDataUser}
                        setPopupInsertUpdate={props.setPopupInsertUpdate}
                    />
                </div>
            }
            {
                popupChonInHoaDon && <div className="popup">
                    <ChonInHoaDon
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        dataReq={dataReq}
                        setDataReq={setDataReq}
                        setPopupTachGhep={setPopupTachGhep}
                        IDNhanVien={dataReq.IDNhanVien}
                        dataUser={dataUser}
                        setDataUser={setDataUser}
                        setPopupInsertUpdate={props.setPopupInsertUpdate}
                    />
                </div>
            }
            {
                popupAlert && <PopupAlert
                    message={popupMessageAlert}
                    onClose={closePopupAlert}
                    onAction={onAction}
                />
            }
        </div >

    );
};
// Ghi Chú, Khu Vực
export default GoiMonChoKhach;