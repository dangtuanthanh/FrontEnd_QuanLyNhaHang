import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faIdCard, faBell, faClone, faFile, faPencil, faTable } from '@fortawesome/free-solid-svg-icons'
import { faSquarePlus, faMinusSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

import { urlInsertInvoice, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { urlGetTable, urlGetInvoice, urlUpdateInvoice, urlDeleteInvoice, urlUpdateStatusTable } from "../url"
import { getCookie } from "../Cookie";
import Pagination from "../Pagination";
function TabGhepDon(props) {
    //xử lý redux
    const dispatch = useDispatch()

    const [dataUser, setdataUser] = useState({//dữ liệu người dùng
        sortBy: 'TenBan',
        sortOrder: 'asc',
        searchBy: 'TenBan',
        search: '',
        searchExact: 'false'
    });//
    // xử lý chọn hàng dữ liệu:
    const [selectedRow0, setSelectedRow0] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    //xử lý trang dữ liệu 
    const [duLieuHienThi, setDuLieuHienThi] = useState([]);//lưu trạng thái dữ liệu
    const [duLieuHienThi2, setDuLieuHienThi2] = useState([]);//lưu trạng thái dữ liệu
    const [dataRes, setDataRes] = useState({});
    const [dataReq, setDataReq] = useState();
    //hàm tải dữ liệu
    useEffect(() => {
        TaiDuLieu()
    }, [dataUser]);
    useEffect(() => {
        console.log('dataReq', dataReq);
    }, [dataReq]);
    const TaiDuLieu = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetTable}?page=${dataUser.page}&limit=${dataUser.limit}&search=Có khách&searchBy=TrangThai`, {
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
    };

    //lấy danh sách hoá đơn sau khi click bàn
    const TaiDanhSachHoaDon = (IDBan) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetInvoice}?search=${IDBan}&searchBy=IDBan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;
                }
            })
            .then(data => {
                setDuLieuHienThi2(data.data.filter(item => {
                    return (
                        item.TrangThaiThanhToan === false &&
                        item.IDHoaDon !== props.dataReq.IDHoaDon
                    )
                }))
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
    //lấy thông tin 1 hoá đơn sau khi click vào hoá đơn để ghép
    const LayThongTin1HoaDon = (IDHoaDon) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        fetch(`${urlGetInvoice}?id=${IDHoaDon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;
                }
            })
            .then(data => {
                setDataReq({
                    ...data,
                    DanhSach: []
                })
                // Duyệt danh sách đầu
                data.DanhSach.forEach(item1 => {
                    // Tìm item trùng
                    const item2 = props.dataReq.DanhSach.find(i => i.IDSanPham === item1.IDSanPham);

                    if (item2) {
                        // Nếu trùng thì gộp
                        setDataReq(prev => ({
                            ...prev,
                            DanhSach: [
                                ...prev.DanhSach,
                                {
                                    ...item1,
                                    SoLuong: item1.SoLuong + item2.SoLuong,
                                    ThanhTien: (item1.SoLuong + item2.SoLuong) * item1.GiaBan,
                                    GhiChu: item1.GhiChu || item2.GhiChu
                                }
                            ]
                        }))
                    } else {
                        // Không trùng thì thêm vào
                        setDataReq(prev => ({
                            ...prev,
                            DanhSach: [...prev.DanhSach, item1]
                        }))
                    }

                })

                // Duyệt danh sách thứ 2
                props.dataReq.DanhSach.forEach(item2 => {

                    if (!data.DanhSach.find(i => i.IDSanPham === item2.IDSanPham)) {
                        // Nếu không tìm thấy trong danh sách 1 thì thêm
                        setDataReq(prev => ({
                            ...prev,
                            DanhSach: [...prev.DanhSach, item2]
                        }))
                    }

                })

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
    const KiemTraBanAnCoHoaDonChuaThanhToanHayKhong = (IDBan) => {
        dispatch({ type: 'SET_LOADING', payload: true })
        return fetch(`${urlGetInvoice}?search=${IDBan}&searchBy=IDBan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else {
                    return;
                }
            })
            .then(data => {
                dispatch({ type: 'SET_LOADING', payload: false });
                return data.data.some(item => item.TrangThaiThanhToan === false);
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


    // /*xử lý phần chi tiết*/
    // function handleDetailChange(ID, giaTriTang, DanhSachMoi) {
    //     if (DanhSachMoi) {
    //         const item = dataReqMoi.DanhSach.find(i => i.IDSanPham === ID);
    //         if (item) {
    //             if (giaTriTang) {
    //                 item.SoLuong++;
    //             } else {
    //                 item.SoLuong--;
    //             }
    //             setDataReqMoi({
    //                 ...dataReqMoi,
    //                 DanhSach: [...dataReqMoi.DanhSach]
    //             });
    //         }
    //     }
    //     //Danh sách cũ
    //     else {
    //         const item = dataReqCu.DanhSach.find(i => i.IDSanPham === ID);
    //         if (item) {
    //             if (giaTriTang) {
    //                 item.SoLuong++;
    //             } else {
    //                 item.SoLuong--;
    //             }
    //             setDataReqCu({
    //                 ...dataReqCu,
    //                 DanhSach: [...dataReqCu.DanhSach]
    //             });
    //         }
    //     }
    // }
    // Phân tách dữ liệu thành các dòng
    // const lines = JSON.stringify(dataReq)
    //     .replace(/{/g, '{\n')
    //     .replace(/}/g, '\n}')
    //     .replace(/,/g, ',\n')
    //     .split('\n');

    //xử lý thông báo bếp
    const handleSubmit = () => {
        dispatch({ type: 'SET_LOADING', payload: true })
        let IDs = [props.dataReq.IDHoaDon]
        const fetch1 = fetch(urlDeleteInvoice, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
            body: JSON.stringify({ IDs })
        })
        const fetch2 = fetch(urlUpdateInvoice, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('ss'),
            },
            body: JSON.stringify(dataReq)
        })
        // const capNhatBanAn = {
        //     IDBan:props.dataReq.IDBan,
        //     TrangThai:'Bàn trống'
        // }
        // const fetch3= fetch(urlUpdateStatusTable, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'ss': getCookie('ss'),
        //     },
        //     body: JSON.stringify(capNhatBanAn)
        // })
        Promise.all([fetch1, fetch2])
            .then(responses => {
                const processedResponses = responses.map(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 400 || response.status === 401 || response.status === 500) {
                        return response.json().then(errorData => {
                            throw new Error(errorData.message);
                        });
                    } else {
                        return null;
                    }
                });
                return Promise.all(processedResponses);
            })
            .then(async () => {
                //kiểm tra xem bàn ăn có hoá đơn nào chưa thanh toán không
                const KTBanAn = await KiemTraBanAnCoHoaDonChuaThanhToanHayKhong(props.dataReq.IDBan)
                if (KTBanAn) {
                    props.addNotification('Ghép đơn thành công', 'success', 3000)
                    props.setPopupTachGhep(false)
                    props.setPopupInsertUpdate(false)
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                } else {
                    //nếu như không có hoá đơn chưa thanh toán
                    //cập nhật trạng thái bàn ăn về trống
                    const capNhatBanAn = {
                        IDBan: props.dataReq.IDBan,
                        TrangThai: 'Bàn trống'
                    }
                    fetch(urlUpdateStatusTable, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'ss': getCookie('ss'),
                        },
                        body: JSON.stringify(capNhatBanAn)
                    }).then(response => {
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
                            props.addNotification('Ghép đơn thành công', 'success', 3000)
                            props.setPopupTachGhep(false)
                            props.setPopupInsertUpdate(false)
                            //ẩn loading
                            dispatch({ type: 'SET_LOADING', payload: false })
                        })
                        .catch(error => {
                            dispatch({ type: 'SET_LOADING', payload: false })
                            console.log('error', error);
                            if (error instanceof TypeError) {
                                props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                            } else {
                                props.addNotification(error.message, 'warning', 5000)
                            }
                        });
                }
            })
            .catch(error => {
                console.log('error', error);
                if (error instanceof TypeError) {
                    props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                } else {
                    props.addNotification(error.message, 'warning', 5000)
                }
                dispatch({ type: 'SET_LOADING', payload: false })
            });

    }
    return (
        <div>
            <div className="row">
                <div className="col-6" style={{ borderRight: 'inset' }}>
                    <h4 style={{ textAlign: 'center' }}>Danh Sách Bàn Ăn</h4>
                    <table class="table align-items-center m-2 ">
                        <thead>
                            <tr >
                                <th style={{ padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tên Bàn </th>
                                <th style={{ textAlign: 'center' }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Trạng Thái </th>
                                <th style={{ padding: 8, textAlign: 'center' }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Vị Trí Bàn </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                duLieuHienThi.map((dulieu) =>
                                    <tr
                                        style={{ 'textAlign': 'center', backgroundColor: selectedRow0 === dulieu.IDBan ? '#c3f4ff73' : '#fff' }}
                                        id='trdata'
                                        key={dulieu.IDBan}
                                        onClick={() => {
                                            TaiDanhSachHoaDon(dulieu.IDBan);
                                            setSelectedRow0(dulieu.IDBan);
                                        }} >
                                        <td style={{ textAlign: 'left' }} >{dulieu.TenBan}</td>
                                        <td >{dulieu.TrangThai}</td>
                                        <td >{dulieu.TenKhuVuc}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {/* phân trang */}
                    <div style={{ float: 'right', margin: '1%' }}>
                        <Pagination
                            setdataUser={setdataUser}
                            dataUser={dataUser}
                            dataRes={dataRes}
                        />
                    </div>

                </div>
                <div className="col-6">
                    <div>
                        <h4 style={{ textAlign: 'center' }}>Danh Sách Hoá Đơn</h4>
                        <div style={{ height: '550px', maxHeight: '60%', overflow: 'auto', overflowX: 'hidden' }}>
                            {selectedRow0 ?
                                <table class="table align-items-center m-2 ">
                                    <thead>
                                        <tr >
                                            <th style={{ padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Khách Hàng</th>

                                            <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mã Hoá Đơn </th>
                                            <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tổng Tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {duLieuHienThi2.map((dulieu) =>
                                            <tr
                                                style={{ 'textAlign': 'center', backgroundColor: selectedRow === dulieu.IDHoaDon ? '#c3f4ff73' : '#fff' }}
                                                id='trdata'
                                                key={dulieu.IDHoaDon}
                                                onClick={() => {
                                                    LayThongTin1HoaDon(dulieu.IDHoaDon);
                                                    setSelectedRow(dulieu.IDHoaDon);
                                                }}
                                            >
                                                <td style={{ textAlign: 'left' }} >{dulieu.TenKhachHang}</td>
                                                <td>{dulieu.IDHoaDon}</td>
                                                <td> {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(dulieu.TongTien)}</td>
                                            </tr>
                                        )
                                        }

                                    </tbody>
                                </table>
                                : <div>
                                    <h4 style={{ textAlign: 'center', color: "gray" }}>Chưa có bàn nào được chọn</h4>
                                </div>
                            }

                            {/* <pre
                                style={{
                                    background: '#333',
                                    color: '#fff',
                                    padding: '10px',
                                    margin: '20px auto',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all'
                                }}
                            >
                                Danh sách mới: {lines.map(line => <div>{line}</div>)}

                            </pre> */}
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        onClick={() => {
                            props.setDataUser(props.dataUser + 1)
                            props.setPopupTachGhep(false)
                        }}
                        type="button"
                        className="btn btn-danger"
                        style={{ marginLeft: '2%' }}
                    >Huỷ Bỏ</button>
                    <button
                        onClick={() => {
                            handleSubmit()
                        }}
                        type="button"
                        className="btn btn-primary mt-3"
                        style={{ float: 'right' }}
                    >Xác Nhận</button>
                </div>
            </div>
        </div>
    )
}
export default TabGhepDon;