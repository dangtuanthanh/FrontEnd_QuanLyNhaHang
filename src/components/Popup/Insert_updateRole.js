import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import { urlGetPermission, urlInsertRole, urlGetRole,urlUpdateRole } from "../url"
const Insert_updateRole = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        IDQuyen: []
    });
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    // combobox
    const [combosQuyen, setCombosQuyen] = useState([]);//danh sách quyền
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        const fetchGetPermission = fetch(`${urlGetPermission}?limit=10000`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        const fetchGetRole = fetch(`${urlGetRole}?id=${props.iDAction}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
        Promise.all([fetchGetPermission, fetchGetRole])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401 || response.status === 500) {
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
                setCombosQuyen(data[0])
                if (props.isInsert === false) {
                    //xử lý chuyển mảng num sang string
                    let getRoleByID = data[1]
                    const stringsIDQuyen = data[1].IDQuyen.map(num => num.toString());
                    getRoleByID = ({
                        ...getRoleByID,
                        IDQuyen:stringsIDQuyen
                    });
                    setDataReq(getRoleByID)
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
    //combo vai trò
    const handleQuyenChange = (ID) => {
        let updatedDataReq = { ...dataReq };
        let IDQuyen = updatedDataReq.IDQuyen;
        if (IDQuyen.includes(ID)) {
            IDQuyen = IDQuyen.filter(item => item !== ID)
        } else {
            IDQuyen.push(ID);
        }
        updatedDataReq.IDQuyen = IDQuyen;
        setDataReq(updatedDataReq);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dataReq.TenVaiTro
            || !dataReq.IDQuyen
            || !dataReq.IDQuyen.length
        ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
        else {
            dispatch({ type: 'SET_LOADING', payload: true })
            const strIDQuyen = dataReq.IDQuyen.join(',');
            const data = {
                IDVaiTro:dataReq.IDVaiTro,
                TenVaiTro: dataReq.TenVaiTro,
                IDQuyen: strIDQuyen
            };
            if (props.isInsert === true) {
                fetch(urlInsertRole, {
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
                        props.setdataUser({ ...props.dataUser, sortBy: 'IDVaiTro', sortOrder: 'desc' })
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
                console.log('hành động sửa')
                fetch(urlUpdateRole, {
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
    }
    return (
        <div className="popup-box">
            <div className="box">
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>{props.tieuDe}<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên Vai Trò {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenVaiTro}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenVaiTro: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-group"
                                    style={{ maxHeight: '400px', overflow: 'auto' }}
                                >
                                    <label>Quyền: {batBuocNhap}ㅤ</label>
                                    {combosQuyen.map(combo => (
                                        <div key={combo.IDQuyen} >
                                            <label >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        (dataReq.IDQuyen?.includes(combo.IDQuyen.toString())) || false
                                                    }
                                                    onChange={() => handleQuyenChange(combo.IDQuyen.toString())}
                                                />
                                                {` ${combo["IDQuyen"]} - ${combo["TenQuyen"]} - ${combo["MoTa"]}`}
                                            </label>
                                        </div>
                                    ))}
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
export default Insert_updateRole;