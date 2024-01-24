import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faFilter, faArrowLeft, faArrowUp, faArrowDown, faAdd } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

import { getCookie } from "../Cookie";
import { urlGetReceipt, urlDeleteReceipt } from "../url";
import Pagination from "../Pagination";
import ItemsPerPage from "../ItemsPerPage";
import TablePhieuNhap from "../Table/TablePhieuNhap";
import Insert_updatePhieuNhap from "../Popup/Insert_updatePhieuNhap";
function TabPhieuNhap(props) {
    //xử lý redux
    const dispatch = useDispatch();
    //Xử lý phân biệt nhập nguyên liệu và sản phẩm
    const [nhapNguyenLieu, setNhapNguyenLieu] = useState(true);
    //Xử lý hiển thị các nút chức năng
    const [showButtonFunction, setShowButtonFunction] = useState(true);
    const handleToggleButtonFunction = () => {
        setShowButtonFunction(!showButtonFunction);
    };
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'NgayNhap',
        sortOrder: 'desc',
        searchBy: 'NgayNhap',
        search: '',
        searchExact: 'false'
    });//
    const [dataRes, setDataRes] = useState({});//dữ liệu nhận được khi getRole

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

    //popup thêm,sửa nhân viên
    const [popupInsertUpdate, setPopupInsertUpdate] = useState(false);//trạng thái popupInsertUpdate
    const [isInsert, setIsInsert] = useState(true);//trạng thái thêm
    const [iDAction, setIDAction] = useState();//giá trị của id khi thực hiện sửa xoá


    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'NgayNhap',
            sortOrder: 'desc',
            page: 1,
            search: event.target.value
        });

    };

    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'NgayNhap',
            sortOrder: 'desc',
            page: 1,
            searchBy: event.target.value
        });

    };
    //hàm chế độ tìm kiếm
    const handleSearchExact = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'NgayNhap',
            sortOrder: 'desc',
            page: 1,
            searchExact: event.target.value
        });

    };
    //hàm lọc Hôm nay
    const filterHomNay = () => {
        setdataUser({
            ...dataUser,
            sortBy: 'NgayNhap',
            sortOrder: 'desc',
            page: 1,
            search: dataRes.DateCurrent,
            searchBy: 'NgayNhap'
        });
    };
    //hàm lọc chưa chốt
    const filterNhapNguyenLieu = () => {
        setdataUser({
            ...dataUser,
            sortBy: 'NgayNhap',
            sortOrder: 'desc',
            page: 1,
            search: true,
            searchBy: 'NhapNguyenLieu'
        });
    };
    //hàm lọc chưa chốt
    const filterNhapSanPham = () => {
        setdataUser({
            ...dataUser,
            sortBy: 'NgayNhap',
            sortOrder: 'desc',
            page: 1,
            search: false,
            searchBy: 'NhapNguyenLieu'
        });
    };

    //Xoá dữ liệu
    const deleteData = (ID) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        let IDs = [ID]
        if (Array.isArray(ID)) {
            console.log('là mảng');
            IDs = ID.map(item => Number(item));
            console.log('mảng số đã được chuyển', IDs);
        } else IDs = [ID];
        fetch(`${urlDeleteReceipt}`, {
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
                dispatch({ type: 'SET_LOADING', payload: false })
                setSelectedIds([])
                TaiDuLieu()

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
    // sửa hàng loạt
    const [selectedIds, setSelectedIds] = useState([]);//mảng chọn

    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetReceipt}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
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
                    totalPages: data.totalPages,
                    DateCurrent: data.DateCurrent
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

                    <h2> Quản Lý Phiếu Nhập {!showButtonFunction && <button type="button" onClick={handleToggleButtonFunction} className="btn btn-link btn-sm mb-0" style={{ width: '100px', float: 'right' }}><FontAwesomeIcon icon={faArrowDown} /></button>}</h2>

                    <NotificationContainer notifications={notifications} />
                    {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}
                    {showButtonFunction &&
                        <div>
                            {
                                selectedIds.length == 0
                                    ? <div style={{ 'display': "inline-block", float: 'left' }}>
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
                                                setNhapNguyenLieu(true)
                                                setIsInsert(true)
                                                setPopupInsertUpdate(true)
                                                setIDAction()
                                            }}

                                            className="btn btn-primary">
                                            <FontAwesomeIcon icon={faAdd} />
                                            ㅤNhập NL Mới
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={() => {
                                                setNhapNguyenLieu(false)
                                                setIsInsert(true)
                                                setPopupInsertUpdate(true)
                                                setIDAction()
                                            }}

                                            className="btn btn-primary">
                                            <FontAwesomeIcon icon={faAdd} />
                                            ㅤNhập SP mới
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={filterHomNay}
                                            className="btn btn-light">
                                            <FontAwesomeIcon icon={faFilter} />
                                            ㅤHôm Nay
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={filterNhapNguyenLieu}
                                            className="btn btn-light">
                                            <FontAwesomeIcon icon={faFilter} />
                                            ㅤNhập Nguyên Liệu
                                        </button>ㅤ
                                        <button
                                            style={{ 'display': "inline-block" }}
                                            onClick={filterNhapSanPham}
                                            className="btn btn-light">
                                            <FontAwesomeIcon icon={faFilter} />
                                            ㅤNhập Sản Phẩm
                                        </button>ㅤ
                                        {/* <button
                                        style={{ 'display': "inline-block" }}
                                        onClick={() => {
                                            setIsInsert(true)
                                            setPopupInsertUpdate(true)
                                            setIDAction()
                                        }}

                                        className="btn btn-primary">
                                        <FontAwesomeIcon icon={faAdd} />
                                        ㅤThêm
                                    </button>ㅤ */}
                                    </div>
                                    : <div style={{ 'display': "inline-block", float: 'left' }}>
                                        <button
                                            style={{ display: "inline-block" }}
                                            //onClick={setSelectedIds([])}
                                            onClick={() => { setSelectedIds([]); }}
                                            className="btn btn-danger">
                                            <FontAwesomeIcon icon={faArrowLeft} />
                                            ㅤQuay Lại
                                        </button>ㅤ
                                        <button
                                            style={{ display: "inline-block" }}
                                            onClick={() => {
                                                openPopupAlert(
                                                    `Bạn có chắc chắn muốn xoá các lựa chọn này:  ${Object.values(selectedIds).join(' | ')}`,
                                                    () => { deleteData(selectedIds) }
                                                )
                                            }}
                                            className="btn btn-primary">
                                            <FontAwesomeIcon icon={faTrash} />
                                            ㅤXoá ô đã chọn
                                        </button>ㅤ
                                    </div>
                            }

                            <div style={{ 'display': "inline-block", float: 'right' }}>
                                {/* số hàng trên trang */}
                                <ItemsPerPage
                                    dataRes={dataRes}
                                    openPopupAlert={openPopupAlert}
                                    dataUser={dataUser}
                                    setdataUser={setdataUser}
                                />
                                ㅤ
                                <input id="search" value={dataUser.search} onChange={handleSearch} placeholder='Tìm Kiếm' type="text" className="form-control-sm " />
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
                                    <option value="IDPhieuNhap">Tìm theo ID Phiếu Nhập</option>
                                    <option value="IDNhanVien">Tìm theo ID Nhân Viên</option>
                                    <option value="TenNhanVien">Tìm theo Tên nhân viên</option>
                                    <option value="NgayNhap">Tìm theo Ngày Nhập</option>
                                    {/* <option value="XacNhanGiaoCa">Tìm theo Trạng Thái (true hoặc false)</option> */}
                                </select>
                                ㅤ
                                <select class="form-select-sm" value={dataUser.searchExact} onChange={handleSearchExact}>
                                    <option value='false'>Chế độ tìm: Gần đúng</option>
                                    <option value="true">Chế độ tìm: Chính xác</option>
                                </select>
                                {showButtonFunction && <button type="button" onClick={handleToggleButtonFunction} className="btn btn-link btn-sm mb-0"><FontAwesomeIcon icon={faArrowUp} /></button>}
                            </div>
                        </div>}

                </div>

                <div class="card-body px-0 pt-0 pb-2">
                    <div class="table-responsive p-0">
                        <TablePhieuNhap
                            duLieuHienThi={duLieuHienThi}
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            addNotification={addNotification}
                            setIsInsert={setIsInsert}
                            setIDAction={setIDAction}
                            setPopupInsertUpdate={setPopupInsertUpdate}
                            openPopupAlert={openPopupAlert}
                            deleteData={deleteData}
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
                            setNhapNguyenLieu={setNhapNguyenLieu}
                        />
                        {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                        <label style={{ borderTop: '1px solid black', marginLeft: '60%', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortBy === "NgayNhap" ?
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
            {/* phân trang */}
            <Pagination
                setdataUser={setdataUser}
                dataUser={dataUser}
                dataRes={dataRes}
            />
            {
                popupInsertUpdate && <div className="popup">
                    <Insert_updatePhieuNhap
                        isInsert={isInsert}
                        setPopupInsertUpdate={setPopupInsertUpdate}
                        dataUser={dataUser}
                        setdataUser={setdataUser}
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        iDAction={iDAction}
                        thongTinDangNhap={props.thongTinDangNhap}
                        DateCurrent={dataRes.DateCurrent}
                        nhapNguyenLieu={nhapNguyenLieu}
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
        </div>
    )

}

export default TabPhieuNhap