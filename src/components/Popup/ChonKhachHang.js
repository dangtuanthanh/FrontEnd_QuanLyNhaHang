import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faAdd, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "../Cookie";
import Pagination from "../Pagination";
import { urlInsertArea, urlGetCustomer, urlUpdateArea } from "../url"
import Insert_updateKhachHang from "../Popup/Insert_updateKhachHang";
const ChonKhachHang = (props) => {

    //xử lý redux
    const dispatch = useDispatch()
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
        sortBy: 'TenKhachHang',
        sortOrder: 'asc',
        searchBy: 'TenKhachHang',
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
        fetch(`${urlGetCustomer}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
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
            sortBy: 'TenKhachHang',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value
        });

    };
    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'TenKhachHang',
            sortOrder: 'asc',
            page: 1,
            searchBy: event.target.value
        });

    };
    return (
        <div className="popup-box" style={{ zIndex: '9991' }}>
            <div className="box">
                <div className="conten-modal">
                    <h4 style={{ textAlign: 'center' }}>Danh Sách Khách Hàng</h4>


                    <button
                        style={{ 'display': "inline-block" }}
                        onClick={() => {
                            setIsInsert(true)
                            setPopupInsertUpdate(true)
                        }}

                        className="btn btn-primary btn-sm">
                        <FontAwesomeIcon icon={faAdd} />
                        ㅤThêm
                    </button>ㅤ
                    <div style={{ float: 'right' }}>

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
                            <option value="IDKhachHang">Tìm theo ID Khách Hàng</option>
                            <option value="TenKhachHang">Tìm theo Tên Khách Hàng</option>
                            <option value="SoDienThoai">Tìm theo Số Điện Thoại</option>

                        </select>
                    </div>


                    <table class="table align-items-center mb-0">
                        <thead>
                            <tr >
                                <th style={{ textAlign: 'center' }} onClick={() => handleClickSort('IDKhachHang')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">ID Khách Hàng </th>
                                <th style={{ padding: 8 }} onClick={() => handleClickSort('TenKhachHang')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Khách Hàng </th>
                                <th style={{ textAlign: 'center' }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Số Điện Thoại </th>
                                <th style={{ textAlign: 'center' }} onClick={() => handleClickSort('DiemTichLuy')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Điểm Tích Luỹ </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                duLieuHienThi.map((dulieu, index) =>
                                    <tr
                                        style={{ 'textAlign': 'center' }}
                                        id='trdata'
                                        key={dulieu.IDKhachHang}
                                        onClick={() => {
                                            props.setDataReq({
                                                ...props.dataReq,
                                                IDKhachHang: dulieu.IDKhachHang,
                                                TenKhachHang: dulieu.TenKhachHang
                                            })
                                            props.setPopupChonKhachHang(false)
                                        }} >
                                        {/* <td >{index + 1}</td> */}
                                        <td >{dulieu.IDKhachHang}</td>
                                        <td style={{ textAlign: 'left' }} >{dulieu.TenKhachHang}</td>
                                        <td >{dulieu.SoDienThoai}</td>
                                        <td >{dulieu.DiemTichLuy}</td>
                                    </tr>
                                    //</div>
                                )
                            }
                        </tbody>
                    </table>
                    {/* {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                    <label style={{ borderTop: '1px solid black', marginLeft: '45%', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortOrder === 'asc' ? <label style={{ color: 'darkgray' }}>tăng dần</label> : <label style={{ color: 'darkgray' }}>giảm dần</label>} theo cột {dataRes.sortBy}  </label> */}
                    {/* phân trang */}
                    <Pagination
                        setdataUser={setdataUser}
                        dataUser={dataUser}
                        dataRes={dataRes}
                    />
                    <div style={{ marginTop: '5%' }}>
                        <button onClick={() => { props.setPopupChonKhachHang(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                        <button
                            onClick={() => {
                                props.setDataReq({
                                    ...props.dataReq,
                                    IDKhachHang: 0,
                                    TenKhachHang: 'Khách Tham Quan'
                                })
                                props.setPopupChonKhachHang(false)
                            }}
                            type="button"
                            className="btn btn-primary mt-3"
                            style={{ float: 'right' }}
                        >Khách Tham Quan</button>
                    </div>
                    {
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
            }
                </div>
            </div >

        </div >
    );
}
export default ChonKhachHang;