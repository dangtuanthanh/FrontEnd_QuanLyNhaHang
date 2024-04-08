import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import { urlGetPicturePayment, urlGetInvoice, urlUpdateInvoice, urlUpdateStatusTable, urlInsertInvoice, urlGetProduct, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
const ChonThanhToan = (props) => {
    const dispatch = useDispatch()
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu

    useEffect(() => {
        console.log('dữ liệu gửi đi: dataReq chính ', duLieuHienThi);
    }, [duLieuHienThi]);
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetPicturePayment}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;
                }
            })
            .then(data => {
                //cập nhật dữ liệu hiển thị
                setDuLieuHienThi(data[0].AnhThanhToan)
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
    }, []);
    const TaiDanhSachHoaDon = (IDBan) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        return fetch(`${urlGetInvoice}?search=${IDBan}&searchBy=IDBan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;
                }
            })
            .then(data => {
                dispatch({ type: 'SET_LOADING', payload: false });
                return data.data.some(item => item.TrangThaiThanhToan === false);
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

    const handleSubmit = () => {
        if (props.dataReq.IDNhanVien && props.dataReq.DanhSach.length > 0) {
            if (props.dataReq.ThanhToanChuyenKhoan != null && props.dataReq.ThanhToanChuyenKhoan != undefined) {
                dispatch({ type: 'SET_LOADING', payload: true })
                var duLieuGuiDi = {
                    ...props.dataReq,
                    TrangThaiThanhToan: true
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
                    .then(async () => {
                        //kiểm tra xem bàn ăn có hoá đơn nào chưa thanh toán không
                        const KTBanAn = await TaiDanhSachHoaDon(props.dataReq.IDBan)
                        if (KTBanAn) {
                            //nếu như có hoá đơn chưa thanh toán
                            //không cần cập nhật trạng thái bàn ăn
                            props.addNotification('Đã cập nhật hoá đơn', 'success', 3000)
                            props.setDataUser({ ...props.dataUser })
                            props.setPopupChonThanhToan(false)
                            //ẩn loading
                            dispatch({ type: 'SET_LOADING', payload: false })

                        } else {
                            //nếu như không có hoá đơn chưa thanh toán
                            //cập nhật trạng thái bàn ăn về trống
                            const capNhatBanAn = {
                                IDBan: props.dataReq.IDBan,
                                TrangThai: 'Bàn trống'
                            }
                            fetch(urlUpdateStatusTable, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'ss': getCookie('ss'),
                                },
                                body: JSON.stringify(capNhatBanAn)
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
                                    props.addNotification('Đã cập nhật hoá đơn', 'success', 3000)
                                    props.setLoadTrang({ ...props.loadTrang + 1 })

                                    props.setPopupChonThanhToan(false)
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
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        if (error instanceof TypeError) {
                            props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            props.addNotification(error.message, 'warning', 5000)
                        }

                    });
            } else props.openPopupAlert('Vui lòng chọn phương thức thanh toán')
        }
        else props.openPopupAlert('Vui lòng chọn ít nhất một món ăn')

    }
    //xử lý thông báo bếp
    const handleSubmitThem = () => {
        if (props.dataReq.IDNhanVien && props.dataReq.DanhSach.length > 0) {
            if (props.dataReq.ThanhToanChuyenKhoan != null && props.dataReq.ThanhToanChuyenKhoan != undefined) {
                dispatch({ type: 'SET_LOADING', payload: true })
                const dulieu = {
                    ...props.dataReq,
                    TrangThaiThanhToan: true
                }
                fetch(urlInsertInvoice, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(dulieu)
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        }
                    })
                    .then(async (result) => {
                        //kiểm tra xem bàn ăn có hoá đơn nào chưa thanh toán không
                        const KTBanAn = await TaiDanhSachHoaDon(props.dataReq.IDBan)
                        if (KTBanAn) {
                            //nếu như có hoá đơn chưa thanh toán
                            //không cần cập nhật trạng thái bàn ăn
                            props.addNotification('Bếp đã nhận được thông báo', 'success', 3000)
                            props.setDataReq({
                                ...props.dataReq,
                                IDHoaDon: result.result.IDHoaDon
                            })
                            props.setPopupChonThanhToan(false)
                            props.setdataUser({ ...props.dataUser, search: '', sortBy: 'IDHoaDon', sortOrder: 'desc' })
                            props.setPopupInsertUpdate(false)
                            //ẩn loading
                            dispatch({ type: 'SET_LOADING', payload: false })

                        } else {
                            //nếu như không có hoá đơn chưa thanh toán
                            //cập nhật trạng thái bàn ăn về trống
                            const capNhatBanAn = {
                                IDBan: props.dataReq.IDBan,
                                TrangThai: 'Bàn trống'
                            }
                            fetch(urlUpdateStatusTable, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'ss': getCookie('ss'),
                                },
                                body: JSON.stringify(capNhatBanAn)
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
                                    props.addNotification('Bếp đã nhận được thông báo', 'success', 3000)
                                    props.setDataReq({
                                        ...props.dataReq,
                                        IDHoaDon: result.result.IDHoaDon
                                    })
                                    props.setPopupChonThanhToan(false)
                                    props.setdataUser({ ...props.dataUser, search: '', sortBy: 'IDHoaDon', sortOrder: 'desc' })
                                    props.setPopupInsertUpdate(false)
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
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        if (error instanceof TypeError) {
                            props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            props.addNotification(error.message, 'warning', 5000)
                        }

                    });
            } else props.openPopupAlert('Vui lòng chọn phương thức thanh toán')
        }
        else props.openPopupAlert('Vui lòng chọn ít nhất một món ăn')

    }
    var TongTien = 0
    if (props.dataReq.GiamGia) {
        TongTien = props.dataReq.DanhSach.reduce((total, item) => {
            let tongTien = total + item.SoLuong * item.GiaBan;

            if (props.dataReq.PhuongThucGiamGia === 'Phần Trăm') {
                if (props.dataReq.SuDungDiemKhachHang) {
                    tongTien = tongTien - (tongTien * props.dataReq.GiamGia / 100) - props.dataReq.DiemKhachHang;
                } else tongTien = tongTien - (tongTien * props.dataReq.GiamGia / 100);
            } else if (props.dataReq.PhuongThucGiamGia === 'Tiền Trực Tiếp') {
                if (props.dataReq.SuDungDiemKhachHang) {
                    tongTien = tongTien - props.dataReq.GiamGia - props.dataReq.DiemKhachHang;
                } else
                    tongTien = tongTien - props.dataReq.GiamGia
            }
            return tongTien;
        }, 0)
    } else {
        TongTien = props.dataReq.DanhSach.reduce((total, item) => {
            let tongTien = total + item.SoLuong * item.GiaBan;
            if (props.dataReq.SuDungDiemKhachHang) {
                tongTien = tongTien - props.dataReq.DiemKhachHang;
            } else tongTien = tongTien
            return tongTien;
        }, 0)
    }
    const [tienKhachTra, setTienKhachTra] = useState(0);//lưu trạng thái dữ liệu

    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    //đọc tiền bằng chữ
    const [words, setWords] = useState('');
    // Config reading options
    const config = new ReadingConfig()
    config.unit = ['đồng']
    const TienChu = doReadNumber(config, TongTien.toString())
    useEffect(() => {
        setWords(doReadNumber(config, tienKhachTra.toString()))
    }, [tienKhachTra]);
    const handleChange = (e) => {
        if (e.target.checked) {
            props.setDataReq({
                ...props.dataReq,
                SuDungDiemKhachHang : true
            })
        } else {
            props.setDataReq({
                ...props.dataReq,
                SuDungDiemKhachHang : false
            })
        }
    };
    return (
        <div className="full-popup-box">
            <div className="full-box" style={{ overflowY: 'hidden' }}>
                <div className="card" style={{ height: '100%', display: 'flex', alignContent: 'center', flexWrap: 'wrap' }}>
                    <h3 style={{ textDecoration: 'underline', textAlign: 'center' }}>Thanh Toán</h3>
                    <div className="form-group" style={{ display: 'flex', justifyContent: 'center' ,flexWrap: 'wrap'}}>
                        {props.dataReq.IDKhachHang && <label style={{ width: '100%', fontSize: '1em',textAlign:'center' }}>
                            <input
                                type="checkbox"
                                checked={props.dataReq.SuDungDiemKhachHang}
                                onChange={handleChange}
                            />
                            Sử dụng điểm khách hàng: {props.dataReq.DiemKhachHang}
                        </label>
                        }
                        <label style={{ fontSize: '1em' }}>Phương Thức Thanh Toán: {batBuocNhap} ㅤ</label>
                        <label style={{ fontSize: '1em' }}>
                            <input
                                type="radio"
                                value={true}
                                checked={props.dataReq.ThanhToanChuyenKhoan == true}
                                onChange={() => {
                                    props.setDataReq({
                                        ...props.dataReq,
                                        ThanhToanChuyenKhoan: true
                                    });
                                }}
                            />
                            Chuyển Khoảnㅤ
                        </label>
                        <label style={{ fontSize: '1em' }}>
                            <input
                                type="radio"
                                value={false}
                                checked={props.dataReq.ThanhToanChuyenKhoan == false}
                                onChange={() => {
                                    props.setDataReq({
                                        ...props.dataReq,
                                        ThanhToanChuyenKhoan: false
                                    });
                                }}

                            />
                            Tiền Mặt
                        </label>
                    </div>

                    {props.dataReq.ThanhToanChuyenKhoan === false ?
                        <div>
                            <div className="form-group">
                                <label style={{ fontSize: '1em' }}>Số Tiền Cần Thanh Toán : </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(TongTien)}
                                    readOnly
                                />
                                {
                                    <label>{TienChu}</label>
                                }
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '1em' }}>Số Tiền Khách Trả : </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={tienKhachTra}
                                    onChange={(event) => {
                                        setTienKhachTra(event.target.value)
                                    }}
                                />
                                {
                                    words.length > 0 ? <label>{words}</label> : null
                                }
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '1em' }}>Số Tiền Thừa :</label>
                                {(tienKhachTra > TongTien) && <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(tienKhachTra - TongTien)}
                                        readOnly
                                    />
                                    {tienKhachTra > TongTien ? <label>{doReadNumber(config, (tienKhachTra - TongTien).toString())}</label> : null}

                                </div>
                                }
                            </div>


                        </div>
                        : <div style={{ textAlign: 'center', maxHeight: '600px' }}>
                            <img src={duLieuHienThi}>
                            </img>
                        </div>
                    }

                    <div style={{ width: '100%', position: 'fixed', bottom: '5%' }}>
                        <button
                            onClick={() => {
                                props.setLoadTrang(props.loadTrang + 1)
                                props.setPopupChonThanhToan(false)
                            }}
                            type="button"
                            className="btn btn-danger"
                            style={{ marginLeft: '2%' }}
                        >Huỷ Bỏ</button>


                        <button
                            onClick={() => {
                                if (props.isInsert === true) {
                                    handleSubmitThem()
                                } else handleSubmit()
                            }}
                            type="button"
                            className="btn btn-primary"
                            style={{ float: 'right', marginRight: '5%' }}

                        ><FontAwesomeIcon icon={faCheck} style={{
                            marginRight: '4px'
                        }} />
                            Xác Nhận Đã Thanh Toán</button>
                    </div>
                </div>
            </div>

        </div>

    );
};
export default ChonThanhToan;