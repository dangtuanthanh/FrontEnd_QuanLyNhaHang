import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTable } from '@fortawesome/free-solid-svg-icons'

import { getCookie } from "../Cookie";
import { urlGetUnit, urlGetIngredient, urlGetTypeProduct, urlGetProduct, urlInsertProcessedProduct, urlGetTable, urlGetArea, urlUpdateProcessedProduct } from "../url"
import anhBan from '../../assets/img/ban.jpg';
import Pagination from "../Pagination";
import Combobox from "../Combobox";
const ChonBan = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    // combobox
    const [combosKhuVuc, setCombosKhuVuc] = useState([]);//danh sách khu vực

    const [dataRes, setDataRes] = useState({});
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'TenBan',
        sortOrder: 'asc',
        searchBy: 'TrangThai',
        search: '',
        searchExact: 'false',
        limit: 24
    });//

    useEffect(() => {
        console.log('dataUser: ', dataUser);
    }, [dataUser]);
    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'IDBan',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value,
            searchBy: 'TenBan'
        });

    };

    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetTable}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
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
                //cập nhật dữ liệu hiển thị
                setDuLieuHienThi(data.data)
                //cập nhật thông số trang
                setDataRes({
                    currentPage: data.currentPage,
                    itemsPerPage: data.itemsPerPage,
                    sortBy: data.sortBy,
                    sortOrder: data.sortOrder,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages
                });
                if (data.currentPage > data.totalPages && data.totalPages !== null) {
                    setdataUser({
                        ...dataUser,
                        page: data.totalPages
                    });

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
        fetch(`${urlGetArea}?limit=10000`, {
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
                const newCombos = [...data.data];
                newCombos.unshift({
                    IDKhuVuc: 0,
                    TenKhuVuc: 'Tất Cả'
                });

                setCombosKhuVuc(newCombos);
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
    };
    //hàm hiển thị màu bàn
    function getBackgroundColor(item) {
        if (item.TrangThai === 'Có khách') {
            return '#ccecff';
        }

        if (item.IDBan === props.dataReq.IDBan) {
            return '#a6e1a6';
        }

        return 'transparent';
    }
    //combo combosKhuVuc
    function handleKhuVucChange(selectedValue) {
        if (selectedValue === 'Tất Cả') {
            setdataUser({
                ...dataUser,
                searchBy: 'TenKhuVuc',
                search: '',
            });
        } else
            setdataUser({
                ...dataUser,
                searchBy: 'TenKhuVuc',
                search: selectedValue,
            });
    }
    return (
        <div>
            <div className="card mb-4">
                <div className="row">
                    <div style={{ marginTop: '5px', width: '100%', display: 'flex' }}>
                        <div style={{ width: '20%', marginLeft: '10px' }}>
                            <Combobox
                                combos={combosKhuVuc}
                                columnValue="TenKhuVuc"
                                columnAdd="TenKhuVuc"
                                nameCombo="Khu Vực: "
                                value={dataUser.TenKhuVuc}
                                onChange={handleKhuVucChange}
                            />
                        </div>
                        <div className="form-group" style={{ width: '40%' }}>
                            <label>Trạng Thái: ㅤ</label>
                            <label>
                                <input
                                    type="radio"
                                    value="Bàn trống"
                                    checked={dataUser.search === 'Bàn trống'}
                                    onChange={(event) => {
                                        setdataUser({
                                            ...dataUser,
                                            searchBy: 'TrangThai',
                                            search: event.target.value,
                                        });
                                    }}
                                />
                                Bàn trốngㅤ
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Có khách"
                                    checked={dataUser.search === 'Có khách'}
                                    onChange={(event) => {
                                        setdataUser({
                                            ...dataUser,
                                            searchBy: 'TrangThai',
                                            search: event.target.value,
                                        });
                                    }}
                                />
                                Có khách
                            </label>
                        </div>
                        <div style={{ width: '40%', textAlign: 'end', marginRight: '15px' }}>
                            <input id="search" value={dataUser.search} onChange={handleSearch} placeholder='Tìm Tên Bàn' type="text" className="form-control-sm" />
                            {
                                (dataUser.search.length != 0) &&
                                <button
                                    className="btn btn-close"
                                    style={{ color: 'red', marginLeft: '4px', marginTop: '10px' }}
                                    onClick={() => {
                                        setdataUser({
                                            ...dataUser,
                                            search: ''
                                        });
                                    }}
                                >
                                    X
                                </button>
                            }
                        </div>
                    </div>

                    {duLieuHienThi.map(item => (
                        <div
                            key={item.IDBan}
                            className="col"
                            onClick={() => {
                                props.setDataReq({
                                    ...props.dataReq,
                                    IDBan: item.IDBan,
                                    TenBan: item.TenBan,
                                    TenKhuVuc:item.TenKhuVuc
                                });
                                props.setActiveTab('TabChonMon')

                            }}
                        >

                            <div
                                className="card-body"
                                style={{ textAlign: 'center', backgroundColor: getBackgroundColor(item) }}
                            >
                                <img src={anhBan} />
                                <p>{item.TenBan}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                {/* phân trang */}
                <div style={{ textAlign: 'right', margin: '5px' }}>
                    <Pagination
                        setdataUser={setdataUser}
                        dataUser={dataUser}
                        dataRes={dataRes}
                    />
                </div>
            </div>
        </div>

    );
};

export default ChonBan;