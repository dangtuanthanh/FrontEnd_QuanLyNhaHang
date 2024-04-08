import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
import { urlUpdateStatusProduct } from "../url";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
const TableBoiBan = (props) => {
    //xử lý redux
    const dispatch = useDispatch();
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc' })
            setIsAsc(false)
            if (value === 'ThoiGianDat')
                props.addNotification(`Sắp xếp cũ nhất tới mới nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc' })
            setIsAsc(true)
            if (value === 'ThoiGianDat')
                props.addNotification(`Sắp xếp mới nhất đến cũ nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }

    };
    const handleSubmit = (IDHoaDon, IDSanPham, IDTrangThai, TrangThaiMonHienTai,SoLuong,huychebien) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        const data = {
            IDHoaDon: IDHoaDon,
            IDSanPham: IDSanPham,
            IDTrangThai: IDTrangThai,
            TrangThaiMonHienTai:TrangThaiMonHienTai,
            SoLuong:SoLuong,
            huychebien:huychebien
        };

        fetch(urlUpdateStatusProduct, {
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
                if (TrangThaiMonHienTai === 2) {
                    props.addNotification('Đã giao cho khách thành công', 'success', 3000)
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                    props.setdataUser({ ...props.dataUser, sortBy: 'ThoiGianDat', sortOrder: 'asc' })
                }

                else {
                    props.addNotification('Đã thông báo tới khách', 'success', 3000)
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                    props.setdataUser({ ...props.dataUser, sortBy: 'ThoiGianDat', sortOrder: 'asc' })

                }

            })
            .catch(error => {
                dispatch({ type: 'SET_LOADING', payload: false })
                if (error instanceof TypeError) {
                    props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    props.addNotification(error.message, 'warning', 5000)
                }

            });
    }
    return (
        <table class="table align-items-center mb-0">
            <thead>
                <tr >
                    {/* <th style={{ textAlign: 'center' }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">STT</th> */}
                    <th style={{ padding: 8, textAlign: 'center' }} onClick={() => handleClickSort('TenBan')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Bàn </th>
                    {/* <th style={{ padding: 8, textAlign: 'center' }} onClick={() => handleClickSort('IDHoaDon')}
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">ID Hoá Đơn</th> */}

                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenSanPham')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Sản Phẩm</th>
                    <th style={{ padding: 8, textAlign: 'center' }}
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Số Lượng</th>
                    <th style={{ padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ghi Chú</th>
                    <th style={{ padding: 8, textAlign: 'center' }} onClick={() => handleClickSort('ThoiGianDat')}
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Thời Gian Đặt</th>
                    <th style={{ padding: 8, textAlign: 'center' }}
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Trạng Thái</th>
                    {/* <th style={{ padding: 8 }}onClick={() => handleClickSort('TenNhanVien')} 
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Nhân Viên</th> */}
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.duLieuHienThi.map((dulieu, index) =>
                        <tr
                            style={{ 'textAlign': 'center' }}
                            id='trdata'
                            key={dulieu.IDLoaiSanPham}
                        // onClick={() => {
                        //     props.setIDAction(dulieu.IDLoaiSanPham)
                        // }} 
                        >
                            {/* <td >{index + 1}</td> */}
                            <td >{dulieu.TenBan}</td>
                            {/* <td >{dulieu.IDHoaDon}</td> */}
                            <td style={{ textAlign: 'left' }} >{dulieu.TenSanPham}</td>
                            <td >{dulieu.SoLuong}</td>
                            <td style={{ textAlign: 'left' }} >{dulieu.GhiChu}</td>
                            <td >{dulieu.ThoiGianDat}</td>
                            {dulieu.IDTrangThai ==2 ?
                                <td style={{ color: 'green' }} ><FontAwesomeIcon icon={faCheck} /> Chế Biến Xong</td>
                                :
                                <td style={{ color: 'darkorange' }} ><FontAwesomeIcon icon={faBan} /> Huỷ Chế Biến</td>
                            }
                            {/* <td style={{ textAlign: 'left' }} >{dulieu.TenNhanVien}</td> */}
                            <td>
                                <a onClick={() => {
                                    handleSubmit(dulieu.IDHoaDon, dulieu.IDSanPham, 3, dulieu.IDTrangThai,dulieu.SoLuong,true)
                                }} style={{ color: 'green' }} >
                                    <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                    < FontAwesomeIcon icon={faCheck} />
                                    {/* < FontAwesomeIcon icon={faPencil}style={{color:'cb0c9f'}} /> */}
                                </a>
                            </td>

                        </tr>
                        //</div>
                    )
                }
            </tbody>
        </table>
    )
};

export default TableBoiBan;