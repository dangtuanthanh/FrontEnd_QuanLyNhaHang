import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard, faArrowLeft, faBell, faClone, faFile, faPencil, faTable, faTag, faCheckCircle, faCheck, faPrint, faSpinner, faCheckToSlot, faBan } from '@fortawesome/free-solid-svg-icons'
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import QRCode from 'qrcode.react';
const QRCodeBan = (props) => {
    const isMobile = useSelector(state => state.isMobile.isMobile)
    // Tạo URL dựa trên tên miền hiện tại
    const url = `${window.location.origin}/GoiMon?IDBan=${props.iDAction}&IDDoiTac=${getCookie('IDDoiTac')}`;
    const InMa = (tenBan) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Đặt font đậm và kích thước lớn cho tiêu đề
        doc.setFontSize(30);
        doc.setFont('Helvetica', 'bold');

        // Căn giữa tiêu đề
        const textWidth = doc.getTextWidth(tenBan);
        const textX = (pageWidth - textWidth) / 2;
        doc.text(tenBan, textX, 50); // Vị trí Y có thể điều chỉnh để thay đổi khoảng cách với mép trên

        // Tạo mã QR từ URL và thêm vào PDF, căn giữa hình ảnh mã QR
        const canvas = document.getElementById('qrcode');
        const imgData = canvas.toDataURL('image/png');
        const qrSize = 150;
        const qrX = (pageWidth - qrSize) / 2;
        doc.addImage(imgData, 'PNG', qrX, 50, qrSize, qrSize); // Vị trí Y được điều chỉnh để gần hơn với tiêu đề

        // Lệnh để tự động in
        doc.autoPrint();
        doc.output('dataurlnewwindow');
    };
    return (
        <div className="popup-box">
            <div className="box" style={{ marginTop: '1%', padding: '1rem', width: isMobile && '100%' }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3"style={{textAlign:'center'}}>
                            <h4  id='tieudepop'>Mã QR {props.tenBan}</h4>
                            <form
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                <div style={{width:'100%'}}>
                                <QRCode id="qrcode" value={url} size={isMobile?200:450} includeMargin={true} />
                                </div>
                                <button 
                                onClick={() => { props.setPopupQRCode(false) }} 
                                type="button" 
                                className="btn btn-danger mt-3"
                                style={{ float: 'left' }}
                                 >Thoát</button>
                                <button
                                    style={{ float: 'right' }}
                                    className="btn btn-primary  mt-3"
                                    onClick={() => {
                                        InMa(props.tenBan)
                                    }}

                                >
                                    <><FontAwesomeIcon icon={faPrint} style={{
                                        marginRight: '4px'
                                    }} />
                                        In Mã
                                    </>

                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};
export default QRCodeBan;