import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faRotate, faAdd, faCheck, faXmark, faRotateLeft, faDownload, faUpload, faFileExcel, faFilePdf, faArrowLeft, faBars, faArrowUp } from '@fortawesome/free-solid-svg-icons'

import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import NavTop from "../components/NavTop";
import { getCookie } from "../components/Cookie";
import '../App.css';
import loadingGif from '../assets/img/loading/loading1.gif'
import { urlGetAccount,urlDeleteAccount } from "../components/url";
import Pagination from "../components/Pagination";
import TableNhanVien from "../components/Table/TableNhanVien";
import Insert_updateAccount from "../components/Popup/insert_updateAccount";
import ItemsPerPage from "../components/ItemsPerPage";
import Export from "../components/Export";


function NhanVien() {
    //Xử lý menu
    const [showNavigation, setShowNavigation] = useState(false);
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";

    const [menu, setMenu] = useState([]);
    const xuLyLayMenuTuCheckLogin = (data) => {
        setMenu(data);
    };

    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'IDNhanVien',
        sortOrder: 'asc',
        searchBy: 'IDNhanVien',
        search: '',
        searchExact: 'false'
    });//
    const [dataRes, setDataRes] = useState({});//dữ liệu nhận được khi getAccount
    const [loading, setLoading] = useState(false);//trạng thái loading




    //xử lý popup
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


    //popup thêm,sửa nhân viên
    const [popup1, setPopup1] = useState(false);//trạng thái popup1
    const [isInsert, setIsInsert] = useState(true);//trạng thái thêm
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá
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

    //popup thêm,sửa nhân viên
    const [popupXuat, setpopupXuat] = useState(false);//trạng thái xuất dữ liệu
    const closePopupXuat = () => {
        setpopupXuat(false);
    };


    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDNhanVien',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value
        });

    };

    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDNhanVien',
            sortOrder: 'asc',
            page: 1,
            searchBy: event.target.value
        });

    };
    //hàm chế độ tìm kiếm
    const handleSearchExact = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDNhanVien',
            sortOrder: 'asc',
            page: 1,
            searchExact: event.target.value
        });

    };



    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        setLoading(true)
        fetch(`${urlGetAccount}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
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
                //ẩn loading
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
    };



    //Xoá dữ liệu
    const deleteData = (ID) => {
        setLoading(true)
        const IDs = [ID];
        console.log('IDs', IDs);
        console.log('json body', JSON.stringify({ IDs }));
        fetch(`${urlDeleteAccount}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
            body: JSON.stringify({ IDs })
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
                addNotification(data.message, 'success', 4000)
                //ẩn loading
                setLoading(false)
                TaiDuLieu()

            })
            .catch(error => {
                setLoading(false)
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
    }




    //Xử lý sắp xếp

    //sắp xếp cột có ngày tháng
    // function formatDate(dateString) {
    //     const parts = dateString.split('-');
    //     return `${parts[2]}-${parts[1]}-${parts[0]}`;
    // }
    // const [sortDirection2, setSortDirection2] = useState('asc'); // giá trị ban đầu là sắp xếp tăng dần
    // //const sortArrow2 = sortDirection2 === 'asc' ? '▼' : '▲'; //hướng sắp xếp của ký tự mũi tên
    // function handleSortedDate(columnName) {
    //     const sorted = [...duLieuHienThi].sort((a, b) => {
    //         const dateA = formatDate(a[columnName]);
    //         const dateB = formatDate(b[columnName]);
    //         if (dateA < dateB) {
    //             return sortDirection2 === 'asc' ? -1 : 1; // đổi hướng sắp xếp nếu cần
    //         }
    //         if (dateA > dateB) {
    //             return sortDirection2 === 'asc' ? 1 : -1;
    //         }
    //         return 0;
    //     });

    //     setDuLieuHienThi(sorted);
    //     if (sortDirection2 === 'asc') {
    //         // $(".ThanhCong").text("Sắp xếp cũ nhất ➨ mới nhất theo  " + columnName);
    //         // $(".ThanhCong").delay(200).show("medium");
    //         // setTimeout(() => $(".ThanhCong").delay(200).hide("medium"), 3000);

    //         setSapXep(columnName + ", cũ nhất ➨ mới nhất")
    //         alert(`Sắp xếp cũ nhất ➨ mới nhất theo:   ${columnName}`)
    //     } else {
    //         // $(".ThanhCong").text("Sắp xếp mới nhất ➨ cũ nhất theo " + columnName);
    //         // $(".ThanhCong").delay(200).show("medium");
    //         // setTimeout(() => $(".ThanhCong").delay(200).hide("medium"), 3000);

    //         setSapXep(columnName + ", mới nhất ➨ cũ nhất")
    //         alert(`Sắp xếp mới nhất ➨ cũ nhất theo:   ${columnName}`)
    //     }
    //     setSortDirection2(sortDirection2 === 'asc' ? 'desc' : 'asc'); // đổi hướng sắp xếp sau mỗi lần nhấp
    // }
    //Hết xử lý sắp xếp

    return (
        <CheckLogin menu={xuLyLayMenuTuCheckLogin} >
            {loading && <div className="loading">
                <img src={loadingGif} style={{ width: '30%' }} />
                {/* <h4>Đang Tải...</h4> */}
            </div>}
            <div className="row">
                <div className={navigationColumnClass}>
                    {showNavigation && <Navigation menu={menu} />}
                </div>
                <div className={contentColumnClass}>
                    <div
                        style={{ marginLeft: '2%', marginRight: '1%' }}
                    >
                        {showNavigation ? <NavTop NamePage='Nhân Viên' setLoading={setLoading} /> : ""}

                        <div class="card mb-4">
                            <div class="card-header pb-0">
                                <h2> Quản Lý Nhân Viên</h2>
                                <NotificationContainer notifications={notifications} />
                                {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}

                                <div>
                                    <div style={{ 'display': "inline-block", float: 'left' }}>
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={() => { TaiDuLieu(); }}
                                            className="btn btn-primary">
                                            <FontAwesomeIcon icon={faRotate} />
                                            ㅤLàm Mới
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={() => {
                                                setIsInsert(true)
                                                setPopup1(true)
                                                setIDAction()
                                            }}

                                            className="btn btn-primary">
                                            <FontAwesomeIcon icon={faAdd} />
                                            ㅤThêm
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={() => {
                                                setpopupXuat(true)
                                            }}
                                            className="btn btn-primary">
                                            <FontAwesomeIcon icon={faDownload} />
                                            ㅤXuất
                                        </button>ㅤ
                                    </div>
                                    <div style={{ 'display': "inline-block", float: 'right' }}>
                                        {/* số hàng trên trang */}
                                        <ItemsPerPage
                                            dataRes={dataRes}
                                            openPopupAlert={openPopupAlert}
                                            dataUser={dataUser}
                                            setdataUser={setdataUser}
                                        />
                                        ㅤ
                                        <input id="search" value={dataUser.search} onChange={handleSearch} placeholder='Tìm Kiếm' type="text" className="form-control-sm" />
                                        ㅤ
                                        <select class="form-select-sm" value={dataUser.searchBy} onChange={handleSearchBy}>
                                            <option value="IDNhanVien">Tìm theo IDNhanVien</option>
                                            <option value="TenNhanVien">Tìm theo TenNhanVien</option>
                                            <option value="TaiKhoan">Tìm theo TaiKhoan</option>
                                            <option value="TenVaiTro">Tìm theo VaiTro</option>
                                        </select>
                                        ㅤ
                                        <select class="form-select-sm" value={dataUser.searchExact} onChange={handleSearchExact}>
                                            <option value='false'>Chế độ tìm: Gần đúng</option>
                                            <option value="true">Chế độ tìm: Chính xác</option>
                                        </select>

                                    </div>
                                </div>


                            </div>
                            <div class="card-body px-0 pt-0 pb-2">
                                <div class="table-responsive p-0">
                                    <TableNhanVien
                                        duLieuHienThi={duLieuHienThi}
                                        setdataUser={setdataUser}
                                        dataUser={dataUser}
                                        addNotification={addNotification}
                                        setIsInsert={setIsInsert}
                                        setIDAction={setIDAction}
                                        setPopup1={setPopup1}
                                        openPopupAlert={openPopupAlert}
                                        deleteData={deleteData}
                                    />
                                    {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                                    <label style={{ borderTop: '1px solid black', marginLeft: '60%', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortOrder === 'asc' ? <label style={{ color: 'darkgray' }}>tăng dần</label> : <label style={{ color: 'darkgray' }}>giảm dần</label>} theo cột {dataRes.sortBy}  </label>
                                </div>
                            </div>
                        </div>
                        {/* phân trang */}
                        <Pagination
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            dataRes={dataRes}
                        />
                        {popup1 && <div className="popup">
                            <Insert_updateAccount
                                isInsert={isInsert}
                                setPopup1={setPopup1}
                                tieuDe='Thông Tin Nhân Viên'
                                setLoading={setLoading}
                                dataUser={dataUser}
                                setdataUser={setdataUser}
                                addNotification={addNotification}
                                openPopupAlert={openPopupAlert}
                                iDAction={iDAction}
                            />
                        </div>}
                        {popupAlert && <PopupAlert
                            message={popupMessageAlert}
                            onClose={closePopupAlert}
                            onAction={onAction}
                        />}
                        {popupXuat && <Export
                           duLieuHienThi={duLieuHienThi}
                           totalItems={dataRes.totalItems}
                           setLoading={setLoading}
                           openPopupAlert={openPopupAlert}
                           addNotification={addNotification}
                           onClose={closePopupXuat}
                        />}
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