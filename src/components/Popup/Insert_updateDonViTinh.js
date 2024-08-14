import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { urlInsertUnit, urlGetUnit, urlUpdateUnit } from "../url"
const Insert_updateDonViTinh = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        DanhSach: []
    });
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    const [combosDonViTinh, setCombosDonViTinh] = useState([]);//danh sách đơn vị tính
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        if (props.iDAction) {
            const fetchGetUnit = fetch(`${urlGetUnit}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })

            const fetchGetListUnit = fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetUnit, fetchGetListUnit])
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
                    if (props.isInsert === false) {
                        setDataReq(data[0])
                    }

                    setCombosDonViTinh(
                        data[1].data.filter(item => item.IDDonViTinh !== props.iDAction)
                    )
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
                    setCombosDonViTinh(data.data)
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

    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.TenDonViTinh) {
            if (dataReq.DanhSach.length > 0) {//nếu có danh sách thì kiểm tra thêm trường hợp số thập phân
                // Nếu có danh sách thì kiểm tra thêm trường hợp số thập phân
                const decimalRegex = /^[+]?[0-9]*\.?[0-9]+$/;

                // Kiểm tra từng phần tử trong dataReq.DanhSach
                const isValid = dataReq.DanhSach.map(item => {
                    // Kiểm tra HeSoChuyenDoi với decimalRegex
                    return decimalRegex.test(item.HeSoChuyenDoi);
                }).every(isValid => isValid); // every() sẽ trả về true nếu tất cả các phần tử hợp lệ

                if (!isValid) {
                    props.openPopupAlert('Hệ số chuyển đổi bạn nhập không hợp lệ.')
                    return
                }

            }
            dispatch({ type: 'SET_LOADING', payload: true })
            const data = {
                IDDonViTinh: dataReq.IDDonViTinh,
                TenDonViTinh: dataReq.TenDonViTinh,
                DanhSach: dataReq.DanhSach
            };
            if (props.isInsert === true) {
                fetch(urlInsertUnit, {
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
                        props.setdataUser({ ...props.dataUser, sortBy: 'IDDonViTinh', sortOrder: 'desc' })
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
                fetch(urlUpdateUnit, {
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
        } else props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
    }
    /*xử lý phần chi tiết*/
    function handleDetailChange(ID, value, TenCot) {
        // Tìm chỉ số của phần tử có IDDonViTinh là ID trong mảng dataReq.DanhSach
        const index = dataReq.DanhSach.findIndex(
            item => {
                return item.IDDonViTinh === ID;
            }
        );
    
        if (TenCot === 'IDDonViTinh') {
            // Kiểm tra xem IDDonViTinh mới có bị trùng với bất kỳ ID nào đã tồn tại trong DanhSach không
            const isDuplicate = dataReq.DanhSach.some((item, idx) => {
                return item.IDDonViTinh === Number(value) && idx !== index;
            });
    
            if (isDuplicate) {
                // Hiển thị thông báo nếu IDDonViTinh bị trùng
                props.openPopupAlert('Bạn đã chọn đơn vị tính này rồi');
                return; // Không setDataReq nếu có trùng lặp
            }
    
            // Nếu không trùng lặp, cập nhật IDDonViTinh mới
            dataReq.DanhSach[index][TenCot] = Number(value);
        } else {
            // Nếu TenCot không phải là IDDonViTinh, cập nhật giá trị như bình thường
            dataReq.DanhSach[index][TenCot] = value;
        }
    
        // Cập nhật state với dataReq đã được chỉnh sửa
        setDataReq({
            ...dataReq,
            DanhSach: [...dataReq.DanhSach]
        });
    }
    
    const ThemDonViTinh = () => {
        const existingIDs = dataReq.DanhSach.map(item => item.IDDonViTinh);
        const filteredCombos = combosDonViTinh.filter(item =>
            !existingIDs.includes(item.IDDonViTinh) && item.IDDonViTinh !== props.iDAction
        );
        if (filteredCombos.length > 0) {
            const DanhSach = dataReq.DanhSach;
            DanhSach.push({
                IDDonViTinh: filteredCombos[0].IDDonViTinh,
                HeSoChuyenDoi: null
            });
            setDataReq({
                ...dataReq,
                DanhSach
            });
        } else {
            props.openPopupAlert('Tính năng này yêu cầu nhiều đơn vị tính hơn. Vui lòng thêm 1 vài đơn vị tính trước');
        }
    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box">
            <div className="box" style={{ marginTop: '1%', padding: '1rem', width: isMobile && '100%' }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 >Thông Tin Đơn Vị Tính<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit} style={{
                                maxHeight: isMobile ? '74vh' : '530px',
                                overflow: 'auto',
                                overflowX: 'hidden'
                            }}>
                                <div className="form-group">
                                    <label>Tên Đơn Vị Tính {batBuocNhap}</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={dataReq.TenDonViTinh}
                                        onChange={(event) => {
                                            setDataReq({
                                                ...dataReq,
                                                TenDonViTinh: event.target.value
                                            });
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <label style={{ marginBottom: '0px' }}>Chuyển Đổi Sang Đơn Vị Tính Khác </label>
                                    <div
                                        style={{
                                            marginLeft: '10px',
                                            marginRight: '10px'

                                        }}
                                        onClick={() => ThemDonViTinh()}
                                    >
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    </div>
                                    <p style={{ fontSize: '0.7em', color: '#a1a1a1', marginBottom: '0px' }}>Bạn chỉ cần chuyển đổi 1 chiều, chiều còn lại sẽ tự động được chuyển đổi</p>
                                </div>
                                {dataReq.DanhSach.length > 0 ? <div style={{ maxHeight: '400px', overflow: 'auto', overflowX: 'hidden' }}>
                                    {dataReq.DanhSach.map((item, index) => (
                                        <div className={`${isMobile ? 'flex-column card-body' : 'row card-body'}`} style={{
                                            marginTop: '5px',
                                            paddingBottom: '0', boxShadow: '0 20px 27px 0 rgba(0,0,0,.05)', borderRadius: '30px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}
                                                className={`${isMobile ? 'col-12' : 'col-5 '}`}
                                            >
                                                <label>Chuyển Đổi Sang: </label>
                                                <select className="form-select"
                                                    style={{ width: '50%', marginLeft: '2%' }}
                                                    value={item.IDDonViTinh}
                                                    onChange={(event) => handleDetailChange(item.IDDonViTinh, event.target.value, 'IDDonViTinh')}
                                                >
                                                    {combosDonViTinh.map(item => (
                                                        <option
                                                            key={item.IDDonViTinh}
                                                            value={item.IDDonViTinh}
                                                        >
                                                            {item.TenDonViTinh}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className={`${isMobile ? 'col-12' : 'col-5 '}`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Hệ Số Chuyển Đổi: </label>
                                                <input
                                                    style={{ width: '50%', marginLeft: '2%' }}
                                                    type="text"
                                                    className="form-control"
                                                    value={item.HeSoChuyenDoi}
                                                    onChange={(event) => handleDetailChange(item.IDDonViTinh, event.target.value, 'HeSoChuyenDoi')}
                                                />
                                            </div>
                                            <div className={`${isMobile ? 'col-12' : 'col-2 '}`} style={{ display: 'flex', alignItems: 'center' }}>
                                                <div
                                                    onClick={() => {
                                                        const DanhSach = dataReq.DanhSach;
                                                        setDataReq({
                                                            ...dataReq,
                                                            DanhSach: DanhSach.filter(i => i.IDDonViTinh !== item.IDDonViTinh)
                                                        })
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div> : <div>

                                </div>}
                                <div style={{ width: '100%' }}><label style={{ opacity: '0.4' }}>Chức năng chỉ chấp nhận số nguyên dương và Số thực dương. Ví dụ 5 ; 0.5 ; 0.55</label></div>

                                <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Huỷ Bỏ</button>
                                <button
                                    onClick={handleSubmit}
                                    style={{ float: "right" }}
                                    type="submit"
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
export default Insert_updateDonViTinh;