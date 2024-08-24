import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlGetTypeProduct, urlGetProduct } from "../url"
import Pagination from "../Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faSearch } from '@fortawesome/free-solid-svg-icons'
const ChonMon = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    const [dataRes, setDataRes] = useState({});
    const isMobile = useSelector(state => state.isMobile.isMobile)

    // useEffect(() => {
    //     console.log('dữ liệu gửi đi: ', dataReq);
    // }, [dataReq]);
    const [combosLoaiSanPham, setCombosLoaiSanPham] = useState([]);//danh sách loại sản phẩm
    // Lấy URL hiện tại từ thanh địa chỉ
    const currentUrl = window.location.href;
    // Tạo đối tượng URL từ URL hiện tại
    const urlObj = new URL(currentUrl);
    // Sử dụng URLSearchParams để lấy giá trị của tham số 'answer'
    const params = new URLSearchParams(urlObj.search);
    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'TenSanPham',
        sortOrder: 'asc',
        searchBy: 'TenSanPham',
        search: '',
        searchExact: 'false',
        limit: isMobile ? 10000 : 12
    });//
    useEffect(() => {
        console.log('dataUser: ', dataUser);
    }, [dataUser]);
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
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
                'iddoitac': params.get('IDDoiTac')? params.get('IDDoiTac') : getCookie('IDDoiTac'),
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
                'iddoitac': params.get('IDDoiTac')? params.get('IDDoiTac') : getCookie('IDDoiTac'),
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
    const [showNavigation, setShowNavigation] = useState(() => {
        return isMobile ? false : true;
    });
    const handleToggleNavigation = () => {
        if (showNavigation) {
            setdataUser({
                ...dataUser,
                limit: 15
            })
        } else setdataUser({
            ...dataUser,
            limit: 12
        })
        setShowNavigation(!showNavigation);
    };
    const navigationColumnClass = isMobile ? "col-12" : (showNavigation ? "col-2" : "col-0");
    const contentColumnClass = isMobile ? "col-12" : (showNavigation ? "col-10" : "col-12");

    //thêm dữ liệu vào danh sách
    const handleListChange = async (ID, Ten, GiaBan) => {
        let updatedDataReq = { ...props.dataReq };
        let newDanhSach = updatedDataReq.DanhSach;
        const foundItem = newDanhSach.find(item => item.IDSanPham === ID);
        if (foundItem) {
            props.handleDetailChange(
                foundItem.IDSanPham,
                foundItem.SoLuong + 1,
                'SoLuong'
            );
            props.handleDetailChange(
                foundItem.IDSanPham,
                1,
                'IDTrangThai'
            );
        } else {
            newDanhSach.push({
                IDSanPham: ID,
                TenSanPham: Ten,
                SoLuong: 1,
                GiaBan: GiaBan
            });
        }
        updatedDataReq.DanhSach = newDanhSach;
        props.setDataReq(updatedDataReq);
    }
    const inputRef = useRef();
    return (
        <div className="card" style={{ height: '90vh', overflow: 'auto', overflowX: 'hidden' }}>
            <div className="row"  >
                <div className={navigationColumnClass} style={{ marginLeft: isMobile ? '10px' : 'auto' }}>
                    {showNavigation && <div>
                        <div>
                            <input
                                style={{ width: isMobile ? '75%' : '83%', border: '0.8px grey solid', marginTop: '2%' }}
                                id="search"
                                value={dataUser.search}
                                onChange={handleSearch}
                                placeholder='Tìm Tên Món'
                                type="text"
                                className="form-control-sm"
                                autoFocus={isMobile ? false : true}
                                ref={inputRef}
                            />
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
                                        inputRef.current.focus();
                                    }}
                                >
                                    X
                                </button>
                            }
                        </div>
                        <div style={{ marginTop: '5px', display: 'flex', width: '100%', overflowY: 'auto', height: !isMobile ? '100%' : '100px' }}>
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
                                    handleListChange(item.IDSanPham, item.TenSanPham, item.GiaBan)
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
                                        padding: '15px',
                                        position: 'relative'
                                    }}
                                >
                                    {props.dataReq.DanhSach.some(newitem => newitem.IDSanPham === item.IDSanPham) && (
                                        <label
                                            style={{
                                                position: 'absolute',
                                                top: '10px',  // Adjust the top position as needed
                                                right: '10px',  // Adjust the right position as needed
                                                color: 'white',
                                                padding: '5px',  // Optional: Add padding
                                                borderRadius: '10px',  // Optional: Add border-radius for rounded corners\
                                                fontSize: '0.7rem'
                                            }}
                                            className="bg-gradient-primary"
                                        >
                                            Đã chọn
                                        </label>
                                    )}
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
                        {duLieuHienThi.length === 0 ? <h5 style={{ color: 'darkgray', 'textAlign': 'center' }}>Rất tiếc! Không có dữ liệu để hiển thị</h5> : null}
                    </div>
                    <div>

                    </div>

                    <div style={{ height: '6vh' }}></div>
                    {!isMobile &&
                        <div className="row">
                            <div className="col-6">
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 0,
                                    margin: '0.5rem'
                                }}>
                                    <button
                                        style={{ float: 'left' }}
                                        class="nav-link"
                                        onClick={handleToggleNavigation}
                                    >
                                        {showNavigation ? "<<" : ">>"}
                                    </button>
                                </div>
                            </div>
                            {!isMobile &&
                                <div className="col-6">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        margin: '0.5rem'
                                    }}>
                                        {/* phân trang */}
                                        <div style={{ marginLeft: '1rem' }}>
                                            <Pagination
                                                setdataUser={setdataUser}
                                                dataUser={dataUser}
                                                dataRes={dataRes}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
            {
                isMobile && <button
                    id="ButtonMenu"
                    className="btn bg-gradient-primary"
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        right: '1.5rem',
                        padding: '8px 16px',
                        width: '3rem'
                    }}
                    onClick={() => {
                        setShowNavigation(!showNavigation)
                    }}
                >
                    {showNavigation ? (
                        <FontAwesomeIcon icon={faXmark} />
                    ) : (
                        <FontAwesomeIcon icon={faSearch} />
                    )}
                </button>
            }
        </div >

    );
};

export default ChonMon;