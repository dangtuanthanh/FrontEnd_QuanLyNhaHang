import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { Link, useLocation } from "react-router-dom"
import { getCookie } from "../Cookie";
import { urlGetOccupiedTables, urlGetInvoiceToday, urlGetRevenueToday, urlGetRevenueMonth, urlGetListRevenueMonth } from "../url";
function TabHoSo(props) {
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
    const lines = JSON.stringify(props.thongTinDangNhap.NhanVien)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    function formatDate(dateString) {
        // 1. Chuyển ISO string sang Date
        let date = new Date(dateString);

        // 2. Lấy thông tin ngày, tháng, năm 
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();

        // 3. Thêm số 0 nếu ngày, tháng có 1 chữ số
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        // 4. Trả về theo định dạng dd/mm/yyyy
        return `${day}/${month}/${year}`;
    }
    return (
        <div>
            <div class="card mb-4" >
                <div class="card-header pb-0" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <NotificationContainer notifications={notifications} />
                    <h2 style={{ width: '100%', textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Hồ Sơ</h2>
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
                            <div className="form-group">
                                <label >ID Nhân Viên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.IDNhanVien}
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
                                <label>Tên Nhân Viên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.TenNhanVien}
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
                                <label>Vị Trí Công Việc</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.TenViTriCongViec}
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
                                <label>Số Điện Thoại</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.SoDienThoai}
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
                            <div className="form-group">
                                <label>Ngày Sinh</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formatDate(props.thongTinDangNhap.NhanVien.NgaySinh)}
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
                                <label>Giới Tính</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.GioiTinh}
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
                                <label>Địa Chỉ</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={props.thongTinDangNhap.NhanVien.DiaChi}
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
                                <label>Ngày Vào</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formatDate(props.thongTinDangNhap.NhanVien.NgayVao)}
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
        </div>
    )

}

export default TabHoSo