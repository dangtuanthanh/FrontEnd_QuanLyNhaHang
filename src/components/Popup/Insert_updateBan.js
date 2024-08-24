import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { getCookie } from "../Cookie";
import Combobox from "../Combobox";
import SearchComBoBox from "../SearchCombobox";
import Insert_updateKhuVuc from "./Insert_updateKhuVuc";
import { urlInsertTable, urlGetTable, urlUpdateTable, urlGetArea } from "../url"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
const Insert_updateBan = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    //cảnh báo dữ liệu bị thiếu
    const [missingDataWarnings, setMissingDataWarnings] = useState([]);
    const [showWarnings, setShowWarnings] = useState(false);
    const toggleWarnings = () => {
        setShowWarnings(!showWarnings);
    };
    // dùng cho popup khu vực
    const [isInsert, setIsInsert] = useState(false);
    const [iDAction, setIDAction] = useState();
    const [popup1, setPopup1] = useState(false); // popup khu vực
    const [dataUser, setdataUser] = useState({});
    const [popupSearch, setPopupSearch] = useState(false);
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách vai trò
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            const fetchGetTable = fetch(`${urlGetTable}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                    'iddoitac': getCookie('IDDoiTac')
                },
            })

            const fetchGetArea = fetch(`${urlGetArea}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                    'iddoitac': getCookie('IDDoiTac'),
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
                    //kiểm tra có thiếu dữ liệu hay không
                    const ListErr = data[1].data;//phụ
                    const missingData = [];
                    if (ListErr && ListErr.length > 0 && !ListErr.some(item => item.IDKhuVuc === data[0].IDKhuVuc)) {
                        missingData.push({//chính
                            Combo: 'Khu Vực',
                            ID: data[0].IDKhuVuc,//chính
                            Ten: data[0].TenKhuVuc
                        });
                    }else if(ListErr && ListErr.length ===0){
                        props.openPopupAlert(
                            `Có vẻ như chưa có dữ liệu Khu Vực. Vui lòng thêm ít nhất 1 Khu Vực để tiếp tục`,
                            () => {
                                setIDAction();
                                setIsInsert(true);
                                setPopup1(true);
                            }
                        )
                    }
                    if (missingData.length > 0) {
                        setMissingDataWarnings(prev => [...prev, ...missingData]);
                    }
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    if (error instanceof TypeError) {
                        console.log('error', error);
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                    dispatch({ type: 'SET_LOADING', payload: false })
                });
        } else {
            fetch(`${urlGetArea}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                    'iddoitac': getCookie('IDDoiTac')
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error', response.message);
                    }
                    return response.json();
                })
                .then(data => {
                    setCombosKhuVuc(data.data)
                    if (data.data.length > 0)
                        setDataReq({
                            ...dataReq,
                            IDKhuVuc: data.data[0].IDKhuVuc
                        });
                    else {
                        setDataReq({
                            ...dataReq,
                            IDKhuVuc: undefined
                        });
                        props.openPopupAlert(
                            `Có vẻ như chưa có dữ liệu Khu Vực. Vui lòng thêm ít nhất 1 Khu Vực để tiếp tục`,
                            () => {
                                setIDAction();
                                setIsInsert(true);
                                setPopup1(true);
                            }
                        )
                    }
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    if (error instanceof TypeError) {
                        console.log('error', error);
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                    dispatch({ type: 'SET_LOADING', payload: false })
                });
        }



    }, [dataUser]);

    //combo combosKhuVuc
    function handleKhuVucChange(selectedValue) {
        setDataReq({
            ...dataReq,
            IDKhuVuc: selectedValue
        });
    }

    //xử lý xác nhận

    const handleSubmit = (e) => {
        e.preventDefault();
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
                        props.setdataUser({ ...props.dataUser, page: 1, sortBy: 'IDBan', sortOrder: 'desc' })
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

    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box">
            <div className="box" style={{ marginTop: '1%', padding: '1rem', width: isMobile && '100%' }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Bàn Ăn<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span>
                                {missingDataWarnings.length > 0 &&
                                    <span onClick={toggleWarnings} style={{ float: 'right', marginRight: '1rem', color: 'red', cursor: 'pointer', }}><FontAwesomeIcon icon={faTriangleExclamation} /></span>
                                }</h4>
                            <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}>
                                {missingDataWarnings.length > 0 && (
                                    <>
                                        {showWarnings && (
                                            <div>
                                                <label
                                                    style={{
                                                        color: 'red',
                                                        fontSize: 'small',
                                                        marginLeft: '10px'
                                                    }}

                                                >
                                                    Dữ liệu bị thiếu dẫn đến việc hiển thị không chính xác !

                                                    Nguyên nhân có thể do bạn đã xoá các dữ liệu sau đây:
                                                </label>
                                                <table className="table align-items-center mb-0 table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Loại dữ liệu</th>
                                                            <th style={{ padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">ID</th>
                                                            <th style={{ padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {missingDataWarnings.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.Combo}</td>
                                                                <td>{item.ID}</td>
                                                                <td>{item.Ten}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>

                                                </table>
                                                <hr class="horizontal dark mt-1" />
                                            </div>
                                        )}
                                    </>
                                )}
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
                                    isAdd={true}
                                    isSearch={true}
                                    isInfo={true}
                                    add={() => {
                                        setIDAction();
                                        setIsInsert(true);
                                        setPopup1(true);
                                    }}
                                    search={setPopupSearch}
                                    info={() => {
                                        setIsInsert(false);
                                        setIDAction(dataReq.IDKhuVuc);
                                        setPopup1(true);
                                    }}

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
            {
                popup1 && <div className="popup">
                    <Insert_updateKhuVuc
                        isInsert={isInsert}
                        iDAction={iDAction}
                        setPopupInsertUpdate={setPopup1}
                        dataUser={dataUser}
                        setdataUser={setdataUser}
                        addNotification={props.addNotification}
                        openPopupAlert={props.openPopupAlert}
                    />
                </div>
            }
            {
                popupSearch && <div className="popup">
                    <SearchComBoBox
                        setPopupSearch={setPopupSearch}
                        combos={combosKhuVuc}
                        IDColumn={'IDKhuVuc'}
                        column={'TenKhuVuc'}
                        handleChange={handleKhuVucChange}
                    />
                </div>
            }
        </div >
    );
};
export default Insert_updateBan;