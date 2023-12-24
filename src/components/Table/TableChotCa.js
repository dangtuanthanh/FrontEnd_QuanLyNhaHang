import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
const TableChotCa = (props) => {
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'asc' })
            setIsAsc(false)
            if (value === 'NgayLamViec')
                props.addNotification(`Sắp xếp cũ nhất tới mới nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp tăng dần theo ${value}`, 'success', 3000)
        } else {
            props.setdataUser({ ...props.dataUser, sortBy: value, sortOrder: 'desc' })
            setIsAsc(true)
            if (value === 'NgayLamViec')
                props.addNotification(`Sắp xếp mới nhất đến cũ nhất theo ${value}`, 'success', 3000)
            else
                props.addNotification(`Sắp xếp giảm dần theo ${value}`, 'success', 3000)
        }

    };
    //xử lý Sửa hàng loạt
    const [selectAll, setSelectAll] = useState(false);
    //dùng để reset ô selectAll khi thực hiện tìm kiếm hoặc sắp xếp
    useEffect(() => {
        setSelectAll(false)
    }, [props.duLieuHienThi]);
    // dùng để reset khi bấm nút quay lại
    useEffect(() => {
        if (props.selectedIds.length == 0) {
            const checkboxes = document.querySelectorAll('.checkboxCon');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            setSelectAll(false);
        }
    }, [props.selectedIds]);
    //Kiểm tra ô sửa hàng loạt
    function handleSelectAllChange(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            //lấy các class để tạo hành động check toàn bộ
            const checkboxes = document.querySelectorAll('.checkboxCon');
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
            //$(".checkboxCon").prop("checked", true);
            const allIds = props.duLieuHienThi.map((item) => item.IDChotCa.toString());
            console.log("allIds:", allIds); // Kiểm tra danh sách các id đã chọn
            props.setSelectedIds(allIds);
            setSelectAll(true);
        } else {
            //$(".checkboxCon").prop("checked", false);
            const checkboxes = document.querySelectorAll('.checkboxCon');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            props.setSelectedIds([]);
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
            newSelectedIds = [...props.selectedIds, id];
        } else {
            newSelectedIds = props.selectedIds.filter((selectedId) => selectedId !== id);
            setSelectAll(false);
        }
        console.log("newSelectedIds:", newSelectedIds); // Kiểm tra mảng selectedIds mới
        props.setSelectedIds(newSelectedIds);
        const allChecked = newSelectedIds.length === props.duLieuHienThi.length;
        console.log("allChecked:", allChecked); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        setSelectAll(allChecked);

    }
    //hết xử lý Sửa hàng loạt

    return (
        <table class="table align-items-center mb-0">
            <thead>
                <tr >
                    <th style={{ textAlign: 'center' }}><input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                    /></th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenCaLamViec')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Ca Làm Việc </th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('TenNhanVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Nhân Viên </th>
                    <th style={{ textAlign: 'center', padding: 8 }} onClick={() => handleClickSort('NgayLamViec')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày </th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tiền Chốt </th>
                    <th style={{ padding: 8 }} onClick={() => handleClickSort('XacNhanGiaoCa')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Trạng Thái </th>
                    <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.duLieuHienThi.map((dulieu, index) =>
                        //<div  onClick={() => handleRowClick(nhanvien)}>
                        <tr
                            style={{ 'textAlign': 'center' }}
                            id='trdata'
                            key={dulieu.IDChotCa}
                            onClick={() => {
                                props.setIsInsert(false)
                                props.setIDAction(dulieu.IDChotCa)
                                props.setPopupInsertUpdate(true)
                            }} >
                            <td >
                                <input
                                    type="checkbox"
                                    value={dulieu.IDChotCa}
                                    className='checkboxCon'
                                    checked={props.selectedIds.includes(dulieu.IDChotCa.toString())}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={handleCheckboxChange}
                                />

                            </td>
                            <td style={{ textAlign: 'left' }} >{dulieu.TenCaLamViec}</td>
                            <td style={{ textAlign: 'left' }} >{dulieu.TenNhanVien}</td>
                            <td >{dulieu.NgayLamViec}</td>
                            <td>
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(dulieu.TienChotCa)}
                            </td>
                            {
                                dulieu.XacNhanGiaoCa ?
                                <td  style={{ textAlign: 'left' }}>Đã chốt</td>
                                : <td  style={{ textAlign: 'left' }}>Chưa chốt</td>
                            }
                            <td>
                                <a onClick={(e) => {
                                    e.stopPropagation(); props.openPopupAlert(
                                        `Bạn có chắc chắn muốn xoá ${dulieu.IDChotCa}`,
                                        () => { props.deleteData(dulieu.IDChotCa) }
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

export default TableChotCa;