import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash, faRotate, faAdd, faCheck, faXmark, faRotateLeft, faDownload, faUpload, faFileExcel, faFilePdf, faArrowLeft, faBars, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import NavTop from "../components/NavTop";
import { getCookie } from "../components/Cookie";
import '../App.css';
import logo from '../assets/img/logos/logo-removebg-preview.png';
import { urlGetAccount } from '../components/Url'
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

    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'IDNhanVien',
        sortOrder: 'asc',
        searchBy: 'IDNhanVien',
        search: '',
        searchExact:'false'
    });//
    const [dataRes, setDataRes] = useState({});//dữ liệu nhận được khi getAccount
    const [loading, setLoading] = useState(false);//trạng thái loading
    const [buttons, setButtons] = useState([]);//Nút phân trang
    const [isAsc, setIsAsc] = useState(false);//trạng thái sắp xếp tăng dần
    const [optionsDisplay, setOptionsDisplay] = useState([//số hàng hiển thị
        { value: "10", label: "Hiển thị: 10" },
        { value: "30", label: "Hiển thị: 30" },
        { value: "50", label: "Hiển thị: 50" },
        { value: "100", label: "Hiển thị: 100" },
        { value: '', label: `Hiển thị toàn bộ` },
        { value: "custom", label: "Tùy chọn khác" },
    ]);

    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    //hàm số hàng trên trang
    const handleChangeDisplayRow = (event) => {
        const selectedValue = event.target.value;
        if (selectedValue === "custom") {
            const customValue = prompt("Nhập số hàng trên mỗi trang:");
            if (customValue) {
                if (customValue > dataRes.totalItems) {
                    alert("Bạn vừa nhập số hàng hiển thị lớn hơn số hàng dữ liệu sẵn có. Hệ thống sẽ hiển thị tất cả dữ liệu");
                } else {
                    setOptionsDisplay((prevoptionsDisplay) => [
                        ...prevoptionsDisplay,
                        { value: customValue, label: `Hiển thị: ${customValue}` },
                    ]);
                }
                setdataUser({ ...dataUser, page: 1, limit: customValue });
            }
        } else setdataUser({ ...dataUser, page: 1, limit: selectedValue });
    };
    //hàm ngắt trang
    const handleClickButtonPage = (value) => {//chuyển trang
        setdataUser({ ...dataUser, page: value });//đặt số trang
    };

    //hàm sắp xếp
    const handleClickSort = (value) => {//Xử lý click cột sắp xếp
        if (isAsc) {
            setdataUser({ ...dataUser, sortBy: value, sortOrder: 'asc' })
            setIsAsc(false)
        } else {
            setdataUser({ ...dataUser, sortBy: value, sortOrder: 'desc' })
            setIsAsc(true)
        }

    };
    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDNhanVien',
            sortOrder: 'asc',
            page:1,
            search: event.target.value
        });
        
    };

    //hàm lọc tìm kiếm
    const handleSearchBy = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDNhanVien',
            sortOrder: 'asc',
            page:1,
            searchBy: event.target.value
        });
        
    };
    //hàm chế độ tìm kiếm
    const handleSearchExact = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDNhanVien',
            sortOrder: 'asc',
            page:1,
            searchExact: event.target.value
        });
        
    };


    //hàm tải dữ liệu
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
                //phân trang
                if (data.totalItems !== 0) {
                    const newButtons = [];
                    for (let i = 1; i <= data.totalPages; i++) {
                        newButtons.push(
                            <button
                                style={{
                                    marginRight: "1%",
                                    backgroundColor: i === data.currentPage ? '#5e72e4' : 'white',
                                    color: i === data.currentPage ? 'white' : 'black'
                                }}
                                className='btn btn-light'
                                key={i}
                                onClick={() => { handleClickButtonPage(i) }}
                            >
                                {i}
                            </button>
                        );
                    }
                    setButtons(newButtons);
                }

                //cập nhật combobox hiển thị số hàng trên trang
                setOptionsDisplay((prevOptions) => {
                    let updatedOptions = prevOptions.map((option) => {
                        if (option.label === "Hiển thị toàn bộ") {
                            return { ...option, value: data.totalItems };
                        }
                        return option;
                    });

                    if (data.totalItems < 100) {
                        // Xoá option dựa trên giá trị (value)
                        updatedOptions = updatedOptions.filter((option) => option.value !== "100");
                    }

                    if (data.totalItems < 50) {
                        updatedOptions = updatedOptions.filter((option) => option.value !== "50");
                    }

                    if (data.totalItems < 30) {
                        updatedOptions = updatedOptions.filter((option) => option.value !== "30");
                    }

                    return updatedOptions;
                });
                //ẩn loading
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                if (error instanceof TypeError) {
                    alert('Không thể kết nối tới máy chủ');
                } else {
                    alert(error.message);
                }

            });
    };

    //Sửa dữ liệu
    const editData = () => {
        alert('Sửa dữ liệu')
    }


    //Xoá dữ liệu
    const deleteData = () => {
        alert('Xoá dữ liệu')
    }


    //hàm hiển thị chi tiết thông tin
    function handleRowClick(SoHD) {
        alert("Hiển thị chi tiết")
    }

    //xử lý Sửa hàng loạt
    const [selectedIds, setSelectedIds] = useState([]);//mảng chọn
    const [selectAll, setSelectAll] = useState(false);
    //Kiểm tra ô sửa hàng loạt
    function handleSelectAllChange(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            $(".checkboxCon").prop("checked", true);
            const allIds = duLieuHienThi.map((item) => item.SoHD.toString());
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

        const allChecked = newSelectedIds.length === duLieuHienThi.length;
        console.log("allChecked:", allChecked); // Kiểm tra trạng thái của checkbox "Chọn tất cả"
        setSelectAll(allChecked);

    }
    //hết xử lý Sửa hàng loạt


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
                                    </div>
                                    <div style={{ 'display': "inline-block", float: 'right' }}>
                                        <select
                                            class="form-select-sm"
                                            value={dataRes.itemsPerPage}
                                            onChange={handleChangeDisplayRow}//đặt thay đổi khi giá trị thay đổi
                                        >
                                            {optionsDisplay.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        ㅤ
                                        <input id="search" value={dataUser.search} onChange={handleSearch} placeholder='Tìm Kiếm' type="text" className="form-control-sm" />
                                        ㅤ
                                        <select class="form-select-sm" value={dataUser.searchBy}  onChange={handleSearchBy}>
                                            <option value="IDNhanVien">Tìm theo IDNhanVien</option>
                                            <option value="TenNhanVien">Tìm theo TenNhanVien</option>
                                            <option value="TaiKhoan">Tìm theo TaiKhoan</option>
                                            <option value="TenVaiTro">Tìm theo VaiTro</option>
                                        </select>
                                        ㅤ
                                        <select class="form-select-sm" value={dataUser.searchExact}  onChange={handleSearchExact}>
                                            <option value='false'>Chế độ tìm: Gần đúng</option>
                                            <option value="true">Chế độ tìm: Chính xác</option>
                                        </select>

                                    </div>
                                </div>


                            </div>
                            <div class="card-body px-0 pt-0 pb-2">
                                <div class="table-responsive p-0">
                                    {loading && <div className="loading">
                                        {/* <img src={logo} style={{width: '50%'}} /> */}
                                        <h4>Đang Tải...</h4>
                                    </div>}
                                    <table id="nhanvien" class="table align-items-center mb-0">
                                        <thead>
                                            <tr style={{ textAlign: 'center' }}>
                                                <th><input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={handleSelectAllChange}
                                                /></th>
                                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">STT</th>
                                                <th onClick={() => handleClickSort('IDNhanVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">ID Nhân Viên </th>
                                                <th onClick={() => handleClickSort('TenNhanVien')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Nhân Viên </th>
                                                <th onClick={() => handleClickSort('TaiKhoan')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tài Khoản </th>
                                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Hình Ảnh</th>
                                                <th onClick={() => handleClickSort('TenVaiTro')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Vai Trò Truy Cập</th>
                                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                duLieuHienThi.map((dulieu, index) =>
                                                    //<div  onClick={() => handleRowClick(nhanvien)}>
                                                    <tr style={{ 'textAlign': 'center' }} id='trdata' key={dulieu.SoHD} onClick={() => handleRowClick(dulieu.SoHD)} >
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
                                                        <td >{dulieu.TenNhanVien}</td>
                                                        <td >{dulieu.TaiKhoan}</td>
                                                        <td >{dulieu.HinhAnh}</td>
                                                        <td >{dulieu.TenVaiTro}</td>
                                                        <td>
                                                            <a /*onMouseOver={hoverText}*/ onClick={(e) => { e.stopPropagation(); editData(dulieu.SoHD); }} class='btnEdit'>
                                                                <i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" />
                                                                <FontAwesomeIcon icon={faPencil} />
                                                            </a>
                                                            ㅤ
                                                            <a onClick={(e) => { e.stopPropagation(); deleteData(dulieu.SoHD) }} class='btnEdit'><FontAwesomeIcon icon={faTrash} /></a>

                                                        </td>

                                                    </tr>
                                                    //</div>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <label style={{ borderTop: '1px solid black', marginLeft: '60%', color: 'darkgray' }} >Đang hiển thị: {duLieuHienThi.length}/{dataRes.totalItems} | Sắp xếp{dataRes.sortOrder === 'asc' ? <label style={{ color: 'darkgray' }}>tăng dần</label> : <label style={{ color: 'darkgray' }}>giảm dần</label>} theo cột {dataRes.sortBy}  </label>
                                </div>
                            </div>
                        </div>
                        <div id='phantrang' style={{ textAlign: "center" }}>
                            {buttons}
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