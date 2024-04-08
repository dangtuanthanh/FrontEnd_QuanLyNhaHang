import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faAdd, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

import { getCookie } from "../Cookie";
import { urlGetTypeProduct, urlDeleteTypeProduct, urlGetOrder } from "../url";
import ItemsPerPage from "../ItemsPerPage";
import TableDauBep from "../Table/TableDauBep";
function TabDauBep() {
    //xử lý redux
    const dispatch = useDispatch();
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'ThoiGianDat',
        sortOrder: 'asc',
        searchBy: 'TenSanPham',
        search: '',
        searchExact: 'false',
        page: 1,
        limit: 1000
    });//
    const [dataRes, setDataRes] = useState({});

    // popup hộp thoại thông báo
    const [popupAlert, setPopupAlert] = useState(false);//trạng thái thông báo
    const [popupMessageAlert, setPopupMessageAlert] = useState('');
    const [onAction, setOnAction] = useState(() => { });
    const PopupAlert = (props) => {
        return (
            <div className="popup">
                <div className="popup-box">
                    <div className="box" style={{ textAlign: 'center' }}>
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



    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'TenSanPham',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value
        });

    };

    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'TenSanPham',
            sortOrder: 'asc',
            page: 1,
            searchBy: event.target.value
        });

    };



    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const [countDown, setCountDown] = useState(5);
    const [intervalId, setIntervalId] = useState(null);
    const [isRunning, setIsRunning] = useState(true);

    // Handle start/stop interval
    useEffect(() => {

        if (!isRunning) {
            clearInterval(intervalId);
            return;
        }

        let id = setInterval(() => {

            if (countDown > 0) {
                setCountDown(prev => prev - 1);
            } else {
                TaiDuLieu();
                setCountDown(5);
            }

        }, 1000);

        setIntervalId(id);

        return () => clearInterval(id);

    }, [isRunning, countDown]);

    // Toggle switch
    const toggle = () => {
        setIsRunning(prev => !prev);
    }
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetOrder}?status=1&page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
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
                //cập nhật dữ liệu hiển thị
                setDuLieuHienThi(data.data)
                //cập nhật thông số trang
                setDataRes({
                    currentPage: data.currentPage,
                    itemsPerPage: data.itemsPerPage,
                    sortBy: data.sortBy,
                    sortOrder: data.sortOrder,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages
                });
                if (data.currentPage > data.totalPages && data.totalPages !== null) {
                    setdataUser({
                        ...dataUser,
                        page: data.totalPages
                    });

                }
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
    };
    return (
        <div>
            <div class="card mb-4">
                <div class="card-header pb-0">
                    <h2 style={{ textAlign: 'center' }}>Hàng Đợi Món Ăn</h2>

                    <NotificationContainer notifications={notifications} />
                    {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}

                    <div>


                        <div style={{ 'display': "flex",alignItems:'center', float: 'right' }}>
                            
                            
                            <input id="search" value={dataUser.search} onChange={handleSearch} placeholder='Tìm Kiếm' type="text" className="form-control-sm" />
                            {
                                dataUser.search !== '' &&
                                <button
                                    className="btn btn-close"
                                    style={{ color: 'red', marginLeft: '4px', marginTop: '10px' }}
                                    onClick={() => {
                                        setdataUser({
                                            ...dataUser,
                                            search: ''
                                        });
                                    }}
                                >
                                    X
                                </button>
                            }
                            ㅤ
                            <select class="form-select-sm" value={dataUser.searchBy} onChange={handleSearchBy}>
                                <option value="TenSanPham">Tìm theo Tên Sản Phẩm</option>
                                <option value="TenBan">Tìm theo Tên Bàn</option>
                            </select>
                            ㅤ
                            <div style={{ 'display': "flex",alignItems:'center',border:'2px solid #e9ecef',borderRadius:'30px'}}>
                            <label  style={{marginBottom:'0px',color:'#6d6d6d',fontWeight:"bold"}}>Tự động cập nhật:  </label>
                            <label style={{marginBottom:'0px'}}> {countDown}</label>
                            ㅤ
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '50px',
                                    height: '25px',
                                    backgroundColor: isRunning ? '#cb0c9f' : 'gray',
                                    borderRadius: '30px',
                                    position: 'relative'
                                }}
                                onClick={toggle}
                            >
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '2px',
                                        left: isRunning ? '27px' : '2px',
                                        transition: 'all 0.2s ease'
                                    }}
                                />
                            </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="card-body px-0 pt-0 pb-2">
                    <div class="table-responsive p-0">
                        <TableDauBep
                            duLieuHienThi={duLieuHienThi}
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            addNotification={addNotification}
                            openPopupAlert={openPopupAlert}
                        />
                        {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                        <label style={{ borderTop: '1px solid black', marginLeft: '60%', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortBy === "ThoiGianDat" ?
                            (dataRes.sortOrder === 'asc'
                                ? <label style={{ color: 'darkgray', marginRight: '3px' }}>cũ nhất đến mới nhất </label>
                                : <label style={{ color: 'darkgray', marginRight: '3px' }}>mới nhất đến cũ nhất </label>)
                            : (
                                dataRes.sortOrder === 'asc'
                                    ? <label style={{ color: 'darkgray', marginRight: '3px' }}>tăng dần </label>
                                    : <label style={{ color: 'darkgray', marginRight: '3px' }}>giảm dần</label>)}
                            theo cột {dataRes.sortBy}   </label>
                    </div>
                </div>
            </div>
            {
                popupAlert && <PopupAlert
                    message={popupMessageAlert}
                    onClose={closePopupAlert}
                    onAction={onAction}
                />
            }
        </div>
    )

}

export default TabDauBep