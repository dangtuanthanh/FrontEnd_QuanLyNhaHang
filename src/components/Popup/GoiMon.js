import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlInsertInvoice, urlGetInvoice, urlUpdateInvoice, urlGetProduct, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faIdCard, faTrashAlt, faBell, faClone, faFile, faPencil, faTable, faTag, faCheckCircle, faCheck, faPrint, faSpinner, faCheckToSlot, faBan } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faMinusSquare } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { arialFont } from "../Font";
import logo from '../../assets/img/logos/logo-removebg-preview.png';
import TabChonBan from "./ChonBan";
import TabChonMon from "./ChonMon";
import ChonKhachHang from "./ChonKhachHang";
import ChonGiamGia from "./ChonGiamGia";
import ChonTachGhep from "./ChonTachGhep";
import ChonThanhToan from "./ChonThanhToan";
import ChonInHoaDon from "./ChonInHoaDon";
const GoiMon = (props) => {
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        IDNhanVien: props.thongTinDangNhap.IDNhanVien,
        DanhSach: []
    });
    const [dataUser, setDataUser] = useState(0)
    const [popupChonKhachHang, setPopupChonKhachHang] = useState(false);

    const [popupChonGiamGia, setPopupChonGiamGia] = useState(false);
    const [popupTachGhep, setPopupTachGhep] = useState(false);
    const [popupChonThanhToan, setPopupChonThanhToan] = useState(false);
    const [popupChonInHoaDon, setPopupChonInHoaDon] = useState(false);
    const [styleButton, setStyleButton] = useState(false);
    const [tongTien, setTongTien] = useState(0);
    useEffect(() => {
        console.log('dữ liệu gửi đi: dataReq chính ', dataReq);
        setTongTien(dataReq.DanhSach.reduce((total, item) => {
            return total + item.SoLuong * item.GiaBan;
        }, 0))
    }, [dataReq]);
    // useEffect(() => {
    //     props.addNotification('Bạn vừa cập nhật Hoá Đơn. Bấm "Thông Báo Bếp" để lưu mọi thay đổi', 'success', 3000)
    // }, [dataReq.DanhSach]);
    const tabs = {
        tab1: 'TabChonBan',
        tab2: 'TabChonMon',
        tab3: 'TabDonViTinh'
    }

    const [activeTab, setActiveTab] = useState(() =>
        props.iDAction ? tabs.tab2 : tabs.tab1
    );

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabChonBan;
    }

    if (activeTab === tabs.tab2) {
        TabComponent = TabChonMon;
    }
    // if (activeTab === tabs.tab3) {
    //     TabComponent = TabDonViTinh;
    // }



    // Phân tách dữ liệu thành các dòng
    const lines = JSON.stringify(dataReq)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    /*xử lý phần chi tiết*/
    function handleDetailChange(ID, value, TenCot) {
        const index = dataReq.DanhSach.findIndex(
            item => {
                return item.IDSanPham === ID;
            }
        );
        dataReq.DanhSach[index][TenCot] = value
        setDataReq({
            ...dataReq,
            DanhSach: [...dataReq.DanhSach]
        })
    }

    useEffect(() => {
        if (props.iDAction) {
            dispatch({ type: 'SET_LOADING', payload: true })

            fetch(`${urlGetInvoice}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error', response.message);
                    }
                    return response.json();
                })
                .then(data => {
                    setDataReq(data);
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                    dispatch({ type: 'SET_LOADING', payload: false })
                });
        }
    }, [dataUser]);
    const InHoaDon = (data) => {
        // Tạo đối tượng PDF
        const doc = new jsPDF();
        doc.addFileToVFS("Arial.ttf", arialFont);
        doc.addFont("Arial.ttf", "Arial", "normal");
        doc.setFont("Arial");

        var font = doc.getFont();


        // Thêm nội dung vào PDF
        // Thêm hình 
        doc.addImage(logo, 'PNG', (doc.internal.pageSize.width - 50) / 2, 10, 50, 20);
        const y = 10
        doc.setFontSize(10);
        doc.text('Nhà Hàng VRes, 36 Huỳnh Văn Nghệ, KP9 P.Bửu Long,\nThành Phố Biên Hoà, Tỉnh Đồng Nai Việt Nam 1675467846', doc.internal.pageSize.getWidth() / 2, y + 25, { align: 'center', fontSize: 9 });
        doc.setFontSize(20);
        doc.text('HOÁ ĐƠN BÁN HÀNG', doc.internal.pageSize.getWidth() / 2, y + 45, { align: 'center' });
        doc.setFontSize(13);
        const date = new Date();
        function format(n) {
            return n < 10 ? '0' + n : n
        }
        const dateString = `${format(date.getDate())}/${format(date.getMonth() + 1)}/${format(date.getFullYear())} ${format(date.getHours())}:${format(date.getMinutes())}:${format(date.getSeconds())}`

        doc.text(`Ngày Bán: ${dateString}`, 20, y + 55);
        doc.text(`Hoá Đơn: ${dataReq.IDHoaDon}`, 20, y + 61);
        doc.text(`Nhân Viên: ${dataReq.IDNhanVien}`, doc.internal.pageSize.getWidth() - 55, y + 55);
        // doc.text('Nhân Viên:', doc.internal.pageSize.getWidth() - 55, y + 61);
        // ...
        doc.autoTable({
            head: [['Mặt Hàng', 'Đơn Giá', 'Số Lượng', 'Thành Tiền']],
            body: data.map(item => [item.TenSanPham, item.GiaBan, item.SoLuong, (item.GiaBan * item.SoLuong)]),
            startY: y + 66,
            theme: 'grid',
            styles: {
                fontSize: 12,
                cellPadding: 5,
                halign: 'center',
                valign: 'middle',
                font: 'Arial'
            },
            columnStyles: {
                0: { cellWidth: 35 },
                1: { cellWidth: 35 },
                2: { cellWidth: 35 },
                3: { cellWidth: 35 }
            },

        });

        // Thêm dòng chữ Ngày xuất file vào cuối trang
        const lastPage = doc.internal.getNumberOfPages();
        doc.setPage(lastPage);
        doc.text(`Ngày xuất file: ${new Date().toLocaleString()}`, 10, doc.internal.pageSize.getHeight() - 10);

        // // Tải xuống file PDF
        // doc.save('DanhSachNhanVien.pdf');
        doc.autoPrint();
        //This is a key for printing
        doc.output('dataurlnewwindow');

    };

    //xử lý thông báo bếp
    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.IDNhanVien && dataReq.DanhSach.length > 0) {
            dispatch({ type: 'SET_LOADING', payload: true })
            if (props.isInsert === true) {
                fetch(urlInsertInvoice, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(dataReq)
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        }
                    })
                    .then(data => {
                        props.addNotification('Bếp đã nhận được thông báo', 'success', 3000)
                        props.setdataUser({ ...props.dataUser, search: '', sortBy: 'IDHoaDon', sortOrder: 'desc' })
                        props.setPopupInsertUpdate(false)
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
            }
            else {
                fetch(urlUpdateInvoice, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(dataReq)
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
                        props.addNotification('Bếp đã nhận được thông báo', 'success', 3000)
                        props.setdataUser({ ...props.dataUser })
                        setDataUser(dataUser + 1)
                        //ẩn loading
                        dispatch({ type: 'SET_LOADING', payload: false })
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        console.log('error', error);
                        if (error instanceof TypeError) {
                            props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            props.addNotification(error.message, 'warning', 5000)
                        }

                    });
            }
        }
        else props.openPopupAlert('Vui lòng chọn ít nhất một món ăn')

    }
    
    return (
        <div className="full-popup-box">
            <div className="full-box" style={{ overflowY: 'hidden' }}>
                <div className="row">
                    <div className="col-8 card">
                        <ul class="nav nav-tabs col-6">
                            <li class="nav-item">
                                <button class="nav-link " onClick={() => {
                                    props.setPopupInsertUpdate(false)

                                }}>
                                    {"<<"}
                                </button>
                            </li>
                            <li class="nav-item">
                                <button
                                    className={activeTab === 'TabChonBan' ? 'nav-link active' : 'nav-link'}
                                    onClick={() => handleTabClick(tabs.tab1)}>Bàn</button>
                            </li>
                            <li class="nav-item">
                                <button
                                    className={activeTab === 'TabChonMon' ? 'nav-link active' : 'nav-link'}
                                    onClick={() => {
                                        if (dataReq.IDBan) {
                                            handleTabClick(tabs.tab2)
                                        } else
                                            props.addNotification('Vui lòng chọn một bàn ăn', 'warning', 5000)

                                    }}>Chọn Món</button>
                            </li>
                            {/* <li class="nav-item">
                                        <button
                                            className={activeTab === 'TabDonViTinh' ? 'nav-link active' : 'nav-link'}
                                            onClick={() => handleTabClick(tabs.tab3)}>Đơn Vị Tính</button>
                                    </li> */}
                        </ul>
                        <TabComponent
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            dataReq={dataReq}
                            setDataReq={setDataReq}
                            setActiveTab={setActiveTab}
                            handleDetailChange={handleDetailChange}

                        />

                    </div>
                    <div className="col-4 card">
                        {dataReq.IDBan ? <div>
                            <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Hoá Đơn  <span style={{ color: 'blue' }}>{props.iDAction}</span></h3>
                            <div className="row" style={{ marginLeft: '2%' }}>
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ width: '85%' }}
                                        className="btn btn-light btn-sm"
                                        onClick={() => handleTabClick(tabs.tab1)}
                                    ><FontAwesomeIcon icon={faTable} style={{
                                        marginRight: '4px'
                                    }} />{dataReq.TenBan} / {
                                            dataReq.TenKhuVuc.length > 6
                                                ? dataReq.TenKhuVuc.slice(0, 6) + '...'
                                                : dataReq.TenKhuVuc
                                        }</button>
                                </div>
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ width: '85%' }}
                                        className="btn btn-light btn-sm"
                                        onClick={() => { setPopupChonKhachHang(true) }}
                                    >
                                        {dataReq.TenKhachHang ? (
                                            <>
                                                <FontAwesomeIcon icon={faIdCard} style={{
                                                    marginRight: '4px'
                                                }} />
                                                {
                                                    dataReq.TenKhachHang.length > 12
                                                        ? dataReq.TenKhachHang.slice(0, 12) + '...'
                                                        : dataReq.TenKhachHang
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faIdCard} style={{
                                                    marginRight: '4px'
                                                }} />Chọn Khách Hàng
                                            </>
                                        )}
                                    </button>
                                    
                                </div>
                            </div>

                            <div style={{ height: '550px', maxHeight: '60%', overflow: 'auto', overflowX: 'hidden' }}>
                                {dataReq.DanhSach.length > 0 ? <div>
                                    {dataReq.DanhSach.map((item, index) => (
                                        <div key={item.IDSanPham}
                                            className="row card-body"
                                            style={{ paddingBottom: '0', boxShadow: '0 20px 27px 0 rgba(0,0,0,.05)', borderRadius: '30px' }}
                                        >
                                            <div className="col-6">
                                                <h6>{index + 1}. {item.TenSanPham} </h6>
                                                <label
                                                    onClick={() => {
                                                        let GhiChuMonAn = null
                                                        if (item.GhiChu) {
                                                            GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:", item.GhiChu.toString());
                                                        } else {
                                                            GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:");
                                                        }

                                                        if (GhiChuMonAn) {
                                                            handleDetailChange(item.IDSanPham,
                                                                GhiChuMonAn,
                                                                'GhiChu'
                                                            )
                                                        }
                                                    }}
                                                    style={{ color: '#9d9d9d' }}
                                                >
                                                    {item.GhiChu ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faFile} style={{
                                                                marginRight: '4px'
                                                            }} />
                                                            {
                                                                item.GhiChu.length > 20
                                                                    ? item.GhiChu.slice(0, 20) + '...'
                                                                    : item.GhiChu
                                                            }
                                                        </>
                                                    ) : <><FontAwesomeIcon icon={faFile} style={{
                                                        marginRight: '4px'
                                                    }} />
                                                        Nhập Ghi Chú / Món Thêm
                                                    </>
                                                    }
                                                </label>
                                            </div>
                                            <div className="col-2"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '20px'
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faMinusSquare}
                                                        style={{ fontSize: '20px' }}
                                                        onClick={() => {
                                                            if (item.SoLuong !== 1) {
                                                                if (item.IDTrangThai != 1) {
                                                                    props.addNotification('Bạn không thể giảm số lượng vì sản phẩm đã được chế biến xong', 'warning', 5000)
                                                                } else {
                                                                    handleDetailChange(item.IDSanPham, item.SoLuong - 1, 'SoLuong')
                                                                }
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
                                                            if (SoLuong) {
                                                                handleDetailChange(item.IDSanPham,
                                                                    SoLuong,
                                                                    'SoLuong'
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        {item.SoLuong}
                                                    </div>

                                                    <FontAwesomeIcon
                                                        icon={faSquarePlus}
                                                        style={{ fontSize: '20px' }}
                                                        onClick={() => {
                                                            handleDetailChange(item.IDSanPham, item.SoLuong + 1, 'SoLuong')
                                                        }}
                                                    />
                                                </div>


                                            </div>
                                            <div className="col-3">
                                                <strong
                                                    style={{
                                                        fontSize: '13px',
                                                        margin: '0 5px',
                                                        float: 'right'
                                                    }}
                                                >
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                    }).format(item.GiaBan)}
                                                </strong>
                                                <label
                                                    style={{
                                                        fontSize: '17px',
                                                        margin: '0 5px',
                                                        float: 'right'
                                                    }}
                                                >
                                                    {new Intl.NumberFormat('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                        // }).format(item.ThanhTien)}
                                                    }).format(item.GiaBan * item.SoLuong)}
                                                </label>
                                            </div>
                                            <div className="col-1" style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                flexWrap: 'wrap',
                                                borderLeft: '2px #bebaba solid',
                                                justifyContent: 'center'
                                            }}>
                                                <FontAwesomeIcon
                                                    icon={
                                                        item.IDTrangThai === 1 ? faSpinner :
                                                            item.IDTrangThai === 2 ? faCheckToSlot :
                                                                item.IDTrangThai === 3 ? faCheck :
                                                                    item.IDTrangThai === 4 ? faBan :
                                                                        null
                                                    }
                                                    style={{ fontSize: '20px' }}
                                                    onClick={() => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            DanhSach: dataReq.DanhSach.filter(newitem => newitem.IDSanPham !== item.IDSanPham)
                                                        })
                                                    }}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                    style={{ fontSize: '20px' }}
                                                    onClick={() => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            DanhSach: dataReq.DanhSach.filter(newitem => newitem.IDSanPham !== item.IDSanPham)
                                                        })
                                                    }}
                                                />
                                            </div>
                                            <hr></hr>
                                        </div>
                                    ))}
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
                                        Đã chọn: {lines.map(line => <div>{line}</div>)}
                                    </pre> */}
                                </div>
                                    : <div style={{
                                        position: 'absolute',
                                        top: '40%',
                                        left: '15%'
                                    }}>
                                        <h3 style={{ color: 'gray' }} >Vui lòng chọn một món ăn</h3>
                                    </div>
                                }
                            </div>





                            <div style={{ width: '100%' }}>
                                <div style={{ width: '100%', float: 'right' }}>

                                    <p style={{ float: 'left', marginLeft: '2%', marginBottom: '0px' }}>
                                        <strong style={{
                                            fontSize: '20px',
                                            color: 'black',
                                            marginRight: '4px'
                                        }}>
                                            {
                                                dataReq.DanhSach.reduce((total, item) => {
                                                    return total + item.SoLuong;
                                                }, 0)

                                            }
                                        </strong>
                                        {dataReq.GiamGia ? 'SP' : 'Sản Phẩm'}
                                    </p>
                                    {(dataReq.GiamGia) &&
                                        <p style={{ float: 'right', marginLeft: '2%', marginBottom: '0px' }}>
                                            Tổng Tiền Sau Khi Giảm:  <strong style={{
                                                fontSize: '20px',
                                                color: 'black',
                                                marginRight: '5px'
                                            }}>

                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(tongTien -
                                                    (dataReq.PhuongThucGiamGia === 'Phần Trăm'
                                                        ? tongTien * (dataReq.GiamGia / 100)
                                                        : dataReq.GiamGia)
                                                        - (dataReq.SuDungDiemKhachHang == true ? dataReq.DiemKhachHang :0)
                                                        )}
                                            </strong>

                                        </p>
                                    }
                                    {!dataReq.GiamGia && <p style={{ float: 'right', marginBottom: '0px' }}>
                                        Tổng Tiền:  <strong style={{
                                            fontSize: '20px',
                                            color: 'black',
                                            marginRight: '5px'
                                        }}>

                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(tongTien)}
                                        </strong>
                                    </p>
                                    }
                                </div>
                            </div>

                            <div className="row" style={{ marginLeft: '2%' }}>

                                <div className="col-6" style={{
                                    padding: '0'
                                }}>
                                    {/* Ghi chú bàn ăn */}
                                    <button
                                        className="btn btn-light btn-sm"
                                        onClick={() => {
                                            let GhiChu = null
                                            if (dataReq.GhiChu) {
                                                GhiChu = prompt("Nhập Ghi Chú Cho Bàn Ăn:", dataReq.GhiChu.toString());
                                            } else {
                                                GhiChu = prompt("Nhập Ghi Chú Cho Bàn Ăn:");
                                            }

                                            if (GhiChu) {
                                                setDataReq({
                                                    ...dataReq,
                                                    GhiChu: GhiChu
                                                })
                                            }
                                        }}
                                        style={{
                                            width: props.isInsert ? '85%' : '85%',
                                            ...(props.isInsert
                                                ? {}
                                                : {
                                                    height: '25px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '6px'
                                                })
                                        }}
                                    >
                                        {dataReq.GhiChu ? (
                                            <>
                                                <FontAwesomeIcon icon={faPencil} style={{
                                                    marginRight: '4px'
                                                }} />
                                                {
                                                    dataReq.GhiChu.length > 10
                                                        ? dataReq.GhiChu.slice(0, 10) + '...'
                                                        : dataReq.GhiChu
                                                }

                                            </>
                                        ) : <><FontAwesomeIcon icon={faPencil} style={{
                                            marginRight: '4px'
                                        }} />
                                            Ghi Chú
                                        </>
                                        }
                                    </button>
                                    {/* In hoá đơn */}
                                    {dataReq.TrangThaiThanhToan &&
                                        <button
                                            style={{ marginBottom: '10px', width: '85%', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            className="btn btn-light btn-sm"
                                            onClick={() => {
                                                InHoaDon(dataReq.DanhSach)
                                            }}

                                        >
                                            <><FontAwesomeIcon icon={faPrint} style={{
                                                marginRight: '4px'
                                            }} />
                                                In
                                            </>

                                        </button>}

                                </div>
                                <div className="col-6" style={{ padding: '0' }}>
                                    {/* Giảm giá */}
                                    <button
                                        style={{
                                            width: props.isInsert ? '85%' : '85%',
                                            ...(props.isInsert
                                                ? {}
                                                : {
                                                    height: '25px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '6px'
                                                })
                                        }}
                                        className="btn btn-light btn-sm"
                                        onClick={() => {
                                            setPopupChonGiamGia(true)
                                        }}
                                    >
                                        {dataReq.GiamGia ? (
                                            <>
                                                <FontAwesomeIcon icon={faTag} style={{
                                                    marginRight: '4px'
                                                }} />

                                                {dataReq.GiamGia.length > 6
                                                    ? '- ' + dataReq.GiamGia.slice(0, 6) + '...'
                                                    : '- ' + dataReq.GiamGia
                                                }

                                                {dataReq.PhuongThucGiamGia === 'Phần Trăm' ? '%' : 'đ'}

                                            </>
                                        ) : <><FontAwesomeIcon icon={faTag} style={{
                                            marginRight: '4px'
                                        }} />
                                            Giảm Giá
                                        </>
                                        }
                                    </button>
                                    {/* Tách Ghép */}
                                    {!props.isInsert && <button
                                        style={{ width: '85%', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}
                                        className="btn btn-light btn-sm"
                                        onClick={() => {
                                            setPopupTachGhep(
                                                dataReq.DanhSach.length > 1
                                                    ? true
                                                    : dataReq.DanhSach[0]?.SoLuong > 1
                                                        ? true
                                                        : props.openPopupAlert('Không đủ số lượng món ăn để tách ghép')
                                            )
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faClone} style={{
                                            marginRight: '4px'
                                        }} /> Tách/Ghép
                                    </button>
                                    }
                                </div>
                            </div>

                            <div className="row" style={{ marginLeft: '2%' }}>
                                {/* Thanh toán */}
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ width: '85%', backgroundColor: dataReq.TrangThaiThanhToan && 'grey' }}
                                        className="btn btn-success"
                                        onClick={() => {
                                            if (!dataReq.TrangThaiThanhToan)
                                                setPopupChonThanhToan(true)
                                            else props.addNotification('Hoá đơn này đã được thanh toán', 'success', 3000)
                                        }}
                                    >
                                        {dataReq.TrangThaiThanhToan ? (
                                            <>
                                                <FontAwesomeIcon icon={faCheck} style={{
                                                    marginRight: '4px'
                                                }} />
                                                {dataReq.ThanhToanChuyenKhoan
                                                    ? 'Đã TT Chuyển Khoản'
                                                    : 'Đã TT Tiền Mặt'
                                                }
                                            </>
                                        ) : <><FontAwesomeIcon icon={faDollarSign} style={{
                                            marginRight: '4px'
                                        }} />
                                            Thanh Toán
                                        </>
                                        }</button>
                                </div>
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ width: '85%' }}
                                        className="btn btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} style={{
                                            marginRight: '4px'
                                        }} />Lưu và Báo Bếp
                                    </button>
                                </div>
                            </div>
                        </div>
                            : <div style={{
                                position: 'absolute',
                                top: '40%',
                                left: '15%'
                            }}>
                                <h3 style={{ color: 'gray' }} >Vui lòng chọn một bàn ăn</h3>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {popupChonKhachHang && <div className="popup">
                <ChonKhachHang
                    addNotification={props.addNotification}
                    openPopupAlert={props.openPopupAlert}
                    dataReq={dataReq}
                    setDataReq={setDataReq}
                    setPopupChonKhachHang={setPopupChonKhachHang}
                />
            </div>}
            {popupChonGiamGia && <div className="popup">
                <ChonGiamGia
                    addNotification={props.addNotification}
                    openPopupAlert={props.openPopupAlert}
                    dataReq={dataReq}
                    setDataReq={setDataReq}
                    setPopupChonGiamGia={setPopupChonGiamGia}
                    dataUser={dataUser}
                    setDataUser={setDataUser}
                    isInsert={props.isInsert}
                />
            </div>}
            {popupChonThanhToan && <div className="popup">
                <ChonThanhToan
                    addNotification={props.addNotification}
                    openPopupAlert={props.openPopupAlert}
                    dataReq={dataReq}
                    setDataReq={setDataReq}
                    setPopupChonThanhToan={setPopupChonThanhToan}
                    dataUser={props.dataUser}
                    setdataUser={props.setdataUser}
                    isInsert={props.isInsert}
                    loadTrang={dataUser}
                    setLoadTrang={setDataUser}
                    setPopupInsertUpdate={props.setPopupInsertUpdate}
                />
            </div>}
            {popupTachGhep && <div className="popup">
                <ChonTachGhep
                    addNotification={props.addNotification}
                    openPopupAlert={props.openPopupAlert}
                    dataReq={dataReq}
                    setDataReq={setDataReq}
                    setPopupTachGhep={setPopupTachGhep}
                    IDNhanVien={props.thongTinDangNhap.IDNhanVien}
                    dataUser={dataUser}
                    setDataUser={setDataUser}
                    setPopupInsertUpdate={props.setPopupInsertUpdate}
                />
            </div>}
            {popupChonInHoaDon && <div className="popup">
                <ChonInHoaDon
                    addNotification={props.addNotification}
                    openPopupAlert={props.openPopupAlert}
                    dataReq={dataReq}
                    setDataReq={setDataReq}
                    setPopupTachGhep={setPopupTachGhep}
                    IDNhanVien={props.thongTinDangNhap.IDNhanVien}
                    dataUser={dataUser}
                    setDataUser={setDataUser}
                    setPopupInsertUpdate={props.setPopupInsertUpdate}
                />
            </div>}
        </div>

    );
};
// Ghi Chú, Khu Vực
export default GoiMon;