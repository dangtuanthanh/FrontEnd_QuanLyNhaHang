import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlGetUnit, urlGetIngredient, urlGetTypeProduct, urlGetProduct, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import Pagination from "../Pagination";
const ChonMon = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    const [dataRes, setDataRes] = useState({});
    // useEffect(() => {
    //     console.log('dữ liệu gửi đi: ', dataReq);
    // }, [dataReq]);
    const [combosLoaiSanPham, setCombosLoaiSanPham] = useState([]);//danh sách loại sản phẩm

    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'TenSanPham',
        sortOrder: 'asc',
        searchBy: 'TenSanPham',
        search: '',
        searchExact: 'false',
        limit: 12
    });//
    useEffect(() => {
        console.log('dataUser: ', dataUser);
    }, [dataUser]);
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetProduct}?page=${dataUser.page}&limit=${dataUser.limit}&sortBy=${dataUser.sortBy}&sortOrder=${dataUser.sortOrder}&search=${dataUser.search}&searchBy=${dataUser.searchBy}&searchExact=${dataUser.searchExact}`, {
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
        fetch(`${urlGetTypeProduct}?limit=10000`, {
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
                setCombosLoaiSanPham(data.data)
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

    //hàm tìm kiếm
    const handleSearch = (event) => {
        setdataUser({
            ...dataUser,
            sortBy: 'TenSanPham',
            sortOrder: 'asc',
            page: 1,
            search: event.target.value,
            searchBy: 'TenSanPham'
        });

    };
    //hàm hiển thị màu được chọn
    function getBackgroundColor(item) {
        if (item.TrangThai === 'Có khách') {
            return '#ccecff';
        }

        if (item.TrangThai === 'Đang sửa') {
            return '#ffcccc';
        }

        return 'transparent';
    }
    //Xử lý menu
    const [showNavigation, setShowNavigation] = useState(true);
    const handleToggleNavigation = () => {
        if(showNavigation){
            setdataUser({
                ...dataUser,
                limit: 15
            })
        }else setdataUser({
            ...dataUser,
            limit: 12
        })
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";
    return (
        <div>
            <div className="row"  >
                <div className={navigationColumnClass}>
                    {showNavigation && <div>
                        <div>
                            <input 
                            style={{width:'83%'}}
                            id="search" 
                            value={dataUser.search} 
                            onChange={handleSearch} 
                            placeholder='Tìm Tên Món' 
                            type="text" 
                            className="form-control-sm" />
                            {
                                (dataUser.search.length != 0) &&
                                <button
                                    className="btn btn-close"
                                    style={{ color: 'red', marginLeft: '4px', marginTop: '10px' }}
                                    onClick={() => {
                                        setdataUser({
                                            ...dataUser,
                                            search: '',
                                            searchBy: 'TenSanPham'
                                        });
                                    }}
                                >
                                    X
                                </button>
                            }
                        </div>
                        <div style={{ marginTop: '5px', display: 'flex', width: '100%', overflowY: 'auto',height:'100%' }}>
                            <div >
                                {combosLoaiSanPham.map(item => (
                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="radio"
                                            value={item.IDLoaiSanPham}
                                            checked={dataUser.search === item.IDLoaiSanPham.toString()}
                                            onChange={(event) => {
                                                setdataUser({
                                                    ...dataUser,
                                                    searchBy: 'LoaiSanPham',
                                                    search: event.target.value,
                                                });
                                            }}
                                        />
                                        <span style={{ minWidth: '80px' }}> {item.TenLoaiSanPham}</span>
                                    </label>
                                ))}
                            </div>
                        </div>



                    </div>}
                </div>
                <div className={contentColumnClass}>

                    <div className="row">
                        {duLieuHienThi.map(item => (
                            <div
                                key={item.IDSanPham}
                                className="col"
                                style={{ textAlign: 'center', borderRadius: '6px', boxShadow: '0 20px 27px 0 rgba(0,0,0,.05)', margin: '2px' }}
                                onClick={() => {
                                    props.setDataReq({
                                        ...props.dataReq,
                                        IDSanPham: item.IDSanPham,
                                        TenSanPham: item.TenSanPham
                                    });
                                    console.log('Đã thêm sản phẩm: ', item.IDSanPham, item.TenSanPham);
                                }}
                            >

                                <div
                                    className="card-body"
                                    style={{
                                        textAlign: 'center',
                                        backgroundColor: getBackgroundColor(item),
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '15px'
                                    }}
                                >
                                    <img
                                        src={item.HinhAnh}
                                        style={{
                                            height: '110px',
                                            width: '110px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                    <label>{item.TenSanPham}</label>
                                    <strong style={{ color: '#ee4d2d' }}>{new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(item.GiaBan)}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>

                    </div>
                    {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                    {/* phân trang */}
                    <button
                        style={{float:'left'}}
                        class="nav-link"
                        onClick={handleToggleNavigation}
                    >
                        {showNavigation ? "<<" : ">>"}
                    </button>
                    <div style={{ textAlign: 'right', margin: '5px', float:'right' }}>
                        <Pagination
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            dataRes={dataRes}
                        />
                    </div>
                </div>
            </div>
        </div >

    );
};

export default ChonMon;