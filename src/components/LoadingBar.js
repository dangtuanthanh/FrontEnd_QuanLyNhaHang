import React from 'react';
import '../App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LoadingBar = ({ isLoading, progress }) => {
    return (
        <div className={`loading-overlay2 ${isLoading ? 'visible' : ''}`}>
            <div className="loading-container2">
                <p data-aos="fade-in">Hãy chờ một chút trong khi chúng tôi xác thực và thêm dữ liệu mẫu cho bạn</p>
                <div className="loading-bar2">
                    <div className="progress-bar2" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="labels2">
                <span style={{ display: progress === 10 ? 'block' : 'none', color: 'white' }}>
                        Xác thực tài khoản
                    </span>
                    <span style={{ display: progress === 20 ? 'block' : 'none', color: 'white' }}>
                        Thêm dữ liệu mẫu Nhân Viên
                    </span>
                    <span style={{ display: progress === 40 ? 'block' : 'none', color: 'white' }}>
                        Thêm dữ liệu mẫu Kho
                    </span>
                    <span style={{ display: progress === 60 ? 'block' : 'none', color: 'white' }}>
                        Thêm dữ liệu mẫu Khách Hàng
                    </span>
                    <span style={{ display: progress === 80 ? 'block' : 'none', color: 'white' }}>
                        Thêm dữ liệu mẫu Hoá Đơn
                    </span>
                    <span style={{ display: progress === 100 ? 'block' : 'none', color: 'white' }}>
                        Tất cả đã hoàn thành
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoadingBar;
