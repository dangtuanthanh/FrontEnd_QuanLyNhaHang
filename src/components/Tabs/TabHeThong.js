import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../Cookie";
import { urlGetPerPointCustomert, urlGetPicturePayment, urlUpdatePicturePayment, urlUpdatePerPointCustomert, urlUpdateLogo, urlGetUseSampleData, urlUpdateUseSampleData } from "../url";

function TabHeThong(props) {
    const navigate = useNavigate();
    //xử lý redux
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({ HinhAnh2: props.thongTinDangNhap.Logo });
    const [tiLe, setTiLe] = useState();
    const [suDungDuLieuMau, setSuDungDuLieuMau] = useState();
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

    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        //lấy ảnh thanh toán
        const fetch1 = fetch(`${urlGetPicturePayment}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'iddoitac': getCookie('IDDoiTac'),
            },
        })
        //lấy % điểm khách hàng
        const fetch2 = fetch(`${urlGetPerPointCustomert}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        //lấy sử dụng dữ liệu mẫu 
        const fetch3 = fetch(`${urlGetUseSampleData}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
                'iddoitac': getCookie('IDDoiTac')
            },
        })
        Promise.all([fetch1, fetch2, fetch3])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401 || response.status === 500) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message);
                        });
                    } else {
                        return null;
                    }
                });
                return Promise.all(processedResponses);
            })
            .then(data => {
                setDataReq({
                    ...dataReq,
                    HinhAnh: data[0][0].AnhThanhToan
                })
                setTiLe(data[1][0].PhanTramDiemTichLuy)
                setSuDungDuLieuMau(data[2][0].SuDungDuLieuMau)
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
    }, []);
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh thanh toán
    const [urlAnh, setUrlAnh] = useState();
    useEffect(() => {
        if (dataReq.HinhAnh && dataReq.HinhAnh instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(dataReq.HinhAnh));
        } else setUrlAnh(dataReq.HinhAnh);
    }, [dataReq.HinhAnh]);
    function ImageUpload() {
        const fileInputRef = useRef(null);

        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    HinhAnh: undefined
                });
            }
        };

        const handleChooseFileClick = () => {
            fileInputRef.current.click();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        return (
            <div style={{ maxHeight: '112px' }} className="form-group">
                <label>Hình Ảnh <span style={{ opacity: 0.4 }}>(Khuyễn khích sử dụng hình ảnh vuông)</span></label>
                <div
                    style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', border: '1px dashed #ccc', padding: '1rem 0.8rem', fontSize: '0.9rem', alignItems: 'center' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {dataReq.HinhAnh && (
                        <img
                            src={urlAnh} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                            alt="Selected"
                            style={{ maxWidth: '7rem', marginTop: '5px' }}
                        />
                    )}
                </div>
            </div>
        );
    }
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh logo
    const [urlAnh2, setUrlAnh2] = useState();
    useEffect(() => {
        if (dataReq.HinhAnh2 && dataReq.HinhAnh2 instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh2(URL.createObjectURL(dataReq.HinhAnh2));
        } else setUrlAnh2(dataReq.HinhAnh2);
    }, [dataReq.HinhAnh2]);
    function ImageUpload2() {
        const fileInputRef = useRef(null);

        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh2: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    HinhAnh2: undefined
                });
            }
        };

        const handleChooseFileClick = () => {
            fileInputRef.current.click();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh2: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        return (
            <div style={{ maxHeight: '112px' }} className="form-group">
                <label>Hình Ảnh <span style={{ opacity: 0.4 }}>(Khuyễn khích sử dụng hình ảnh chữ nhật ngang)</span></label>
                <div
                    style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', border: '1px dashed #ccc', padding: '1rem 0.8rem', fontSize: '0.9rem', alignItems: 'center' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {dataReq.HinhAnh2 && (
                        <img
                            src={urlAnh2} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                            alt="Selected"
                            style={{ maxWidth: '7rem', marginTop: '5px' }}
                        />
                    )}
                </div>
            </div>
        );
    }
    //đổi tỉ lệ điểm khách hàng
    const handleSubmitTiLe = () => {
        if (tiLe) {
            if (!isNaN(tiLe) && tiLe > 0 && Number.isInteger(Math.floor(tiLe))) {
                dispatch({ type: 'SET_LOADING', payload: true })
                const data = { TiLe: tiLe }
                fetch(urlUpdatePerPointCustomert, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
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
            else addNotification('Số bạn nhập không hợp lệ', 'warning', 4000)
        } else
            addNotification('Bạn không nhập gì', 'warning', 4000)
    }

    // sử dụng dữ liệu mẫu
    const handleSubmitSuDungDuLieuMau = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        const data = { SuDungDuLieuMau: suDungDuLieuMau }
        fetch(urlUpdateUseSampleData, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
            body: JSON.stringify(data)
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
                if(!suDungDuLieuMau){
                    navigate(0);
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


    }

    // đổi ảnh thanh toán
    const handleSubmit2 = (isLogo) => {
        const formData = new FormData();
        if (isLogo)
            formData.append('HinhAnh', dataReq.HinhAnh2)
        else formData.append('HinhAnh', dataReq.HinhAnh)
        var url = urlUpdateLogo
        if (!isLogo)
            url = urlUpdatePicturePayment
        fetch(url, {
            method: 'PUT',
            headers: {
                'ss': getCookie('ss'),
            },
            body: formData
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
                window.location.reload();
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
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div>
            <div class="card" style={{ minHeight: '92vh', position: 'relative' }}>
                <div class="card-header pb-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <NotificationContainer notifications={notifications} />
                    <h2 style={{ width: '100%', textAlign: 'center', textDecoration: 'underline' }}>Thiết Lập Hệ Thống</h2>
                    <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ width: '80%', marginTop: '1rem' }}>
                        <div className={`${isMobile ? 'col-12' : 'col-6 '}`} style={{ display: 'flex', flexDirection: 'column' }}>
                            <h4 style={{ textAlign: 'center' }}>Đổi Ảnh QR Thanh Toán</h4>
                            <ImageUpload />
                            <div style={{ width: '100%' }}>
                                <button
                                    style={{ marginTop: '7rem', float: 'right' }}
                                    className="btn btn-primary"
                                    onClick={() => { handleSubmit2(false) }}>
                                    Xác Nhận Đổi Ảnh
                                </button>
                            </div>

                        </div>
                        {isMobile &&
                            <div>
                                <br></br>
                                <hr class="horizontal dark mt-1" />
                            </div>}
                        <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                            <h4 style={{ textAlign: 'center' }}>% Điểm Tích Luỹ Cho Khách</h4>
                            <label style={{ color: 'grey' }}>Dựa theo tổng tiền hoá đơn, Ví dụ: hoá đơn có tổng tiền là 100.000đ, % Điểm Tích Luỹ Cho Khách là 1 thì khách sẽ có 1000 điểm tích luỹ tương đương với 1000đ </label>
                            <input
                                type="number"
                                className="form-control"
                                value={tiLe}
                                onChange={(event) => {
                                    setTiLe(event.target.value)
                                }}
                            />
                            <button
                                style={{ float: 'right', marginTop: '8.5rem' }}
                                className="btn btn-primary"
                                onClick={() => { handleSubmitTiLe() }}>
                                Xác Nhận
                            </button>
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
                    <hr class="horizontal dark mt-1"></hr>
                    <div class="card-header pb-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div className={`${isMobile ? 'flex-column' : 'row'}`} style={{ width: '80%', marginTop: '1rem' }}>
                            <div className={`${isMobile ? 'col-12' : 'col-6 '}`} style={{ display: 'flex', flexDirection: 'column' }}>
                                <h4 style={{ textAlign: 'center' }}>Đổi Logo</h4>
                                <ImageUpload2 />
                                <div style={{ width: '100%' }}>
                                    <button
                                        style={{ marginTop: '7rem', float: 'right' }}
                                        className="btn btn-primary"
                                        onClick={() => { handleSubmit2(true) }}>
                                        Xác Nhận Đổi Logo
                                    </button>
                                </div>

                            </div>
                            {isMobile &&
                                <div>
                                    <br></br>
                                    <hr class="horizontal dark mt-1" />
                                </div>}
                            <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                <h4 style={{ textAlign: 'center', width: "100%" }}>Sử dụng dữ liệu mẫu</h4>
                                <label style={{ textAlign: 'center', width: "100%" }}>
                                    <input
                                        type="checkbox"
                                        checked={suDungDuLieuMau}
                                        onChange={() => {
                                            setSuDungDuLieuMau(!suDungDuLieuMau)
                                        }}
                                    />

                                    ㅤSử dụng dữ liệu mẫu
                                </label>
                            <label style={{ color: 'grey',opacity:'0.5', textAlign:'center', width: "100%" }}>Quá trình này có thể mất tới 1 phút</label>
                                <button
                                    style={{ float: 'right', marginTop: '11rem' }}
                                    className="btn btn-primary"
                                    onClick={() => {
                                        if (suDungDuLieuMau === false)
                                            openPopupAlert(
                                                `Nếu bạn không sử dụng dữ liệu mẫu nữa, dữ liệu cũ trước đó sẽ bị khởi tạo lại (kể cả tài khoản này). 
                                                Tài khoản mặc định sẽ được thiết lập lại với Email là EMAIL gốc khi đăng ký và MẬT KHẨU là 1234. 
                                                Bạn có xác nhận về hành động này ?`,
                                                () => { handleSubmitSuDungDuLieuMau() }
                                            )
                                        else handleSubmitSuDungDuLieuMau()
                                    }}>
                                    Xác Nhận
                                </button>
                            </div>
                        </div>
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

export default TabHeThong