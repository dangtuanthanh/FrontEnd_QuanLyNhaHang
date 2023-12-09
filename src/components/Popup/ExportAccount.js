import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { urlGetAccount } from "../url";
import { getCookie } from "../Cookie";
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { arialFont } from "../Font";
const ExportAccount = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    const [dinhDangXuat, setDinhDangXuat] = useState('excel');
    const [cheDoXuat, setCheDoXuat] = useState('pageCurrent');
    // const [isExporting, setIsExporting] = useState(false);
    // //xử lý định dạng file xuất
    const handleFileFormat = (event) => {
        setDinhDangXuat(event.target.value);
    };
    const handleExportMode = (event) => {
        setCheDoXuat(event.target.value);
    };
    // //hàm xử lý lựa chọn
    const submitExport = () => {
        dispatch({type: 'SET_LOADING', payload: true})
        //xử lý lại ngày tháng
        const data = props.duLieuHienThi.map(row => {
            const ngaySinh = typeof row.NgaySinh === 'string' ? new Date(row.NgaySinh) : row.NgaySinh;
            const ngayVao = typeof row.NgayVao === 'string' ? new Date(row.NgayVao) : row.NgayVao;
            return {
                ...row,
                NgaySinh: ngaySinh.toISOString().split("T")[0],
                NgayVao: ngayVao.toISOString().split("T")[0]
            }
        })

        if (props.selectedIds.length === 0) { //nếu không trong chế độ lựa chọn

            if (dinhDangXuat === 'excel' && cheDoXuat === 'pageCurrent') {
                exportExcel(data);
                dispatch({type: 'SET_LOADING', payload: false})
            }
            else if (dinhDangXuat === 'pdf' && cheDoXuat === 'pageCurrent') {
                exportPDF(data);
                dispatch({type: 'SET_LOADING', payload: false})
            }
            else {
                fetch(`${urlGetAccount}?limit=${props.totalItems}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                }).then(response => {
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
                        const toanBo = data.data.map(row => {
                            const ngaySinh = typeof row.NgaySinh === 'string' ? new Date(row.NgaySinh) : row.NgaySinh;
                            const ngayVao = typeof row.NgayVao === 'string' ? new Date(row.NgayVao) : row.NgayVao;
                            return {
                                ...row,
                                NgaySinh: ngaySinh.toISOString().split("T")[0],
                                NgayVao: ngayVao.toISOString().split("T")[0]
                            }
                        })
                        if (dinhDangXuat === 'excel' && cheDoXuat === 'all') {
                            exportExcel(toanBo);
                        } else {
                            exportPDF(toanBo);
                        }
                        dispatch({type: 'SET_LOADING', payload: false})
                    })
                    .catch(error => {
                        dispatch({type: 'SET_LOADING', payload: false})
                        if (error instanceof TypeError) {
                            props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            props.addNotification(error.message, 'warning', 5000)
                        }
                    });

            }

        } else { //đang trong chế độ lựa chọn

            const selectedDulieu = data.filter(item => props.selectedIds.includes(String(item.IDNhanVien))).map(item => ({ ...item }));
            if (dinhDangXuat === 'excel') {
                exportExcel(selectedDulieu);
                dispatch({type: 'SET_LOADING', payload: false})
            } else {
                exportPDF(selectedDulieu);
                dispatch({type: 'SET_LOADING', payload: false})
            }
        }
    }
    //Xuất Excel
    const exportExcel = (data) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');
        // Đặt lại độ rộng của tất cả các cột trong bảng tính


        // Tạo tiêu đề cột
        worksheet.columns = [
            { header: 'ID Nhân Viên', key: 'IDNhanVien', width: 15 },
            { header: 'Tên Nhân Viên', key: 'TenNhanVien', width: 15 },
            { header: 'Vị Trí Công Việc', key: 'TenViTriCongViec', width: 15 },
            { header: 'Ngày Sinh', key: 'NgaySinh', width: 15 },
            { header: 'Giới Tính', key: 'GioiTinh', width: 15 },
            { header: 'Địa Chỉ', key: 'DiaChi', width: 15 },
            { header: 'Số Điện Thoại', key: 'SoDienThoai', width: 15 },
            { header: 'Tình Trạng', key: 'TinhTrang', width: 15 },
            { header: 'Ngày Vào', key: 'NgayVao', width: 15 },

        ];

        // Thêm dữ liệu
        data.forEach(item => {
            worksheet.addRow({
                IDNhanVien: item.IDNhanVien,
                TenNhanVien: item.TenNhanVien,
                TenViTriCongViec: item.TenViTriCongViec,
                NgaySinh: item.NgaySinh,
                GioiTinh: item.GioiTinh,
                DiaChi: item.DiaChi,
                SoDienThoai: item.SoDienThoai,
                TinhTrang: item.TinhTrang,
                NgayVao: item.NgayVao
            });
        });

        // Chèn 3 dòng trắng vào đầu bảng dữ liệu
        worksheet.insertRow(1, ['', '', '']);
        worksheet.insertRow(1, ['', '', '']);

        // Chèn dòng tiêu đề vào ô A1 và gộp các ô lại thành một ô duy nhất
        const columnCount = worksheet.columnCount;
        worksheet.getCell(`A1:${String.fromCharCode(64 + columnCount)}1`).value = 'Danh Sách Nhân Viên';
        worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);
        worksheet.getCell('A1').alignment = { horizontal: 'center' };
        worksheet.getCell('A1').font = { bold: true, size: 16 };
        // Thiết lập căn giữa và font chữ cho các cột và dữ liệu
        const rows = worksheet.getRows(2, worksheet.rowCount);
        rows.forEach(row => {
            row.eachCell(cell => {
                cell.alignment = { horizontal: 'center' };
                if (cell.row === 2) {
                    cell.font = { bold: true, size: 14 };
                }
            });
        });

        // Thêm dòng ngày giờ ở cuối bảng dữ liệu
        const row = worksheet.addRow({});
        row.getCell(columnCount - 1).value = 'Ngày xuất file:';
        row.getCell(columnCount).value = new Date();

        // Xuất workbook sang tệp XLSX
        workbook.xlsx.writeBuffer()
            .then(function (buffer) {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                FileSaver.saveAs(blob, 'MyExcelFile.xlsx');
            });
    };

    //Xuất file PDF
    const exportPDF = (data) => {
        // Tạo đối tượng PDF
        const doc = new jsPDF({
            orientation: 'landscape' // set orientation to landscape
          });
        doc.addFileToVFS("Arial.ttf", arialFont);
        doc.addFont("Arial.ttf", "Arial", "normal");
        doc.setFont("Arial");

        var font = doc.getFont();


        // Thêm nội dung vào PDF
        doc.text('Danh Sách Nhân Viên', doc.internal.pageSize.getWidth() / 2, 10, { align: 'center' });
        doc.autoTable({
            head: [['ID', 'Tên', 'Vị Trí', 'Ngày Sinh', 'Giới Tính', 'Địa Chỉ', 'SĐT', 'Tình Trạng', 'Ngày Vào']],
            body: data.map(item => [item.IDNhanVien, item.TenNhanVien, item.TenViTriCongViec, item.NgaySinh, item.GioiTinh, item.DiaChi, item.SoDienThoai, item.TinhTrang, item.NgayVao]),
            startY: 15,
            theme: 'grid',
            styles: {
                fontSize: 12,
                halign: 'center',
                valign: 'middle',
                font: 'Arial'
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 40,halign: 'left' },
                2: { cellWidth: 35,halign: 'left'  },
                3: { cellWidth: 30 },
                4: { cellWidth: 25 },
                5: { cellWidth: 45,halign: 'left' },
                6: { cellWidth: 25 },
                7: { cellWidth: 25,halign: 'left' },
                8: { cellWidth: 25 },
            },

        });

        // Thêm dòng chữ Ngày xuất file vào cuối trang
        const lastPage = doc.internal.getNumberOfPages();
        doc.setPage(lastPage);
        doc.text(`Ngày xuất file: ${new Date().toLocaleString()}`, 10, doc.internal.pageSize.getHeight() - 10);

        // Tải xuống file PDF
        doc.save('DanhSachNhanVien.pdf');
    };
    return (
        <div className="popup-box">
            <div className="box">
                <div className="conten-modal">
                    <div style={{ width: '80%' }} className="bg-light px-4 py-3">
                        <h4 id='tieudepop'>Xuất Dữ Liệu</h4>
                        <form>

                            <div className="form-group">
                                <label>Chọn định dạng xuất:ㅤ </label>
                                <label>
                                    <input style={{ marginRight: '5px' }}
                                        type="radio"
                                        value="excel"
                                        checked={dinhDangXuat === 'excel'}
                                        onChange={handleFileFormat}
                                    />
                                    <FontAwesomeIcon icon={faFileExcel} /> Excel ㅤㅤㅤㅤ
                                </label>
                                <label>
                                    <input style={{ marginRight: '5px' }}
                                        type="radio"
                                        value="pdf"
                                        checked={dinhDangXuat === 'pdf'}
                                        onChange={handleFileFormat}
                                    />
                                    <FontAwesomeIcon icon={faFilePdf} /> PDF
                                </label>
                            </div>

                            {props.selectedIds.length == 0 && (
                                <div className="form-group">
                                    <label>Chế độ xuất:ㅤ </label>
                                    <label>
                                        <input style={{ marginRight: '5px' }}
                                            type="radio"
                                            value="pageCurrent"
                                            checked={cheDoXuat === 'pageCurrent'}
                                            onChange={handleExportMode}
                                        />
                                        Xuất dữ liệu đang hiển thị trên bảng ㅤㅤㅤㅤㅤ
                                    </label>
                                    <label>
                                        <input style={{ marginRight: '5px' }}
                                            type="radio"
                                            value="all"
                                            checked={cheDoXuat === 'all'}
                                            onChange={handleExportMode}
                                        />
                                        Xuất toàn bộ dữ liệu
                                    </label>
                                </div>
                            )}
                            <button onClick={() => submitExport()}
                                style={{ float: "right" }} type="button" className="btn btn-primary mt-3" >Xác Nhận</button>

                            <button onClick={props.onClose} type="button" className="btn btn-danger mt-3">Huỷ Bỏ</button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ExportAccount;