import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import {
    urlInsertReceipt, urlGetReceipt, urlUpdateReceipt,
    urlGetIngredient, urlGetProduct,// lấy danh sách nguyên liệu, sản phẩm chế biến
    urlGetUnit
} from "../url"//lấy danh sách đơn vị tính
const Insert_updatePhieuNhap = (props) => {
    const dispatch = useDispatch()
    const [dataReq, setDataReq] = useState({
        IDNhanVien: props.thongTinDangNhap.IDNhanVien,
        TenNhanVien: props.thongTinDangNhap.TenNhanVien,
        NgayNhap: props.DateCurrent,
        NhapNguyenLieu: props.nhapNguyenLieu,
        DanhSach: []
    });
    // combobox
    const [combosSPNL, setCombosSPNL] = useState([]);//danh sách sản phẩm, nguyên liệu
    const [combosDonViTinh, setCombosDonViTinh] = useState([]);//danh sách đơn vị tính
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            //lấy thông tin 1 phiếu nhập
            const fetchGetReceipt = fetch(`${urlGetReceipt}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            var fetchGetIngredientGetProduct
            //lấy danh sách nguyên liệu hoặc sản phẩm thành phẩm
            if (props.nhapNguyenLieu) {
                fetchGetIngredientGetProduct = fetch(`${urlGetIngredient}?limit=10000`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                })
            } else fetchGetIngredientGetProduct = fetch(`${urlGetProduct}?limit=10000&searchBy=SanPhamThanhPham&search=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            // lấy danh sách đơn vị tính
            const fetchGetUnit = fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetReceipt, fetchGetIngredientGetProduct, fetchGetUnit])
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
                    setCombosSPNL(data[1].data)
                    setCombosDonViTinh(data[2].data)
                    if (props.isInsert === false) {
                        setDataReq(data[0])
                    }
                    else setDataReq({
                        ...dataReq,
                        IDNguyenLieu: data[1].data[0].IDNguyenLieu
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
            var fetchGetIngredientGetProduct
            //lấy danh sách nguyên liệu hoặc sản phẩm thành phẩm
            if (props.nhapNguyenLieu) {
                fetchGetIngredientGetProduct = fetch(`${urlGetIngredient}?limit=10000`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                })
            } else fetchGetIngredientGetProduct = fetch(`${urlGetProduct}?limit=10000&search=true&searchBy=SanPhamThanhPham`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            // lấy danh sách đơn vị tính
            const fetchGetUnit = fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetchGetIngredientGetProduct, fetchGetUnit])
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
                    setCombosSPNL(data[0].data)
                    setCombosDonViTinh(data[1].data)
                    // setDataReq({
                    //     ...dataReq,
                    //     IDNguyenLieu: data[0].data[0].IDNguyenLieu
                    // });
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
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
    }, []);


    /*xử lý phần chi tiết*/
    function handleDetailChange(ID, value, TenCot) {
        const index = dataReq.DanhSach.findIndex(
            item => {
              if(props.nhapNguyenLieu) {
                return item.IDNguyenLieu === ID;
              } else {  
                return item.IDSanPham === ID;
              }
            }
          );
        if (TenCot === 'GhiChu') dataReq.DanhSach[index][TenCot] = value
        else dataReq.DanhSach[index][TenCot] = parseInt(value)
        setDataReq({
            ...dataReq,
            DanhSach: [...dataReq.DanhSach]
        })
    }
    //checkbox danh sách
    const handleListChange = (ID, Ten) => {
        let updatedDataReq = { ...dataReq };
        let newDanhSach = updatedDataReq.DanhSach;
        if(props.nhapNguyenLieu){
            if (newDanhSach.some(item => item.IDNguyenLieu === ID)) {
                newDanhSach = newDanhSach.filter(item => item.IDNguyenLieu !== ID);
            } else {
                newDanhSach.push({
                    TenNguyenLieu: Ten,
                    IDNguyenLieu: ID,
                    SoLuongNhap: 0,
                    SoLuongTon: 0,
                    IDDonViTinh: 1,
                    DonGiaNhap: 0,
                    GhiChu: ''
                });
            }
        }else{
            if (newDanhSach.some(item => item.IDSanPham === ID)) {
                newDanhSach = newDanhSach.filter(item => item.IDSanPham !== ID);
            } else {
                newDanhSach.push({
                    TenSanPham: Ten,
                    IDSanPham: ID,
                    SoLuongNhap: 0,
                    SoLuongTon: 0,
                    IDDonViTinh: 1,
                    DonGiaNhap: 0,
                    GhiChu: ''
                });
            }
        }
        
        updatedDataReq.DanhSach = newDanhSach;
        setDataReq(updatedDataReq);
    }
    //xử lý xác nhận
    const handleSubmit = (e) => {
        e.preventDefault();
        if (dataReq.DanhSach.length) {
            let hasError = false;

            for (const item of dataReq.DanhSach) {
                if (isNaN(item.SoLuongNhap)) {
                    hasError = true;
                    break;
                }

                if (isNaN(item.IDDonViTinh)) {
                    hasError = true;
                    break;
                }

                if (isNaN(item.DonGiaNhap)) {
                    hasError = true;
                    break;
                }

                if (isNaN(item.SoLuongTon)) {
                    hasError = true;
                    break;
                }
            }
            if (!hasError) {
                dispatch({ type: 'SET_LOADING', payload: true })
                if (props.isInsert === true) {
                    fetch(urlInsertReceipt, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'ss': getCookie('ss'),
                        },
                        body: JSON.stringify(dataReq)
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
                            props.setdataUser({ ...props.dataUser, sortBy: 'NgayNhap', sortOrder: 'desc' })
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
                    fetch(urlUpdateReceipt, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'ss': getCookie('ss'),
                        },
                        body: JSON.stringify(dataReq)
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
            } else props.openPopupAlert('Vui lòng điền đầy đủ thông tin cho các mặt hàng');
        }
        else props.openPopupAlert('Vui lòng chọn ít nhất 1 mặt hàng trong danh sách')

    }


    return (
        <div className="lg-popup-box">
            <div className="lg-box">
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4> Thông Tin Phiếu Nhập<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="form-group">
                                            <label>Tên Nhân Viên {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // value={props.thongTinDangNhap.TenNhanVien}
                                                value={dataReq.TenNhanVien}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-group">
                                            <label>Ngày Nhập {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                // value={props.DateCurrent}
                                                value={dataReq.NgayNhap}
                                                disabled
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
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
                                    </div>
                                </div>
                                <div style={{ borderBottom: '2px gray solid', marginBottom: '5px' }}></div>

                                <div className="row">
                                    <div className="col-3" style={{ borderRight: '2px gray solid' }}>
                                        <h6 style={{ textAlign: 'center' }}><u>Danh Sách</u></h6>
                                        <div className="form-group"
                                            style={{
                                                maxHeight: '380px',
                                                overflow: 'auto'
                                            }}
                                        >
                                            {/* <label>Danh Sa {batBuocNhap}: </label> */}
                                            {combosSPNL.map(combo => {
                                                let checked = false;
                                                dataReq.DanhSach.forEach(item => {
                                                    if (props.nhapNguyenLieu) {
                                                        if (item.IDNguyenLieu === combo.IDNguyenLieu) {
                                                            checked = true;
                                                        }
                                                    } else if (item.IDSanPham === combo.IDSanPham) {
                                                        checked = true;
                                                    }

                                                })
                                                return (
                                                    <>
                                                        {props.nhapNguyenLieu ? (
                                                            <div key={combo.IDNguyenLieu}>
                                                                <label>
                                                                    <input
                                                                        style={{ marginRight: '4px' }}
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={() => handleListChange(combo.IDNguyenLieu, combo.TenNguyenLieu)}
                                                                    />
                                                                    {`${combo["IDNguyenLieu"]} - ${combo["TenNguyenLieu"]}`}
                                                                </label>
                                                            </div>
                                                        ) : (
                                                            <div key={combo.IDSanPham}>
                                                                <label>
                                                                    <input
                                                                        style={{ marginRight: '4px' }}
                                                                        type="checkbox"
                                                                        checked={checked}
                                                                        onChange={() => handleListChange(combo.IDSanPham, combo.TenSanPham)}
                                                                    />
                                                                    {`${combo["IDSanPham"]} - ${combo["TenSanPham"]}`}
                                                                </label>
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                    <div className="col-9 " >
                                        {/* <div style={{background:'#fff',borderRadius:'8px'}} className="col-9 " > */}
                                        <div className="form-group">
                                            <h6 style={{ textAlign: 'center' }}><u>Chi Tiết</u></h6>
                                        </div>
                                        <div className="row" >
                                            <div className="col-2">
                                                <label>Tên</label>
                                            </div>
                                            <div className="col-2">
                                                <label>Số Lượng Nhập</label>
                                            </div>
                                            <div className="col-2">
                                                <label>Đơn Vị Tính</label>
                                            </div>
                                            <div className="col-2">
                                                <label>Đơn Giá Nhập</label>
                                            </div>
                                            <div className="col-2">
                                                <label>Số Lượng Tồn </label>
                                            </div>
                                            <div className="col-2">
                                                <label>Ghi Chú</label>
                                            </div>
                                        </div>
                                        <div className="form-group" style={{
                                            maxHeight: '370px',
                                            overflow: 'auto',
                                            overflowX: 'hidden'
                                        }}>
                                            {dataReq.DanhSach.map(item => (
                                                <div key={props.nhapNguyenLieu 
                                                    ? item.IDNguyenLieu 
                                                    : item.IDSanPham} 
                                                    className="row">
                                                    <div className="col-2">
                                                        <label>{props.nhapNguyenLieu 
                                                    ? item.TenNguyenLieu 
                                                    : item.TenSanPham} </label>
                                                    </div>
                                                    <div className="col-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.SoLuongNhap}
                                                            onChange={(event) => 
                                                                handleDetailChange(
                                                                  props.nhapNguyenLieu ? item.IDNguyenLieu : item.IDSanPham,
                                                                  event.target.value, 
                                                                  'SoLuongNhap'
                                                                )
                                                              }
                                                        />
                                                    </div>
                                                    <div className="col-2">
                                                        <select className="form-select"
                                                            value={item.IDDonViTinh}
                                                            onChange={(event) => handleDetailChange(props.nhapNguyenLieu ? item.IDNguyenLieu : item.IDSanPham, event.target.value, 'IDDonViTinh')}
                                                        >
                                                            {combosDonViTinh.map(item => (
                                                                <option
                                                                    key={item.id}
                                                                    value={item.IDDonViTinh}
                                                                >
                                                                    {item.TenDonViTinh}
                                                                </option>
                                                            ))}

                                                        </select>
                                                        {/* <input
                                                            className="form-control"
                                                            value={item.IDDonViTinh}>
                                                        </input> */}
                                                    </div>
                                                    <div className="col-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.DonGiaNhap}
                                                            onChange={(event) => handleDetailChange(props.nhapNguyenLieu ? item.IDNguyenLieu : item.IDSanPham, event.target.value, 'DonGiaNhap')}
                                                        />
                                                    </div>
                                                    <div className="col-2">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.SoLuongTon}
                                                            onChange={(event) => handleDetailChange(props.nhapNguyenLieu ? item.IDNguyenLieu : item.IDSanPham, event.target.value, 'SoLuongTon')}
                                                        />
                                                    </div>
                                                    <div className="col-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.GhiChu}
                                                            onChange={(event) => handleDetailChange(props.nhapNguyenLieu ? item.IDNguyenLieu : item.IDSanPham, event.target.value, 'GhiChu')}
                                                        />
                                                    </div>
                                                    <hr></hr>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
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
export default Insert_updatePhieuNhap;