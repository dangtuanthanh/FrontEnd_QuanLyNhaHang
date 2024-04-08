import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faIdCard, faBell, faClone, faFile, faPencil, faTable } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faMinusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import { urlInsertInvoice, urlGetInvoice, urlUpdateInvoice, urlGetProduct, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { urlGetTable } from "../url"
import { getCookie } from "../Cookie";
import Pagination from "../Pagination";
function TabTachDon(props) {
    //xử lý redux
    const dispatch = useDispatch()
    //danh sách mới
    const [dataReqMoi, setDataReqMoi] = useState({
        ...props.dataReq,
        DanhSach: props.dataReq.DanhSach.map(item => ({
            ...item,
            SoLuong: 0
        })),
        IDNhanVien: props.IDNhanVien
    });

    //danh sách cũ
    const [dataReqCu, setDataReqCu] = useState({
        ...props.dataReq
    })
    const [selectedRow0, setSelectedRow0] = useState(null);
    useEffect(() => {
        console.log('danh sách mới trong tab tách đơn', dataReqMoi)
    }, [dataReqMoi]);

    useEffect(() => {
        console.log('danh sách cũ trong tab tách đơn', dataReqCu)
    }, [dataReqCu]);
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            setdataUser({ ...dataUser, sortBy: value, sortOrder: 'asc' })
            setIsAsc(false)
            props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            setdataUser({ ...dataUser, sortBy: value, sortOrder: 'desc' })
            setIsAsc(true)
            props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }

    };
    //popup thêm,sửa nhân viên
    const [popupInsertUpdate, setPopupInsertUpdate] = useState(false);//trạng thái popupInsertUpdate
    const [isInsert, setIsInsert] = useState(true);//trạng thái thêm
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'TenBan',
        sortOrder: 'asc',
        searchBy: 'TenBan',
        search: '',
        searchExact: 'false'
    });//
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [dataRes, setDataRes] = useState({});
    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetTable}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
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
                    props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    props.addNotification(error.message, 'warning', 5000)
                }

            });
    };
    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'TenBan',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value
        });

    };
    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'TenBan',
            sortOrder: 'asc',
            page: 1,
            searchBy: event.target.value
        });

    };
    /*xử lý phần chi tiết*/
    function handleDetailChange(ID, giaTriTang, DanhSachMoi) {
        if (DanhSachMoi) {
            const item = dataReqMoi.DanhSach.find(i => i.IDSanPham === ID);
            if (item) {
                if (giaTriTang) {
                    item.SoLuong++;
                } else {
                    item.SoLuong--;
                }
                setDataReqMoi({
                    ...dataReqMoi,
                    DanhSach: [...dataReqMoi.DanhSach]
                });
            }
        }
        //Danh sách cũ
        else {
            const item = dataReqCu.DanhSach.find(i => i.IDSanPham === ID);
            if (item) {
                if (giaTriTang) {
                    item.SoLuong++;
                } else {
                    item.SoLuong--;
                }
                setDataReqCu({
                    ...dataReqCu,
                    DanhSach: [...dataReqCu.DanhSach]
                });
            }
        }
    }
    // Phân tách dữ liệu thành các dòng
    const lines = JSON.stringify(dataReqMoi)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    const lines2 = JSON.stringify(dataReqCu)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');


    //xử lý thông báo bếp
    const handleSubmit = () => {

        const filterDataReqMoi = {...dataReqMoi,DanhSach:dataReqMoi.DanhSach.filter(item => item.SoLuong > 0)};
        const filterDataReqCu = {...dataReqCu,DanhSach:dataReqCu.DanhSach.filter(item => item.SoLuong > 0)};
        if (dataReqMoi.IDBan) {
            if (filterDataReqMoi.DanhSach.length > 0) {
                if (filterDataReqCu.DanhSach.length > 0) {
                    dispatch({ type: 'SET_LOADING', payload: true })
                    const fetch1 = fetch(urlInsertInvoice, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ss': getCookie('ss'),
                        },
                        body: JSON.stringify(filterDataReqMoi)
                    })
                    const fetch2 = fetch(urlUpdateInvoice, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'ss': getCookie('ss'),
                        },
                        body: JSON.stringify(filterDataReqCu)
                    })
                    Promise.all([fetch1, fetch2])
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
                            props.addNotification('Tách đơn thành công', 'success', 3000)
                            // props.setdataUser({ ...props.dataUser, search: '', sortBy: 'IDHoaDon', sortOrder: 'desc' })
                            props.setDataUser(props.dataUser + 1)
                            props.setPopupTachGhep(false)
                            //ẩn loading
                            dispatch({ type: 'SET_LOADING', payload: false })
                        })
                        .catch(error => {
                            console.log('error',error);
                            if (error instanceof TypeError) {
                                props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                            } else {
                                props.addNotification(error.message, 'warning', 5000)
                            }
                            dispatch({ type: 'SET_LOADING', payload: false })
                        });
                } else
                    props.openPopupAlert('Đơn cũ phải giữ lại ít nhất một món ăn !')
            }else
            props.openPopupAlert('Đơn mới chưa có món ăn nào !')
        } else
            props.openPopupAlert('Bạn chưa chọn bàn ăn !')
    }
    return (
        <div>
            <div className="row">
                <div className="col-6" style={{borderRight:'inset'}}>
                    <div style={{ float: 'right', marginTop: '2px' }}>

                        <input
                            id="search"
                            value={dataUser.search}
                            onChange={handleSearch}
                            placeholder='Tìm Kiếm'
                            type="text"
                            className="form-control-sm"
                            style={{ border: '0.8px grey solid' }}
                        />
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
                        <select class="form-select-sm"
                            value={dataUser.searchBy}
                            onChange={handleSearchBy}

                        >
                            <option value="IDBan">Tìm theo ID Bàn</option>
                            <option value="TenBan">Tìm theo Tên Bàn</option>
                            <option value="TenKhuVuc">Tìm theo Tên Khu Vực</option>

                        </select>
                    </div>


                    <table class="table align-items-center m-2 ">
                        <thead>
                            <tr >
                                <th style={{ padding: 8 }} onClick={() => handleClickSort('TenBan')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Bàn </th>
                                <th style={{ textAlign: 'center' }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Trạng Thái </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ghi Chú </th>
                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Vị Trí Bàn </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                duLieuHienThi.map((dulieu, index) =>
                                    <tr
                                        style={{ 'textAlign': 'center', backgroundColor: selectedRow0 === dulieu.IDBan ? '#c3f4ff73' : '#fff'  }}
                                        id='trdata'
                                        key={dulieu.IDBan}
                                        onClick={() => {
                                            setDataReqMoi({
                                                ...dataReqMoi,
                                                IDBan: dulieu.IDBan,
                                                TenBan: dulieu.TenBan,
                                                TenKhuVuc: dulieu.TenKhuVuc
                                            })
                                            setSelectedRow0(dulieu.IDBan);
                                        }} >
                                        <td style={{ textAlign: 'left' }} >{dulieu.TenBan}</td>
                                        <td >{dulieu.TrangThai}</td>
                                        <td >{dulieu.GhiChu}</td>
                                        <td >{dulieu.TenKhuVuc}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {/* {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
<label style={{ borderTop: '1px solid black', marginLeft: '45%', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortOrder === 'asc' ? <label style={{ color: 'darkgray' }}>tăng dần</label> : <label style={{ color: 'darkgray' }}>giảm dần</label>} theo cột {dataRes.sortBy}  </label> */}
                    {/* phân trang */}
                    <div style={{ float: 'right', margin: '1%' }}>
                        <Pagination
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            dataRes={dataRes}
                        />
                    </div>
                    {/* {
                            popupInsertUpdate && <div className="popup">
                                <Insert_updateKhachHang
                                    isInsert={isInsert}
                                    setPopupInsertUpdate={setPopupInsertUpdate}
                                    dataUser={dataUser}
                                    setdataUser={setdataUser}
                                    addNotification={props.addNotification}
                                    openPopupAlert={props.openPopupAlert}
                                />
                            </div>
                        } */}
                </div>
                <div className="col-6">
                    <h4 style={{textAlign:'center'}}>Danh Sách Sản Phẩm</h4>
                    <div>
                        <div style={{ height: '550px', maxHeight: '60%', overflow: 'auto', overflowX: 'hidden' }}>
                            <table class="table align-items-center m-2 ">
                                <thead>
                                    <tr >
                                        <th style={{ padding: 8 }} onClick={() => handleClickSort('TenBan')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Sản Phẩm</th>

                                        <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">SL Trên Đơn Gốc </th>
                                        <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">SL Tách</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataReqCu.DanhSach.map((dulieu, index) =>
                                            <tr
                                                style={{ 'textAlign': 'center' }}
                                                id='trdata'
                                                key={dulieu.IDSanPham}
                                            >
                                                <td style={{ textAlign: 'left' }} >{dulieu.TenSanPham}</td>
                                                <td>{dulieu.SoLuong}</td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '20px',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMinusSquare}
                                                        style={{ fontSize: '20px' }}
                                                        onClick={() => {
                                                            if (dataReqMoi.DanhSach.find(item => item.IDSanPham === dulieu.IDSanPham)?.SoLuong !== 0) {
                                                                handleDetailChange(dulieu.IDSanPham, true, false)
                                                                handleDetailChange(dulieu.IDSanPham, false, true)
                                                            }
                                                        }}
                                                    />

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            fontSize: '20px',
                                                            margin: '0 5px'
                                                        }}
                                                        onClick={() => {
                                                            const SoLuong = prompt("Nhập Số Lượng:");
                                                            // if (SoLuong) {
                                                            //     handleDetailChangeCu(dulieu.IDSanPham,
                                                            //         SoLuong,
                                                            //         'SoLuong'
                                                            //     )
                                                            // }
                                                        }}
                                                    >

                                                        {
                                                            dataReqMoi.DanhSach.find(item => item.IDSanPham === dulieu.IDSanPham)?.SoLuong
                                                        }

                                                    </div>

                                                    <FontAwesomeIcon
                                                        icon={faSquarePlus}
                                                        style={{ fontSize: '20px' }}
                                                        onClick={() => {
                                                            if (dulieu.SoLuong !== 0) {
                                                                handleDetailChange(dulieu.IDSanPham, false, false)
                                                                handleDetailChange(dulieu.IDSanPham, true, true)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
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
                                Danh sách mới: {lines.map(line => <div>{line}</div>)}

                            </pre> */}
                            {/* <pre
                                style={{
                                    background: '#333',
                                    color: '#53ff53',
                                    padding: '10px',
                                    margin: '20px auto',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all'
                                }}
                            >
                                Danh sách cũ: {lines2.map(line => <div>{line}</div>)}
                            </pre> */}
                        </div>
                    </div>
                    {/* <div style={{ width: '100%' }}>
                        <div style={{ width: '100%', float: 'right' }}>
                            <p style={{ float: 'left', marginLeft: '2%' }}>
                                <strong style={{
                                    fontSize: '20px',
                                    color: 'black',
                                    marginRight: '4px'
                                }}>
                                    {
                                        dataReqMoi.DanhSach.reduce((total, item) => {
                                            return total + item.SoLuong;
                                        }, 0)

                                    }
                                </strong>
                                Sản Phẩm
                            </p>
                            <p style={{ float: 'right' }}>
                                Tổng Tiền:  <strong style={{
                                    fontSize: '20px',
                                    color: 'black',
                                    marginRight: '5px'
                                }}>

                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(dataReqMoi.DanhSach.reduce((total, item) => {
                                        return total + item.SoLuong * item.GiaBan;
                                    }, 0))}
                                </strong>
                            </p>

                        </div>
                    </div> */}
                </div>
                <div>
                    <button
                        onClick={() => {
                            props.setDataUser(props.dataUser + 1)
                            props.setPopupTachGhep(false)
                        }}
                        type="button"
                        className="btn btn-danger"
                        style={{ marginLeft: '2%' }}
                    >Huỷ Bỏ</button>
                    <button
                        onClick={() => {
                            handleSubmit()
                        }}
                        type="button"
                        className="btn btn-primary mt-3"
                        style={{ float: 'right' }}
                    >Xác Nhận</button>
                </div>
            </div>
        </div>
    )
}
export default TabTachDon;