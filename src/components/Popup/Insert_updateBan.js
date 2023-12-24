import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import { urlInsertTable, urlGetTable, urlUpdateTable, urlGetArea } from "../url"
const Insert_updateBan = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        const fetchGetTable = fetch(`${urlGetTable}?id=${props.iDAction}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })

        const fetchGetArea = fetch(`${urlGetArea}?limit=10000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        Promise.all([fetchGetTable, fetchGetArea])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401 || response.status === 500 || response.status === 400) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message);
                        });
                    } else {
                        return null;
                    }
                });
                return Promise.all(processedResponses);
            })
            .then(data => {
                setCombosKhuVuc(data[1].data)
                if (props.isInsert === false) {
                    setDataReq(data[0])
                }
                else setDataReq({
                    ...dataReq,
                    IDKhuVuc: data[1].data[0].IDKhuVuc
                });
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


    }, []);

    //combo combosKhuVuc
    function handleKhuVucChange(selectedValue) {
        setDataReq({
            ...dataReq,
            IDKhuVuc: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = () => {
        if (dataReq.TenBan && dataReq.TrangThai && dataReq.IDKhuVuc) {
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = {
                IDBan: dataReq.IDBan,
                TenBan: dataReq.TenBan,
                TrangThai: dataReq.TrangThai,
                GhiChu: dataReq.GhiChu,
                IDKhuVuc: dataReq.IDKhuVuc
            };
            if (props.isInsert === true) {
                fetch(urlInsertTable, {
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
                fetch(urlUpdateTable, {
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
                            <h4 id='tieudepop'>{props.tieuDe}<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form>
                                <div className="form-group">
                                    <label>Tên Bàn {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenBan}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenBan: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Trạng Thái {batBuocNhap} ㅤ</label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Đang sửa"
                                            checked={dataReq.TrangThai === 'Đang sửa'}
                                            onChange={(event) => {
                                                setDataReq({
                                                    ...dataReq,
                                                    TrangThai: event.target.value
                                                });
                                            }}
                                        />
                                        Đang sửaㅤ
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Bàn trống"
                                            checked={dataReq.TrangThai === 'Bàn trống'}
                                            onChange={(event) => {
                                                setDataReq({
                                                    ...dataReq,
                                                    TrangThai: event.target.value
                                                });
                                            }}
                                        />
                                        Bàn trốngㅤ
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="Có khách"
                                            checked={dataReq.TrangThai === 'Có khách'}
                                            onChange={(event) => {
                                                setDataReq({
                                                    ...dataReq,
                                                    TrangThai: event.target.value
                                                });
                                            }}
                                        />
                                        Có khách
                                    </label>
                                </div>
                                <Combobox
                                    combos={combosKhuVuc}
                                    columnValue="IDKhuVuc"
                                    columnAdd="TenKhuVuc"
                                    nameCombo="Khu Vực: "
                                    batBuocNhap={batBuocNhap}
                                    value={dataReq.IDKhuVuc}
                                    onChange={handleKhuVucChange}
                                />
                                <div className="form-group">
                                    <label>Ghi Chú</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.GhiChu}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                GhiChu: event.target.value
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
};
export default Insert_updateBan;