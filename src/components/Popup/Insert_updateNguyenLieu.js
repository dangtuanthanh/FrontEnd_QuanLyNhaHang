import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import { urlInsertIngredient, urlGetIngredient, urlUpdateIngredient, urlGetUnit } from "../url"
const Insert_updateNguyenLieu = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    // combobox
    const [combosDonViTinh, setCombosDonViTinh] = useState([]);//danh sách đơn vị tính
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetInforByID = fetch(`${urlGetIngredient}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetCombos1 = fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetInforByID, fetchGetCombos1])
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
                    setCombosDonViTinh(data[1].data)
                    if (props.isInsert === false) {
                        setDataReq(data[0])
                    }
                    else setDataReq({
                        ...dataReq,
                        IDDonViTinh: data[1].data[0].IDDonViTinh
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
        } else {
            fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error', response.message);
                    }
                    return response.json();
                })
                .then(data => {
                    setCombosDonViTinh(data.data)
                    setDataReq({
                        ...dataReq,
                        IDDonViTinh: data.data[0].IDDonViTinh
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
        }



    }, []);

    function handleCombos1Change(selectedValue) {
        setDataReq({
            ...dataReq,
            IDDonViTinh: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.TenNguyenLieu && dataReq.IDDonViTinh) {
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = {
                IDNguyenLieu: dataReq.IDNguyenLieu,
                TenNguyenLieu: dataReq.TenNguyenLieu,
                IDDonViTinh: dataReq.IDDonViTinh
            };
            if (props.isInsert === true) {
                fetch(urlInsertIngredient, {
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
                        props.setdataUser({ ...props.dataUser, sortBy: 'IDNguyenLieu', sortOrder: 'desc' })
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
                fetch(urlUpdateIngredient, {
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
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Tên Nguyên Liệu {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenNguyenLieu}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenNguyenLieu: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <Combobox
                                    combos={combosDonViTinh}
                                    columnValue="IDDonViTinh"
                                    columnAdd="TenDonViTinh"
                                    nameCombo="Đơn Vị Tính: "
                                    batBuocNhap={batBuocNhap}
                                    value={dataReq.IDDonViTinh}
                                    onChange={handleCombos1Change}
                                />

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
export default Insert_updateNguyenLieu;