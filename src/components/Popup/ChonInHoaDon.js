import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlInsertInvoice, urlGetInvoice, urlUpdateInvoice, urlGetProduct, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faIdCard, faBell, faClone, faFile, faPencil, faTable, faTag, faCheckCircle, faCheck } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faMinusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { arialFont } from "../Font";

import logo from '../../assets/img/logos/logo-removebg-preview.png';
import TabChonBan from "./ChonBan";
import TabChonMon from "./ChonMon";

const ChonInHoaDon = (props) => {
    //Xuất file PDF
    const exportPDF = () => {
        // Tạo đối tượng PDF
        const doc = new jsPDF();
        doc.addFileToVFS("Arial.ttf", arialFont);
        doc.addFont("Arial.ttf", "Arial", "normal");
        doc.setFont("Arial");

        var font = doc.getFont();


        // Thêm nội dung vào PDF
        doc.text('Danh Sách Nhân Viên', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
        // doc.autoTable({
        //     head: [['ID Nhân Viên', 'Tên Nhân Viên', 'Vị Trí Công Việc', 'Ngày Sinh', 'Giới Tính', 'Địa Chỉ', 'Số Điện Thoại', 'Tình Trạng', 'Ngày Vào']],
        //     body: data.map(item => [item.IDNhanVien, item.TenNhanVien, item.TenViTriCongViec, item.NgaySinh, item.GioiTinh, item.DiaChi, item.SoDienThoai, item.TinhTrang, item.NgayVao]),
        //     startY: 30,
        //     theme: 'grid',
        //     styles: {
        //         fontSize: 12,
        //         cellPadding: 5,
        //         halign: 'center',
        //         valign: 'middle',
        //         font: 'Arial'
        //     },
        //     columnStyles: {
        //         0: { cellWidth: 35 },
        //         1: { cellWidth: 35 },
        //         2: { cellWidth: 35 },
        //         3: { cellWidth: 35 },
        //         4: { cellWidth: 35 },
        //         5: { cellWidth: 35 },
        //         6: { cellWidth: 35 },
        //         7: { cellWidth: 35 },
        //         8: { cellWidth: 35 },
        //     },

        // });

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
    useEffect(() => {
        exportPDF()
    }, []);
    return (
        <div className="full-popup-box">
            <div className="full-box" style={{ overflowY: 'hidden' }}>
                <div className="" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '30% ' }}>
                        <div style={{ textAlign: "center" }}>
                            <div>
                                <img style={{
                                    maxWidth: '120px',

                                }} src={logo} class="navbar-brand-img h-200" alt="main_logo" />
                            </div>
                            <div style={{ borderBottom: '1px grey dashed', marginBottom: '4px' }}></div>
                            <p>Nhà Hàng VRes, 36 Huỳnh Văn Nghệ, KP9 P.Bửu Long, Thành Phố Biên Hoà, Tỉnh Đồng Nai Việt Nam 1675467846</p>
                            <h4>Hoá Đơn Bán Hàng</h4>
                        </div>
                        <div className="row" style={{ marginLeft: '1%' }}>
                            <div className="col-6" style={{ float: 'left' }}>
                                <p>Ngày Bán: </p>
                                <p>Hoá Đơn: </p>
                            </div>
                            <div className="col-6" style={{ float: 'right' }}>
                                <p>Nhân Viên: </p>
                                <p>Khách Hàng: </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
};
// Ghi Chú, Khu Vực
export default ChonInHoaDon;