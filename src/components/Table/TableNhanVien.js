import React, { useState, useEffect } from "react";
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faRotate, faAdd, faCheck, faXmark, faRotateLeft, faDownload, faUpload, faFileExcel, faFilePdf, faArrowLeft, faBars, faArrowUp } from '@fortawesome/free-solid-svg-icons'
const TableNhanVien = (props) => {
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc' })
            setIsAsc(false)
            props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc' })
            setIsAsc(true)
            props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }

    };



    //xử lý Sửa hàng loạt
    const [selectedIds, setSelectedIds] = useState([]);//mảng chọn
    const [selectAll, setSelectAll] = useState(false);
    //Kiểm tra ô sửa hàng loạt
    function handleSelectAllChange(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            $(".checkboxCon").prop("checked", true);
            const allIds = props.duLieuHienThi.map((item) => item.SoHD.toString());
            console.log("allIds:", allIds); // Kiểm tra danh sách các id đã chọn
            setSelectedIds(allIds);
            setSelectAll(true);
        } else {
            $(".checkboxCon").prop("checked", false);
            setSelectedIds([]);
            setSelectAll(false);
        }
    }

    //kiểm tra ô checkbox được check
    function handleCheckboxChange(event) {
        // togglePopup5(); //bật popup sửa hàng loạt
        const id = event.target.value;
        const isChecked = event.target.checked;

        let newSelectedIds;
        if (isChecked) {
            newSelectedIds = [...selectedIds, id];
        } else {
            newSelectedIds = selectedIds.filter((selectedId) => selectedId !== id);
            setSelectAll(false);
        }

        console.log("newSelectedIds:", newSelectedIds); // Kiểm tra mảng selectedIds mới
        setSelectedIds(newSelectedIds);

        const allChecked = newSelectedIds.length === props.duLieuHienThi.length;
        console.log("allChecked:", allChecked); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        setSelectAll(allChecked);

    }
    //hết xử lý Sửa hàng loạt

    return (
        <table id="nhanvien" class="table align-items-center mb-0">
            <thead>
                <tr >
                    <th style={{ textAlign: 'center' }}><input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                    /></th>
                    <th style={{ textAlign: 'center' }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">STT</th>
                    <th style={{ textAlign: 'center' }} onClick={() => handleClickSort('IDNhanVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">ID Nhân Viên </th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenNhanVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Nhân Viên </th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenViTriCongViec')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Vị Trí Công Việc </th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TaiKhoan')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tài Khoản </th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Hình Ảnh</th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenVaiTro')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Vai Trò Truy Cập</th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.duLieuHienThi.map((dulieu, index) =>
                        //<div  onClick={() => handleRowClick(nhanvien)}>
                        <tr style={{ 'textAlign': 'center' }} id='trdata' key={dulieu.SoHD} onClick={() => {
                            props.setIsInsert(false)
                            props.setIDAction(dulieu.IDNhanVien)
                            props.setPopup1(true)
                        }} >
                            <td >
                                <input
                                    type="checkbox"
                                    value={dulieu.SoHD}
                                    className='checkboxCon'
                                    //checked={selectedIds.includes(nhanvien.SoHD)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={handleCheckboxChange}
                                />

                            </td>
                            <td >{index + 1}</td>
                            <td >{dulieu.IDNhanVien}</td>
                            <td style={{ textAlign: 'left' }} >{dulieu.TenNhanVien}</td>
                            <td style={{ textAlign: 'left' }} >{dulieu.TenViTriCongViec}</td>
                            <td style={{ textAlign: 'left' }}>{dulieu.TaiKhoan}</td>
                            <td style={{ padding: '0' }}>
                                <img
                                    height={'35px'}
                                    src={dulieu.HinhAnh}></img>
                            </td>
                            <td style={{ 'textAlign': 'left' }}>{dulieu.TenVaiTro}</td>
                            <td>
                                <a onClick={(e) => {
                                    e.stopPropagation();
                                    props.setIsInsert(false)
                                    props.setIDAction(dulieu.IDNhanVien)
                                    props.setPopup1(true)
                                }}>
                                    <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                    < FontAwesomeIcon icon={faPencil} />
                                    {/* < FontAwesomeIcon icon={faPencil}style={{color:'cb0c9f'}} /> */}
                                </a>
                                ㅤ
                                <a onClick={(e) => {
                                    e.stopPropagation(); props.openPopupAlert(
                                        `Bạn có chắc chắn muốn xoá ${dulieu.TenNhanVien}`,
                                        () => { props.deleteData(dulieu.IDNhanVien) }
                                    )
                                }} class='btnEdit'><FontAwesomeIcon icon={faTrash} /></a>

                            </td>

                        </tr>
                        //</div>
                    )
                }
            </tbody>
        </table>
    )
};

export default TableNhanVien;