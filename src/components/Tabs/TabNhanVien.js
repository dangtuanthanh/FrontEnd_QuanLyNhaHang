import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faAdd, faRotateLeft, faDownload, faUpload, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'

import { getCookie } from "../Cookie";
import { urlGetAccount, urlDeleteAccount, urlUndoDeleteAccount } from "../url";
import Pagination from "../Pagination";
import TableNhanVien from "../Table/TableNhanVien";
import Insert_updateAccount from "../Popup/insert_updateAccount";
import ItemsPerPage from "../ItemsPerPage";
import ExportAccount from "../Popup/ExportAccount";
import ImportAccount from "../Popup/ImportAccount";
//import SelectedEditAccount from "../components/Popup/SelectedEditAccount";
function TabNhanVien() {
    //xử lý redux
    const dispatch = useDispatch()
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

    //popup xuất file
    const [popupXuat, setpopupXuat] = useState(false);//trạng thái xuất dữ liệu
    const closePopupXuat = () => {
        setpopupXuat(false);
    };

    //popup nhập file
    const [popupNhap, setPopupNhap] = useState(false);//trạng thái xuất dữ liệu
    const closePopupNhap = () => {
        setPopupNhap(false);
    };

      //undo delete
    const [buttonUndo, setButtonUndo] = useState(false);//trạng thái hiển thị nút undo
      const [undoDelete, setUndoDelete] = useState([]);//mảng lưu id bị xoá
    const handleUndo = () => {
        dispatch({type: 'SET_LOADING', payload: true})
        fetch(`${urlUndoDeleteAccount}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
            body: JSON.stringify({ undoDelete })
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 400) {
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
                dispatch({type: 'SET_LOADING', payload: false})
                setButtonUndo(false)
                setUndoDelete([])
                TaiDuLieu()
            })
            .catch(error => {
                dispatch({type: 'SET_LOADING', payload: false})
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
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
        dispatch({type: 'SET_LOADING', payload: true})
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
                if (data.currentPage > data.totalPages && data.totalPages !== null) {
                    setdataUser({
                        ...dataUser,
                        page: data.totalPages
                    });
                }
                //ẩn loading
                dispatch({type: 'SET_LOADING', payload: false})
            })
            .catch(error => {
                dispatch({type: 'SET_LOADING', payload: false})
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
    };
    //Xoá dữ liệu
    const deleteData = (ID) => {
        dispatch({type: 'SET_LOADING', payload: true})
        let IDs = [ID]
        if (Array.isArray(ID)) {
            console.log('là mảng');
            IDs = ID.map(item => Number(item));
            console.log('mảng số đã được chuyển', IDs);
        } else IDs = [ID];
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
                dispatch({type: 'SET_LOADING', payload: false})
                setButtonUndo(true)
                setSelectedIds([])
                setUndoDelete(IDs)
                TaiDuLieu()

            })
            .catch(error => {
                dispatch({type: 'SET_LOADING', payload: false})
                if (error instanceof TypeError) {
                    openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    addNotification(error.message, 'warning', 5000)
                }

            });
    }
   
    // sửa hàng loạt
    const [selectedIds, setSelectedIds] = useState([]);//mảng chọn


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
        <div>
            <div class="card mb-4">
                <div class="card-header pb-0">
                    <h2> Quản Lý Nhân Viên</h2>
                    <NotificationContainer notifications={notifications} />
                    {/* Thanh Chức Năng : Làm mới, thêm, sửa, xoá v..v */}

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
                                            setPopupNhap(true)
                                        }}
                                        className="btn btn-primary">
                                        <FontAwesomeIcon icon={faUpload} />
                                        ㅤNhập
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

                                    {buttonUndo && <button
                                        style={{ 'display': "inline-block" }}
                                        onClick={() => {
                                            handleUndo()
                                        }}
                                        className="btn btn-primary">
                                        <FontAwesomeIcon icon={faRotateLeft} />
                                        ㅤHoàn Tác
                                    </button>}
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
                                    {/* <button
                                                    style={{ display: "inline-block" }}
                                                    //onClick={() => {togglePopup6();}}
                                                    className="btn btn-primary">
                                                    <FontAwesomeIcon icon={faPencil} />
                                                    ㅤSửa ô đã chọn
                                                </button>ㅤ */}
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

                                    <button
                                        style={{ display: "inline-block" }}
                                        onClick={() => { setpopupXuat(true) }}
                                        className="btn btn-primary">
                                        <FontAwesomeIcon icon={faDownload} />
                                        ㅤXuất ô đã chọn
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
                                <option value="IDNhanVien">Tìm theo IDNhanVien</option>
                                <option value="TenNhanVien">Tìm theo TenNhanVien</option>
                                <option value="TaiKhoan">Tìm theo TaiKhoan</option>
                                <option value="TenViTriCongViec">Tìm theo ViTriCongViec</option>
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
                            selectedIds={selectedIds}
                            setSelectedIds={setSelectedIds}
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
            {
                popup1 && <div className="popup">
                    <Insert_updateAccount
                        isInsert={isInsert}
                        setPopup1={setPopup1}
                        tieuDe='Thông Tin Nhân Viên'
                        dataUser={dataUser}
                        setdataUser={setdataUser}
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                        iDAction={iDAction}
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
            {
                popupXuat && <ExportAccount
                    duLieuHienThi={duLieuHienThi}
                    totalItems={dataRes.totalItems}
                    openPopupAlert={openPopupAlert}
                    addNotification={addNotification}
                    onClose={closePopupXuat}
                    selectedIds={selectedIds}
                />
            }

            {
                popupNhap && <ImportAccount
                    openPopupAlert={openPopupAlert}
                    addNotification={addNotification}
                    onClose={closePopupNhap}
                    dataUser={dataUser}
                    setdataUser={setdataUser}
                />
            }
           
        </div>
    )

}

export default TabNhanVien