import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link, useLocation } from "react-router-dom"
import { getCookie } from "../Cookie";
import { urlChangePassword } from "../url";
function TabTaiKhoan(props) {
    //xử lý redux
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
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
    const lines = JSON.stringify(props.thongTinDangNhap.NhanVien)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    const handleSubmit = () => {
        if (!dataReq.MatKhauCu || !dataReq.MatKhauMoi || !dataReq.NhapLaiMatKhauMoi)
            addNotification('Vui lòng nhập đầy đủ thông tin.', 'warning', 4000)
        else if (dataReq.MatKhauMoi != dataReq.NhapLaiMatKhauMoi) {
            addNotification('Mật khẩu và Nhập lại mật khẩu không khớp.', 'warning', 4000)
        }else if (dataReq.MatKhauMoi === dataReq.MatKhauCu) {
            addNotification('Mật khẩu cũ và Mật khẩu mới không được trùng nhau.', 'warning', 4000)
        }
        else {
            dispatch({ type: 'SET_LOADING', payload: true })

            fetch(urlChangePassword, {
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
                    } else if (response.status === 401) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else if (response.status === 500) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else {
                        return;
                    }
                })
                .then(data => {
                    addNotification(data.message, 'success', 3000)
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

        }
    }

    return (
        <div>
            <div class="card mb-4" >
                <div class="card-header pb-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <NotificationContainer notifications={notifications} />
                    <h2 style={{ width: '100%', textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Tài Khoản</h2>
                    <div style={{ width: '100%', textAlign: 'center', margin: '1% 0 2% 0' }}>
                        <img
                            style={{
                                width: '200px',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '5px solid #cb0c9f'
                                , boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px'
                            }}
                            src={props.thongTinDangNhap.NhanVien.HinhAnh}
                            onClick={() => {
                                addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                            }}
                        />
                    </div>
                    <div className="row" style={{ width: '80%' }}>
                        <div className="col-6">
                            <h4>ㅤ</h4>
                            <div className="form-group">
                                <label >Tài Khoản</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.TaiKhoan}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                            {/* <div className="form-group">
                                <label>Mật Khẩu</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value='************'
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div> */}
                            <div className="form-group">
                                <label>Vai Trò Truy Cập</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.VaiTro}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Quyền</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.Quyen}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-6">
                            <h4 style={{ textAlign: 'center' }}>Đổi Mật Khẩu</h4>
                            <div className="form-group">
                                <label>Nhập Mật Khẩu Cũ</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={dataReq.MatKhauCu}
                                    onChange={(event) => {
                                        setDataReq({
                                            ...dataReq,
                                            MatKhauCu: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhập Mật Khẩu Mới</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={dataReq.MatKhauMoi}
                                    onChange={(event) => {
                                        setDataReq({
                                            ...dataReq,
                                            MatKhauMoi: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Nhập Lại Mật Khẩu Mới</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={dataReq.NhapLaiMatKhauMoi}
                                    onChange={(event) => {
                                        setDataReq({
                                            ...dataReq,
                                            NhapLaiMatKhauMoi: event.target.value
                                        });
                                    }}
                                />
                            </div>
                            {/* <div className="form-group">
                                <label>Ngày Vào</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.NgayVao}
                                    onClick={() => {
                                        addNotification('Bạn cần liên hệ với QTV để cập nhật những thông tin này', 'warning', 4000)
                                    }}
                                    style={{
                                        opacity: 0.9,
                                        cursor: 'not-allowed'
                                    }}
                                />
                            </div> */}
                            <button style={{ float: 'right' }} className="btn btn-primary" onClick={() => {
                                handleSubmit()
                            }}>Xác Nhận Đổi Mật Khẩu</button>
                        </div>
                    </div>
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
                <div class="card-body px-0 pt-0 pb-2 mt-2" >


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

export default TabTaiKhoan