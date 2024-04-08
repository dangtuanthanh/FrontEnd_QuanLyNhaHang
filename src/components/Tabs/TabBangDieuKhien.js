import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link, useLocation } from "react-router-dom"
import { getCookie } from "../Cookie";
import { urlGetOccupiedTables, urlGetInvoiceToday, urlGetRevenueToday, urlGetRevenueMonth, urlGetListRevenueMonth } from "../url";
function TabBangDieuKhien() {
    //xử lý redux
    const dispatch = useDispatch();
    const [banCoKhach, setBanCoKhach] = useState('...');
    const [hoaDonTrongNgay, setHoaDonTrongNgay] = useState('...');
    const [doanhThuHomNay, setDoanhThuHomNay] = useState('...');
    const [doanhThuThang, setDoanhThuThang] = useState('...');
    const [label, setLabel] = useState([]);
    const [dataSetNow, setDataSetNow] = useState([]);
    const [dataSetBefore, setDataSetBefore] = useState([]);
    const dataDoThi = {
        labels: label,
        datasets: [
            {
                label: 'Tháng này',
                data: dataSetNow,
                borderColor: 'rgb(75, 192, 192)'
            },
            {
                label: 'Tháng trước',
                data: dataSetBefore,
                borderColor: 'rgb(255, 99, 132)'
            }
        ]
    }
    const optionsDoThi = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        max: 70,
                        min: 0,
                        stepSize: 10
                    }
                }
            ]
        },
        elements: {
            point: {
                radius: 3
            }
        },
        animation: {
            tension: 0.4
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        cubicInterpolationMode: 'monotone'
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
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        //lấy 1 sản phẩm
        const fetch1 = fetch(`${urlGetOccupiedTables}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch2 = fetch(`${urlGetInvoiceToday}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch3 = fetch(`${urlGetRevenueToday}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch4 = fetch(`${urlGetRevenueMonth}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetch5 = fetch(`${urlGetListRevenueMonth}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })

        Promise.all([fetch1, fetch2, fetch3, fetch4, fetch5])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 400 || response.status === 401 || response.status === 500) {
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
                setBanCoKhach(data[0]) //số bàn có khách
                setHoaDonTrongNgay(data[1])
                setDoanhThuHomNay(data[2])
                setDoanhThuThang(data[3])
                data[4].current.forEach(item => {
                    setLabel(prev => [...prev, item.Day]);
                    setDataSetNow(prev => [...prev, item.Revenue]);
                });
                data[4].previous.forEach(item => {
                    setDataSetBefore(prev => [...prev, item.Revenue]);
                });
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
    return (
        <div>
            <div class="card mb-4" >
                <div class="card-header pb-0" >
                    <h2>Bảng Điều Khiển</h2>
                    <NotificationContainer notifications={notifications} />
                    {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}

                    <div>

                    </div>
                </div>
                <div class="card-body px-0 pt-0 pb-2 mt-2" >
                    <div className="" style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <div className="row">
                            <div className="col-3" >
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: '#feefff' }}>
                                    <Link class="row" to={`/BanVaKhuVuc`} >
                                        
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Bàn đang có khách</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {banCoKhach}
                                                </h5>

                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="ni ni-check-bold text-lg opacity-10" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </Link>
                                </div>


                            </div>
                            <div className="col-3">
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: '#feefff' }}>
                                    <Link class="row" to={`/HoaDon`}>
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Hoá Đơn Hôm Nay</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {hoaDonTrongNgay}
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="ni ni-single-copy-04 text-lg opacity-10" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-3">
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: '#feefff' }}>
                                    <Link class="row" to={`/HoaDon`}>
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Doanh Thu Hôm Nay</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(doanhThuHomNay)}
                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="ni ni-money-coins text-lg opacity-10" aria-hidden="true"></i>

                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="col-3">
                                <div class="card-body p-3" style={{ borderRadius: '15px', backgroundColor: '#feefff' }}>
                                    <Link class="row" to={`/HoaDon`}>
                                        <div class="col-8">
                                            <div class="numbers">
                                                <p class="text-sm mb-0 text-capitalize font-weight-bold" >Doanh Thu Tháng Này</p>
                                                <h5 class="font-weight-bolder mb-0">
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(doanhThuThang)}

                                                </h5>
                                            </div>
                                        </div>
                                        <div class="col-4 text-end">
                                            <div class="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                                                <i class="ni ni-calendar-grid-58 text-lg opacity-10" aria-hidden="true"></i>

                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', borderRadius: '15px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px' }}>
                            <h4 style={{ width: '100%', textAlign: 'center', textDecoration: 'underline' }}> Doanh Thu Tháng
                            </h4>
                            <div style={{ width: '80%', display: 'flex', justifyContent: 'center', margin: '0 2% 0 2%' }}>
                                <Line
                                    data={dataDoThi}
                                    options={optionsDoThi}

                                >
                                </Line>
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

export default TabBangDieuKhien