import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import { urlInsertShifts, urlGetShifts, urlUpdateShifts } from "../url"
const Insert_updateArea = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`${urlGetShifts}?id=${props.iDAction}`, {
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
    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.TenCaLamViec && dataReq.GioBatDau && dataReq.GioKetThuc) {
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = {
                IDCaLamViec: dataReq.IDCaLamViec,
                TenCaLamViec: dataReq.TenCaLamViec,
                GioBatDau: dataReq.GioBatDau,
                GioKetThuc: dataReq.GioKetThuc,
            };
            if (props.isInsert === true) {
                fetch(urlInsertShifts, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
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
                        props.addNotification(data.message, 'success', 3000)
                        //ẩn loading
                        dispatch({ type: 'SET_LOADING', payload: false })
                        props.setPopupInsertUpdate(false)
                        props.setdataUser({ ...props.dataUser, sortBy: 'IDKhuVuc', sortOrder: 'desc' })
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        if (error instanceof TypeError) {
                            props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            props.addNotification(error.message, 'warning', 5000)
                        }

                    });
            } else {
                fetch(urlUpdateShifts, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
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
                        props.addNotification(data.message, 'success', 3000)
                        //ẩn loading
                        dispatch({ type: 'SET_LOADING', payload: false })
                        props.setPopupInsertUpdate(false)
                        props.setdataUser({ ...props.dataUser })
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
        }
        else props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
    }
    return (
        <div className="popup-box">
            <div className="box">
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Ca Làm Việc<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên Ca Làm Việc {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenCaLamViec}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenCaLamViec: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giờ Bắt Đầu {batBuocNhap}</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={dataReq.GioBatDau}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                GioBatDau: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Giờ Kết Thúc {batBuocNhap}</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={dataReq.GioKetThuc}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                GioKetThuc: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    style={{ float: "right" }} type="button"
                                    className="btn btn-primary mt-3"
                                >
                                    Xác Nhận
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
export default Insert_updateArea;