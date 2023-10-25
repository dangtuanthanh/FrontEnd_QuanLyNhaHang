//Bản có chức năng: Thêm, sửa, xoá, hiển thị( làm mới)
//Số hàng dữ liệu trên 1 trang( pageSize)
//Tìm kiếm( Search)
//Lọc dữ liệu tìm kiếm theo cột( Filter)
//Ngắt trang( pageBreak)
//Thêm tính năng sau khi xoá dữ liệu thì sẽ tự đồng chuyển đến hàng dữ liệu tiếp theo


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCog, faBell } from '@fortawesome/free-solid-svg-icons'
import '../assets/css/popup.css';
import $, { error } from 'jquery';
import React from 'react';

import { useEffect, useState } from "react";
import { faPencil, faTrash, faRotate, faAdd, faCheck, faXmark, faRotateLeft, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import loading1 from '../assets/img//loading/loading1.gif';
import { Demoa, ThemNhanVien, ThongBao } from '../components/Popup';
import { dataUser, filterUser } from '../components/dataUser';
var isThem;
var lengthData = 0;
var dulieu;


function HoaDon() {
    //ràng buộc dữ liệu người dùng chưa có
    if (sessionStorage.getItem("rowNhanVienTable") == null) {
        sessionStorage.setItem("rowNhanVienTable", "10");
    }
    if (sessionStorage.getItem("pageNhanVienTable") == null) {
        sessionStorage.setItem("pageNhanVienTable", "1");
    }
    if (sessionStorage.getItem("colFilter") == null) {
        sessionStorage.setItem("colFilter", "SoHD");
    }
    // Tải dữ liệu
    const [nhanvien, setNhanvien] = useState([]);//lưu trạng thái dữ liệu
    const [selectedNode, setSelectedNode] = useState(parseInt(sessionStorage.getItem("pageNhanVienTable")));//dùng để ngắt trang
    const [inputCount, setInputCount] = useState(0);
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        $(".loading").delay(200).fadeIn("medium");
        const response = await fetch(
            'http://localhost:3000/getdata');

        if (response.status === 200) {
            $(".loading").delay(200).fadeOut("medium");
            dulieu = await response.json();
            lengthData = Object.keys(dulieu).length;
            console.log(lengthData);

        } else {
            $(".loading").delay(200).fadeOut("medium");
            $(".Loi").text("Lỗi không tải được dữ liệu. Mã lỗi: " + $(response.status)[0])
            $(".Loi").delay(200).show("medium");
            lengthData = 0;
            // throw new Error(message);

        }


        if (!response.ok) {
            return (
                <div style={{ zIndex: "1" }}>Vui lòng kiểm tra lại hoạt động của dữ liệu</div>
            )
        }
        //cut data
        // setNhanvien(data.slice(0, sessionStorage.getItem("rowNhanVienTable")))
        var Last = sessionStorage.getItem("pageNhanVienTable") * sessionStorage.getItem("rowNhanVienTable");
        var First = Last - sessionStorage.getItem("rowNhanVienTable");
        setNhanvien(dulieu.slice(First, Last));
    }
    // Hết tải dữ liệu
    {/*Thêm dữ liệu  */ }

    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    const isisThem = () => {
        isThem = true;
        togglePopup();
    }
    const postData = () => {
        $(".loading").delay(200).fadeIn("medium");
        var dulieupost = {
            "NgayHD": $("#editNgayHD").val(),
            "NgayGiao": $("#editNgayGiao").val(),
            "MaKH": $("#editMaKH").val(),
            "MaNV": $("#editMaNV").val()
        };
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/postdata",
            data: dulieupost,
            dataType: 'text',
            cache: false,
            success: function () {
                $(".ThanhCong").text("Thêm nhân viên thành công. ");
                $(".ThanhCong").delay(200).show("medium");
                togglePopup();
                //load lại dữ liệu

                //đặt trang hiển thị là ở trang cuối cùng để tìm thấy dữ liệu vừa được thêm
                const lastPage = Math.ceil((lengthData + 1) / sessionStorage.getItem("rowNhanVienTable"));
                sessionStorage.setItem("pageNhanVienTable", lastPage);

                setInputCount((prevInputCount) => prevInputCount + 1);
                setSelectedNode(parseInt(sessionStorage.getItem("pageNhanVienTable")));
                setTimeout(() => $(".ThanhCong").delay(200).hide("medium"), 3000);
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
                console.error(error);
                if (xhr.responseText) {
                    $(".Loi").text("Lỗi không thêm được nhân viên. Lý do lỗi: " + xhr.responseText);
                } else {
                    $(".Loi").text("Lỗi không thêm được nhân viên. Lý do lỗi: " + error);
                }
                $(".Loi").delay(200).show("medium");
                setTimeout(() => $(".Loi").delay(200).hide("medium"), 3000);
                $(".loading").delay(200).fadeOut("medium");
            }
        });
    }
    {/* Hết Thêm dữ liệu  */ }
    const xacnhan = () => {

        if (isThem) {
            postData();
        } else {
            $(".loading").delay(200).fadeIn("medium");
            var dulieuedit = {
                //"SoHD": $("#editSoHD").val(),
                "NgayHD": $("#editNgayHD").val(),
                "NgayGiao": $("#editNgayGiao").val(),
                "MaKH": $("#editMaKH").val(),
                "MaNV": $("#editMaNV").val()
            };

            $.ajax({

                type: "PUT",
                url: "http://localhost:3000/updatedata/" + $("#editSoHD").val(),
                data: dulieuedit,
                success: function () {
                    $(".ThanhCong").text("Sửa nhân viên thành công. ");
                    $(".ThanhCong").delay(200).show("medium");
                    togglePopup();
                    getData();
                    setTimeout(() => $(".ThanhCong").delay(200).hide("medium"), 3000);
                },
                error: function () {
                    $(".Loi").text("Lỗi không sửa được nhân viên. ");
                    $(".Loi").delay(200).show("medium");
                    setTimeout(() => $(".Loi").delay(200).hide("medium"), 3000);
                    $(".loading").delay(200).fadeOut("medium");
                },
            });
        }
    }
    {/* Sửa dữ liệu  */ }
    const editData = async (SoHD) => {
        isThem = false;
        $(".loading").delay(200).fadeIn("medium");
        const response = await fetch(
            'http://localhost:3000/getdata1/' + SoHD);

        if (response.status === 200) {
            togglePopup();
            const data = await response.json();
            $("#tieudepop").text("Sửa Hoá Đơn");
            $("#editSoHD").val(data.SoHD);
            $("#editSoHD").prop('disabled', true);
            //$("#editSoHD").prop('disabled', false).css('opacity', 1);
            const partsNgayHD = data.NgayHD.split("-");
            const formattedNgayHD = `${partsNgayHD[2]}-${partsNgayHD[1]}-${partsNgayHD[0]}`;
            $("#editNgayHD").val(formattedNgayHD);

            // $("#editNgayHD").val(data.NgayHD);

            // Chuyển đổi định dạng ngày tháng của NgayGiao
            const partsNgayGiao = data.NgayGiao.split("-");
            const formattedNgayGiao = `${partsNgayGiao[2]}-${partsNgayGiao[1]}-${partsNgayGiao[0]}`;
            $("#editNgayGiao").val(formattedNgayGiao);
            $("#editMaKH").val(data.MaKH);
            $("#editMaNV").val(data.MaNV);
            $(".loading").delay(200).fadeOut("medium");

        } else {
            $(".loading").delay(200).fadeOut("medium");
            $(".Loi").text("Lỗi không tải được thông tin. Mã lỗi: " + $(response.status)[0])
            $(".Loi").delay(200).show("medium");
            setTimeout(() => $(".Loi").delay(200).hide("medium"), 3000);

            // throw new Error(message)
        }
    }
    {/* Hết Sửa dữ liệu  */ }

    {/* Xoá dữ liệu  */ }
    const deleteData = async (SoHD) => {
        $(".loading").delay(200).fadeIn("medium");
        $.ajax({
            url: "http://localhost:3000/deletedata/" + SoHD,
            method: "DELETE",
            success: function () {
                //đặt trang hiển thị là ở trang cuối cùng để xoá dữ liệu theo tuần tự
                const lastPage = Math.ceil((lengthData) / sessionStorage.getItem("rowNhanVienTable"));

                const penultimatePage = Math.ceil((lengthData -1) / sessionStorage.getItem("rowNhanVienTable"));
                //nếu trang hiện tại là trang cuối cùng thì khi xoá thành công sẽ đặt trạng thái trang là trang gần cuối(penultimatePage), nếu không phải trang cuối thì sẽ ở trang hiện tại
                if(sessionStorage.getItem("pageNhanVienTable")== lastPage){
                    sessionStorage.setItem("pageNhanVienTable", penultimatePage);
                    setSelectedNode(parseInt(sessionStorage.getItem("pageNhanVienTable")));
                }
                
                
                setInputCount((prevInputCount) => prevInputCount + 1);
                
                $(".ThanhCong").text("Xoá nhân viên thành công. ");
                $(".ThanhCong").delay(200).show("medium");
                $(".HoanTac").delay(200).show("medium");
                
                setTimeout(() => $(".ThanhCong").delay(200).hide("medium"), 3000);
                setTimeout(() => $(".HoanTac").delay(200).hide("medium"), 3000);
            },
            error: function () {
                $(".Loi").text("Lỗi không xoá được nhân viên. ");
                $(".Loi").delay(200).show("medium");
                setTimeout(() => $(".Loi").delay(200).hide("medium"), 3000);
                $(".loading").delay(200).fadeOut("medium");
            },
        })
    }
    {/* Hết Xoá dữ liệu  */ }

    //undo dữ liệu
    const undoDelete = () => {
        $(".Loi").text("Tính năng này đang được phát triển. ");
        $(".Loi").delay(200).show("medium");
        setTimeout(() => $(".Loi").delay(200).hide("medium"), 3000);
    }
    //hết undo dữ liệu


    //ngắt trang 
    const xuLyClick = (value) => {
        //getData(value);   
        setInputCount((prevInputCount) => prevInputCount + 1);
        sessionStorage.setItem("pageNhanVienTable", value);
        setSelectedNode(value);
    };
    const buttons = [];
    if (lengthData != 0) {
        for (let i = 1; i <= Math.ceil(lengthData / sessionStorage.getItem("rowNhanVienTable")); i++) {
            buttons.push(
                <button style={{ marginRight: "1%", backgroundColor: i === selectedNode ? '#5e72e4' : 'white', color: i === selectedNode ? 'white' : 'black' }} className='btn btn-light' key={i} onClick={() => { xuLyClick(i) }}>
                    {i}
                </button>
            );
        }
    }


    // hếtngắt trang 

    //Tìm Kiếm

    const [searchTerm, setSearchTerm] = useState("");

    // Biến thời gian để giới hạn số lần fetch được gọi trong một khoảng thời gian nhất định
    let fetchTimeoutId;
    useEffect(() => {
        // Hủy bỏ timeout nếu giá trị nhập vào ô tìm kiếm thay đổi
        clearTimeout(fetchTimeoutId);
        if (searchTerm !== "") {
            // Thiết lập timeout mới để chờ 500ms trước khi thực hiện fetch
            fetchTimeoutId = setTimeout(() => {
                $(".loading").fadeIn("medium");
                fetch('http://localhost:3000/search/' + searchTerm + '/' + sessionStorage.getItem("colFilter"))
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Lỗi không tải được dữ liệu. Mã lỗi: " + response.status);
                        }
                    })
                    .then(data => {
                        if (data.success) {
                            // xử lý dữ liệu trả về khi thành công
                            $(".loading").fadeOut("medium");

                            lengthData = Object.keys(data.data).length;
                            var Last = sessionStorage.getItem("pageNhanVienTable") * sessionStorage.getItem("rowNhanVienTable");
                            var First = Last - sessionStorage.getItem("rowNhanVienTable");
                            setNhanvien(data.data.slice(First, Last));
                            console.log('Số lượng tìm kiếm được: ' + lengthData);

                        } else {
                            // xử lý thông báo lỗi khi không tìm thấy dữ liệu
                            $(".loading").fadeOut("medium");
                            setNhanvien([]);
                            lengthData = 0;
                            $(".Loi").text(data.message)
                            $(".Loi").delay(200).show("medium");
                            setTimeout(() => $(".Loi").delay(200).hide("medium"), 5000);
                        }
                    })
                    .catch(error => {
                        $(".loading").fadeOut("medium");
                        $(".Loi").text("Lỗi. Mã lỗi: " + error)
                        $(".Loi").delay(200).show("medium");
                        setTimeout(() => $(".Loi").delay(200).hide("medium"), 3000);
                        setNhanvien([]);
                    });
            }, 500);
        } else {
            // Nếu giá trị nhập vào ô tìm kiếm là rỗng, hiển thị tất cả dữ liệu
            getData();
            $(".loading").fadeOut("medium");
            setNhanvien([]);
        }
        // Hủy bỏ timeout nếu component bị unmount
        return () => clearTimeout(fetchTimeoutId);
    }, [inputCount]);

    const handleSearch = (event) => {
        //$("#phantrang").css("display","none");
        setSearchTerm(event.target.value.toLowerCase());
        sessionStorage.setItem("pageNhanVienTable", 1);
        setSelectedNode(parseInt(sessionStorage.getItem("pageNhanVienTable")));
        setInputCount((prevInputCount) => prevInputCount + 1);
    };
    //Hết Tìm Kiếm


    //Xử lý Lọc
    const [Filter, setFilter] = useState(sessionStorage.getItem("colFilter"));
    const handleFilter = () => {
        //$("#phantrang").css("display","none");
        setFilter($("#Filter").val());
        sessionStorage.setItem("colFilter", $("#Filter").val());
        //goi lai ham search
        sessionStorage.setItem("pageNhanVienTable", 1);
        setSelectedNode(parseInt(sessionStorage.getItem("pageNhanVienTable")));
        setInputCount((prevInputCount) => prevInputCount + 1);
    }
    //Hết Xử lý Lọc
    //Xử lý sắp xếp
    const handleSort = (columnName) => {
        //console.log(nhanvien.SoHD);
        alert("hàm đang được xử lý")
    };

    //lọc dữ liệu

    return (
        <div >
            <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                <div class="container-fluid py-1 px-3">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="/">VSell</a></li>
                            <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Hoá Đơn</li>
                        </ol>
                    </nav>
                    <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div class="input-group">
                                <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" placeholder="Type here..." />
                            </div>
                        </div>
                        <ul class="navbar-nav  justify-content-end">
                            <li class="nav-item d-flex align-items-center">
                                <a class="btn btn-outline-primary btn-sm mb-0 me-3" target="_blank" href="https://www.creative-tim.com/builder?ref=navbar-soft-ui-dashboard">Online Builder</a>
                            </li>
                            <li class="nav-item d-flex align-items-center">
                                <a href="javascript:;" class="nav-link text-body font-weight-bold px-0">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span class="d-sm-inline d-none"> Chào! Admin  </span>
                                </a>
                            </li>
                            <li class="nav-item px-3 d-flex align-items-center">
                                <a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
                                    <FontAwesomeIcon icon={faCog} />
                                    <span class="d-sm-inline d-none">  </span>
                                </a>
                            </li>
                            <li class="nav-item dropdown pe-2 d-flex align-items-center">
                                <a href="javascript:;" class="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon icon={faBell} />
                                </a>
                                <ul class="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                                    <li class="mb-2">
                                        <a class="dropdown-item border-radius-md" href="javascript:;">
                                            <div class="d-flex py-1">
                                                <div class="my-auto">
                                                    <img src="../assets/img/team-2.jpg" class="avatar avatar-sm  me-3 " />
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="text-sm font-weight-normal mb-1">
                                                        <span class="font-weight-bold">New message</span> from Laur
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0 ">
                                                        <i class="fa fa-clock me-1"></i>
                                                        13 minutes ago
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a class="dropdown-item border-radius-md" href="javascript:;">
                                            <div class="d-flex py-1">
                                                <div class="my-auto">
                                                    <img src="../assets/img/small-logos/logo-spotify.svg" class="avatar avatar-sm bg-gradient-dark  me-3 " />
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="text-sm font-weight-normal mb-1">
                                                        <span class="font-weight-bold">New album</span> by Travis Scott
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0 ">
                                                        <i class="fa fa-clock me-1"></i>
                                                        1 day
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item border-radius-md" href="javascript:;">
                                            <div class="d-flex py-1">
                                                <div class="avatar avatar-sm bg-gradient-secondary  me-3  my-auto">
                                                    icon
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="text-sm font-weight-normal mb-1">
                                                        Payment successfully completed
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0 ">
                                                        <i class="fa fa-clock me-1"></i>
                                                        2 days
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="border-0 border-radius-xl ">


            </div>
            <div class="card mb-4">

                <div class="card-header pb-0">
                    {/* <h4>Bảng Hoá Đơn</h4> */}
                    <h2 >Quản Lý Hoá Đơn</h2>
                    <div>
                        <button style={{ display: "inline-block" }} onClick={() => {
                            setInputCount((prevInputCount) => prevInputCount + 1);
                        }} className="btn btn-primary"><FontAwesomeIcon icon={faRotate} />ㅤLàm Mới Dữ Liệu </button>ㅤ
                        <button style={{ display: "inline-block" }} onClick={isisThem} className="btn btn-primary"><FontAwesomeIcon icon={faAdd} />ㅤThêm Hoá Đơn</button>
                        <div style={{ display: "inline-block", float: 'right' }}>
                            <select class="form-select-sm" value={sessionStorage.getItem("rowNhanVienTable")} id="hienthidulieu" onChange={() => {
                                sessionStorage.setItem("rowNhanVienTable", $("#hienthidulieu").val());
                                sessionStorage.setItem("pageNhanVienTable", 1);
                                setInputCount((prevInputCount) => prevInputCount + 1);
                            }}>
                                <option value="10">Hiển thị: 10</option>
                                <option value="30">Hiển thị: 30</option>
                                <option value="50">Hiển thị: 50</option>
                                <option value="100">Hiển thị: 100</option>
                                <option value={lengthData} >Hiển thị toàn bộ</option>
                            </select>
                            ㅤ
                            <input id="search" value={searchTerm} onChange={handleSearch} placeholder='Tìm Kiếm' type="text" className="form-control-sm" />ㅤ
                            <select class="form-select-sm" value={Filter} id='Filter' onChange={handleFilter}>
                                <option value="SoHD">Tìm Theo Số Hoá Đơn</option>
                                <option value="NgayHD">Tìm Theo Ngày Hoá Đơn</option>
                                <option value="NgayGiao">Tìm Theo Ngày Giao</option>
                                <option value="MaKH">Tìm Theo Mã Khách Hàng</option>
                                <option value="MaNV">Tìm Theo Mã Nhân Viên</option>
                                {/* <option value={lengthData} >Tìm Theo Số Hoá Đơn</option> */}
                            </select>

                            {/* <div  class="input-group">
                                <input onClick={xuLyTimKiem} id="search" placeholder='Tìm Kiếm' type="text" className="form-control-sm" />
                                
                            </div> */}
                        </div>

                    </div>





                </div>
                <div class="card-body px-0 pt-0 pb-2">
                    <div class="table-responsive p-0">
                        <table id="nhanvien" class="table align-items-center mb-0">
                            <thead>
                                <tr style={{textAlign:'center'}}>
                                    <th onClick={() => handleSort('STT')} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">STT ▲</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Số Hoá Đơn ▼</th>
                                    <th id='thTenNV' class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Hoá Đơn</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Ngày Giao</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Khách Hàng</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Mã Nhân Viên</th>
                                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10 ps-2">Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                <img className='loading' style={{ position: "fixed", width: "20%", left: "50%", top: "40%" }} src={loading1}></img>
                                {
                                    nhanvien.map((nhanvien, index) =>
                                        <tr style={{textAlign:'center'}} id='trdata' key={nhanvien.manv}>
                                            <td >{index + 1}</td>
                                            <td >{nhanvien.SoHD}</td>
                                            <td >{nhanvien.NgayHD}</td>
                                            <td >{nhanvien.NgayGiao}</td>
                                            <td >{nhanvien.MaKH}</td>
                                            <td >{nhanvien.MaNV}</td>
                                            <td>
                                                <a /*onMouseOver={hoverText}*/ onClick={() => editData(nhanvien.SoHD)} class='btnEdit'><i class="fas fa-pencil-alt text-dark me-2" aria-hidden="true" /><FontAwesomeIcon icon={faPencil} />
                                                </a>
                                                ㅤㅤ
                                                <a onClick={() => deleteData(nhanvien.SoHD)} class='btnEdit'><FontAwesomeIcon icon={faTrash} /></a>

                                            </td>

                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <div id='phantrang' style={{ textAlign: "center", marginTop: "2%" }}>
                            {buttons}
                        </div>

                    </div>
                </div>
            </div>





            {/* Popup Them Nhan Vien*/}
            {isOpen && <ThemNhanVien
                content={<>
                    <div className="conten-modal">

                        <div>
                            <div style={{ width: '80%' }} className="bg-light px-4 py-3">
                                <h4 id='tieudepop'>Thông Tin Hoá Đơn</h4>
                                <form>
                                    <div className="form-group">
                                        <label>Số Hoá Đơn</label>
                                        <input
                                            id="editSoHD"
                                            type="text"
                                            className="form-control"
                                            readOnly
                                            defaultValue="Được Tạo Tự Động"
                                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày Hoá Đơn</label>
                                        <input id="editNgayHD" type="date" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày Giaoㅤㅤ</label>
                                        <input id="editNgayGiao" type="date" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Mã Khách Hàng</label>
                                        <select id="editMaKH">
                                            <option value="2">2 Cơ sở dân dụng</option>
                                            <option value="3">3 Công nghệ mới</option>
                                            <option value="4">4 Công nghiệp cao su</option>
                                        </select>

                                    </div>
                                    <div className="form-group" id="an2">
                                        <label>Mã Nhân Viênㅤㅤ</label>
                                        <select id="editMaNV">
                                            <option value="7">7 Lâm Sơn Hoàng</option>
                                            <option value="9">9 Vương Ngọc</option>
                                            <option value="1">1 Nguyễn Ngọc Nga</option>
                                        </select>
                                    </div>
                                    <button onClick={xacnhan} style={{ float: "right" }} type="button" className="btn btn-primary mt-3" id="xacnhan">Xác Nhận</button>

                                    <button onClick={togglePopup} type="button" className="btn btn-danger mt-3" id="send">Huỷ Bỏ</button>

                                </form>
                            </div>
                        </div>
                    </div>
                </>}
                handleClose={togglePopup}
            />}
            {/*End Popup Them Nhan Vien*/}

            {/* Popup Them Thanh Cong*/}
            {<ThongBao
                content={<>
                    <div>
                        <button style={{ display: "none", width: "70%" }} className="btn btn-success ThanhCong"><FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button onClick={undoDelete} style={{ display: "none", width: "20%" }} className="btn btn-success HoanTac"><FontAwesomeIcon icon={faRotateLeft} /></button>
                    </div>
                </>}

            />}
            {/*End Popup Thanh Cong*/}
            {/* Popup Them Thanh Cong*/}
            {<ThongBao
                content={<>
                    <button style={{ display: "none", width: "100%" }} className="btn btn-danger Loi"><FontAwesomeIcon icon={faXmark} /></button>
                </>}

            />}
            {/*End Popup Thanh Cong*/}

        </div>

    );
}

export default HoaDon