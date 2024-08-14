import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlGetInvoice} from "../url"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard, faArrowLeft, faBell, faClone, faFile, faPencil, faTable, faTag, faCheckCircle, faCheck, faPrint, faSpinner, faCheckToSlot, faBan } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faMinusSquare } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { arialFont } from "../Font";
import logo from '../../assets/img/logos/logo.png';
import TabChonBan from "./ChonBan";
import TabChonMon from "./ChonMon";
import ChonKhachHang from "./ChonKhachHang";
import ChonGiamGia from "./ChonGiamGia";
import ChonTachGhep from "./ChonTachGhep";
import ChonThanhToan from "./ChonThanhToan";
import ChonInHoaDon from "./ChonInHoaDon";
const GoiMonThanhToan = (props) => {
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
                    'iddoitac': getCookie('IDDoiTac'),
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
                0: { cellWidth: 45 },
                1: { cellWidth: 35 },
                2: { cellWidth: 35 },
                3: { cellWidth: 35 }
            },
            didDrawPage: function (data) {
                // Lấy vị trí Y của kết thúc bảng
                const tableEndY = data.cursor.y;
                
                // Thêm dòng tổng tiền ngay sau bảng
                doc.text(`Tổng tiền: ${dataReq.TongTien}`, 10, tableEndY + 10); // Thêm dòng tổng tiền cách bảng 10px
            
                // Thêm dòng chữ Ngày xuất file ngay sau dòng tổng tiền
                doc.text(`Ngày xuất file: ${new Date().toLocaleString()}`, 10, tableEndY + 20); // Thêm dòng ngày xuất file cách dòng tổng tiền 10px
              }
        });
        // // Thêm dòng chữ Ngày xuất file vào cuối trang
        // const lastPage = doc.internal.getNumberOfPages();
        // doc.setPage(lastPage);
        // const pageHeight = doc.internal.pageSize.getHeight();
        // doc.text(`Tổng tiền: ${tongTien}`, 10, pageHeight - 20); // Thêm tổng tiền ở vị trí cách 20px từ đáy trang

        // // Thêm dòng chữ Ngày xuất file vào cuối trang
        // doc.text(`Ngày xuất file: ${new Date().toLocaleString()}`, 10, pageHeight - 10); // Thêm ngày xuất file ở vị trí cách 10px từ đáy trang


        // // Tải xuống file PDF
        // doc.save('DanhSachNhanVien.pdf');
        doc.autoPrint();
        //This is a key for printing
        doc.output('dataurlnewwindow');

    };

    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="full-popup-box">
            <div className="full-box" style={{ overflowY: 'hidden' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className={`${isMobile ? 'col-12 card' : 'col-6 card'}`}>
                        {dataReq.IDBan ? <div>
                            <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Hoá Đơn <span style={{ color: 'blue' }}>{props.iDAction}</span></h3>
                            <div className="row" style={{ marginLeft: '2%' }}>
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ width: '85%' }}
                                        className="btn btn-light btn-sm"
                                    // onClick={() => handleTabClick(tabs.tab1)}
                                    ><FontAwesomeIcon icon={faTable} style={{
                                        marginRight: '4px'
                                    }} />{dataReq.TenBan} / {
                                        (dataReq.TenKhuVuc && dataReq.TenKhuVuc.length > 10)
                                                ? dataReq.TenKhuVuc.slice(0, 10) + '...'
                                                : dataReq.TenKhuVuc
                                        }</button>
                                </div>
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ width: '85%' }}
                                        className="btn btn-light btn-sm"
                                    // onClick={() => { setPopupChonKhachHang(true) }}
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
                                                }} />Khách Tham Quan
                                            </>
                                        )}
                                    </button>

                                </div>
                            </div>

                            <div style={{ height: dataReq.SuDungDiemKhachHang ? '450px' : '550px', maxHeight: '60%', overflow: 'auto', overflowX: 'hidden' }}>
                                {dataReq.DanhSach.length > 0 ? <div>
                                    {dataReq.DanhSach.map((item, index) => (
                                        <div key={item.IDSanPham}
                                            className="row card-body"
                                            style={{ paddingBottom: '0', boxShadow: '0 20px 27px 0 rgba(0,0,0,.05)', borderRadius: '30px' }}
                                        >
                                            <div className="col-6">
                                                <h6>{index + 1}. {item.TenSanPham} </h6>
                                                <label
                                                    // onClick={() => {
                                                    //     let GhiChuMonAn = null
                                                    //     if (item.GhiChu) {
                                                    //         GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:", item.GhiChu.toString());
                                                    //     } else {
                                                    //         GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:");
                                                    //     }

                                                    //     if (GhiChuMonAn) {
                                                    //         handleDetailChange(item.IDSanPham,
                                                    //             GhiChuMonAn,
                                                    //             'GhiChu'
                                                    //         )
                                                    //     }
                                                    // }}
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
                                                        Không có ghi chú
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
                                                        fontSize: '1.3rem'
                                                    }}
                                                >


                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            fontSize: '1.3rem',
                                                            margin: '0 5px'
                                                        }}
                                                    >
                                                        {item.SoLuong}
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="col-3">
                                                <strong
                                                    style={{
                                                        fontSize: '0.9rem',
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
                                                        fontSize: '1.2rem',
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
                                {dataReq.GiamGia &&
                                    <label style={{ color: 'grey', fontSize: '1rem' }}>Hoá đơn này đang được giảm giá:
                                        {dataReq.GiamGia.length > 12
                                            ? ' ' + dataReq.GiamGia.slice(0, 12) + '...'
                                            : ' ' + dataReq.GiamGia
                                        }

                                        {dataReq.PhuongThucGiamGia === 'Phần Trăm' ? '%' : 'đ'}
                                    </label>
                                }
                                {dataReq.SuDungDiemKhachHang &&
                                    <label style={{ color: 'grey', fontSize: '1rem' }}>Hoá đơn này đang sử dụng điểm khách hàng với số điểm: {dataReq.DiemKhachHang}</label>
                                }

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
                                                }).format(dataReq.TongTien)}
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
                                            }).format(dataReq.TongTien)}
                                        </strong>
                                    </p>
                                    }
                                </div>
                            </div>

                            <div className="row" style={{ marginLeft: '2%' }}>

                                <div className="col-6"
                                    style={{ padding: '0' }}>
                                    <button
                                        class="btn btn-danger"
                                        onClick={() => {
                                            props.setPopupInsertUpdate(false)
                                        }}
                                        style={{
                                            marginBottom: '10px',
                                            width: '85%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <><FontAwesomeIcon icon={faArrowLeft} style={{
                                            marginRight: '4px'
                                        }} />
                                            Đóng
                                        </>

                                    </button>
                                </div>
                                <div className="col-6" style={{ padding: '0' }}>
                                    <button
                                        style={{ marginBottom: '10px', width: '85%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        className="btn btn-primary"
                                        onClick={() => {
                                            InHoaDon(dataReq.DanhSach)
                                        }}

                                    >
                                        <><FontAwesomeIcon icon={faPrint} style={{
                                            marginRight: '4px'
                                        }} />
                                            In
                                        </>

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
export default GoiMonThanhToan;