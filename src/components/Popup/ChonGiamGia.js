import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faAdd, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "../Cookie";
import Pagination from "../Pagination";
import { urlInsertArea, urlGetCustomer, urlUpdateInvoice } from "../url"
import Insert_updateKhachHang from "../Popup/Insert_updateKhachHang";
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
const ChonGiamGia = (props) => {
    //xử lý redux

    const dispatch = useDispatch()
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    //đọc tiền bằng chữ
    const [words, setWords] = useState('');
    const TongTien = props.dataReq.DanhSach.reduce((total, item) => {
        return total + item.SoLuong * item.GiaBan;
    }, 0);
    const [tongTienDaGiam, setTongTienDaGiam] = useState(TongTien);

    useEffect(() => {
        if (props.dataReq.GiamGia) {
            if (props.dataReq.PhuongThucGiamGia === 'Phần Trăm') {
                const config = new ReadingConfig()
                config.unit = ['phần trăm']
                setWords(doReadNumber(config, props.dataReq.GiamGia.toString()))
                setTongTienDaGiam(TongTien - (TongTien * props.dataReq.GiamGia / 100))
            } else {
                const config = new ReadingConfig()
                config.unit = ['đồng']
                setWords(doReadNumber(config, props.dataReq.GiamGia.toString()))
                setTongTienDaGiam(TongTien - props.dataReq.GiamGia)
            }
        }
    }, [props.dataReq.GiamGia]);
    useEffect(() => {
        if (props.dataReq.PhuongThucGiamGia) {
            if (props.dataReq.PhuongThucGiamGia === 'Phần Trăm' && props.dataReq.GiamGia) {
                if (props.dataReq.GiamGia > 100) {
                    props.setDataReq({
                        ...props.dataReq,
                        GiamGia: 100
                    })
                }
                const config = new ReadingConfig()
                config.unit = ['phần trăm']
                setWords(doReadNumber(config, props.dataReq.GiamGia.toString()))
            } else if (props.dataReq.GiamGia) {
                const config = new ReadingConfig()
                config.unit = ['đồng']
                setWords(doReadNumber(config, props.dataReq.GiamGia.toString()))
            }
        }
    }, [props.dataReq.PhuongThucGiamGia]);
    const handleSubmit = (giamGia) => {
        if (props.dataReq.IDNhanVien && props.dataReq.DanhSach.length > 0) {
            dispatch({ type: 'SET_LOADING', payload: true })
            var duLieuGuiDi = props.dataReq
            if (!giamGia) {
                duLieuGuiDi = {
                    ...duLieuGuiDi,
                    GiamGia: undefined,
                    PhuongThucGiamGia: undefined
                }
            }
            fetch(urlUpdateInvoice, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
                body: JSON.stringify(duLieuGuiDi)
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
                    props.addNotification('Đã cập nhật hoá đơn', 'success', 3000)
                    props.setDataUser({ ...props.dataUser })
                    props.setPopupChonGiamGia(false)
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
        else props.openPopupAlert('Vui lòng chọn ít nhất một món ăn')

    }
   
   
    return (
        <div className="popup-box" style={{ zIndex: '9991' }}>
            <div className="box">
                <div className="conten-modal card">
                    <h4 style={{ textAlign: 'center', textDecoration: 'underline' }}>Giảm Giá</h4>

                    <div className="form-group" style={{ margin: '10px' }}>
                        <label>Phương Thức Giảm Giá {batBuocNhap} ㅤ</label>
                        <label>
                            <input
                                type="radio"
                                value="Phần Trăm"
                                checked={props.dataReq.PhuongThucGiamGia === 'Phần Trăm'}
                                onChange={(event) => {
                                    props.setDataReq({
                                        ...props.dataReq,
                                        PhuongThucGiamGia: event.target.value
                                    });
                                }}
                            />
                            Phần Trămㅤ
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Tiền Trực Tiếp"
                                checked={props.dataReq.PhuongThucGiamGia === 'Tiền Trực Tiếp'}
                                onChange={(event) => {
                                    props.setDataReq({
                                        ...props.dataReq,
                                        PhuongThucGiamGia: event.target.value
                                    });
                                }}
                            />
                            Tiền Trực Tiếpㅤ
                        </label>
                    </div>
                    <div className="form-group" style={{ margin: '10px' }}>
                        <label>Nhập Số Lượng Muốn Giảm {batBuocNhap}</label>
                        <input
                            type="number"
                            className="form-control"
                            value={props.dataReq.GiamGia}
                            onChange={(event) => {
                                if (props.dataReq.PhuongThucGiamGia === 'Tiền Trực Tiếp') {
                                    if (event.target.value > props.dataReq.DanhSach.reduce((total, item) => {
                                        return total + item.SoLuong * item.GiaBan;
                                    }, 0)) {
                                        props.addNotification('Bạn không thể nhập vượt quá giá trị "Tổng Tiền"', 'warning', 3000)
                                    } else props.setDataReq({
                                        ...props.dataReq,
                                        GiamGia: (Number(event.target.value))
                                    });
                                } else if (props.dataReq.PhuongThucGiamGia === 'Phần Trăm') {
                                    if (event.target.value > 100) {
                                        props.addNotification('Bạn không thể nhập vượt quá 100% ', 'warning', 3000)
                                    } else props.setDataReq({
                                        ...props.dataReq,
                                        GiamGia: (Number(event.target.value))
                                    });
                                } else {
                                    props.setDataReq({
                                        ...props.dataReq,
                                        GiamGia: 0
                                    });
                                    props.addNotification('Vui lòng chọn một phương thức giảm giá', 'warning', 3000)
                                }
                            }}
                        />
                        {
                            words.length > 0 ? <label>{words}</label> : null
                        }

                        
                        <div style={{ marginTop: '2%' }}>
                            <h5 style={{ color: 'gray', float: 'left' }}>Tổng Tiền: <span style={{ color: 'black' }}>{
                                new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(props.dataReq.DanhSach.reduce((total, item) => {
                                    return total + item.SoLuong * item.GiaBan;
                                }, 0))
                            }</span></h5>
                            <h5 style={{ color: 'gray', float: 'right' }}>Tổng Tiền Sau Khi Giảm:ㅤ
                                <span style={{ color: 'black' }}>{
                                    new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(tongTienDaGiam)
                                }</span>
                            </h5>
                        </div>

                    </div>
                    <div style={{ margin: '2%' }}>
                        <button onClick={() => {
                            props.setPopupChonGiamGia(false)
                        }} type="button"
                            className="btn btn-danger mt-3"
                            style={{ marginBottom: '0px' }}
                        >Đóng</button>
                        ㅤ
                        <button onClick={() => {
                            handleSubmit(false);
                        }} type="button"
                            className="btn btn-primary mt-3"
                            style={{ marginBottom: '0px' }}
                        >Huỷ Giảm Giá</button>
                        <button onClick={() => {
                            if (props.isInsert === true)
                                props.setPopupChonGiamGia(false)
                            else handleSubmit(true);
                        }} type="button"
                            className="btn btn-primary mt-3"
                            style={{ marginBottom: '0px', float: 'right' }}
                        >Xác Nhận</button>
                    </div>
                </div>
            </div >

        </div >
    );
}
export default ChonGiamGia;