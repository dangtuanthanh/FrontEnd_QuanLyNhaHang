import React, { useState, useEffect } from "react";
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import NavTop from "../components/NavTop";
import { getCookie } from "../components/Cookie";
import '../App.css';
import logo from '../assets/img/logos/logo-removebg-preview.png';

function NhanVien() {
    //Xử lý menu
    const [showNavigation, setShowNavigation] = useState(true);
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";
    const [menu, setMenu] = useState([]);
    const xuLyLayMenuTuCheckLogin = (data) => {
        setMenu(data);
    };
    //Hết xử lý menu

    //xử lý trang dữ liệu
    const [dulieu, setDulieu] = useState([]);//lưu trạng thái dữ liệu
    const [page, setPage] = useState();//lưu trang để lấy dữ liệu
    const [limit, setLimit] = useState();//lưu số hàng trên mỗi trang 
    const [loading, setLoading] = useState(false);//trạng thái loading
    useEffect(() => {
        TaiDuLieu()
    }, [page, limit]);
    //hàm tải dữ liệu
    const TaiDuLieu = () => {
        setLoading(true)
        fetch(`https://vres.onrender.com/getAccount?page=${page}&limit=${limit}`, {
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
                setDulieu(data.data)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                if (error instanceof TypeError) {
                    alert('Không thể kết nối tới máy chủ');
                    // setTitleError("Không thể kết nối tới máy chủ")
                    // setError(true);
                } else {
                    alert(error.message);
                    // setTitleError(error.message)
                    // setError(true);
                }

            });
    };

    return (
        <CheckLogin menu={xuLyLayMenuTuCheckLogin} >
            <div className="row">
                <div className={navigationColumnClass}>
                    {showNavigation && <Navigation menu={menu} />}
                </div>
                <div className={contentColumnClass}>
                    <div className='container'>
                        <NavTop NamePage='Nhân Viên' />
                        <div class="card mb-4">
                            <div class="card-header pb-0">
                                <h2> Quản Lý Nhân Viên</h2>
                                {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}
                            </div>
                            <div class="card-body px-0 pt-0 pb-2">
                                <div class="table-responsive p-0">
                                {loading && <div className="loading">
                                {/* <img src={logo} style={{width: '50%'}} /> */}
                                <h4>Đang tải...</h4>
                                </div>}
                                <p>Data: {JSON.stringify(dulieu)}</p>
                                <button onClick={() => setPage(2)}>load</button>
                                </div>
                            </div>
                        </div>
                        <h4 onClick={handleToggleNavigation}>
                            {showNavigation ? "<<" : ">>"}
                        </h4>
                    </div>
                </div>
            </div>
        </CheckLogin>
    );
}

export default NhanVien