import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
//import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
import { getCookie } from "../Cookie";
import { urlGetCloseShifts } from "../url"

const Insert_updateChotCa = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`${urlGetCloseShifts}?id=${props.iDAction}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401 || response.status === 500) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                } else {
                    return null;
                }
            })
            .then(data => {
                if (props.isInsert === false) {
                    setDataReq(data)
                }
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
    //đọc tiền bằng chữ
    // Config reading options
    //const config = new ReadingConfig()
    //config.unit = ['đồng']
    return (
        <div className="popup-box">
            <div className="box">
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông tin chốt ca<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form >
                                <div className="row">
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>ID Ca làm việc</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.IDCaLamViec}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>ID Nhân Viên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.IDNhanVien}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày chốt ca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.NgayLamViec}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tiền đầu ca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(dataReq.TienDauCa)}
                                                disabled='true'
                                            />
                                            {/* <label>{doReadNumber(config, `${dataReq.TienDauCa}`)}</label> */}
                                        </div>
                                        <div className="form-group">
                                            <label>Xác nhận nhận ca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.XacNhanNhanCa ? 'Đã xác nhận' : 'Chưa xác nhận'}
                                                disabled='true'
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label>Tên Ca làm việc </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TenCaLamViec}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tên nhân viên </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TenNhanVien}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ghi chú </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.GhiChu}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tiền chốt ca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(dataReq.TienChotCa)}
                                                disabled='true'
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Xác nhận chốt ca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.XacNhanGiaoCa ? 'Đã xác nhận' : 'Chưa xác nhận'}
                                                disabled='true'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
export default Insert_updateChotCa;