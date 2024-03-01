import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import Combobox from "../Combobox";
import { getCookie } from "../Cookie";
import { urlGetUnit, urlGetTypeProduct, urlGetProduct, urlUpdateFinishedProduct, urlInsertFinishedProduct } from "../url"
const Insert_updateSPThanhPham = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        IDLoaiSanPham: [],
        GiaBan:0
    });
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    // combobox
    const [combos1, setCombos1] = useState([]);//danh sách đơn vị tính
    const [combos2, setCombos2] = useState([]);//danh sách loại sản phẩm
    const [combos3, setCombos3] = useState([]);//danh sách giá bán của sản phẩm
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true })
        if (props.iDAction) {
            //lấy 1 sản phẩm
            const fetch1 = fetch(`${urlGetProduct}?id=${props.iDAction}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            //lấy danh sách đơn vị tính
            const fetch2 = fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            //lấy danh sách loại sản phẩm
            const fetch3 = fetch(`${urlGetTypeProduct}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetch1, fetch2, fetch3])
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
                    setCombos1(data[1].data) //danh sách đơn vị tính
                    setCombos2(data[2].data) //danh sách loại sản phẩm
                    setCombos3(data[0].DanhSachGia) //danh sách giá sản phẩm
                    //xử lý dữ liệu hiển thị nếu là sửa dữ liệu
                    setDataReq(data[0]);
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
            //lấy danh sách đơn vị tính
            const fetch2 = fetch(`${urlGetUnit}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            //lấy danh sách loại sản phẩm
            const fetch3 = fetch(`${urlGetTypeProduct}?limit=10000`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ss': getCookie('ss'),
                },
            })
            Promise.all([fetch2, fetch3])
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
                    setCombos1(data[0].data)
                    setCombos2(data[1].data)
                    setDataReq({
                        ...dataReq,
                        IDDonViTinh: data[0].data[0].IDDonViTinh
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

    //combo loại sản phẩm
    const handleLoaiSanPhamChange = (ID) => {
        let updatedDataReq = { ...dataReq };
        let IDLoaiSanPham = updatedDataReq.IDLoaiSanPham;

        if (IDLoaiSanPham.includes(ID)) {
            IDLoaiSanPham = IDLoaiSanPham.filter(item => item !== ID)
        } else {
            IDLoaiSanPham.push(ID);
        }
        updatedDataReq.IDLoaiSanPham = IDLoaiSanPham;

        setDataReq(updatedDataReq);

    }

    //combo vị trí công việc
    function handleDonViTinhChange(selectedValue) {
        setDataReq({
            ...dataReq,
            IDDonViTinh: selectedValue
        });
    }
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh
    const [urlAnh, setUrlAnh] = useState();
    useEffect(() => {
        if (dataReq.HinhAnh && dataReq.HinhAnh instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(dataReq.HinhAnh));
        } else setUrlAnh(dataReq.HinhAnh);
    }, [dataReq.HinhAnh]);
    function ImageUpload() {
        const fileInputRef = useRef(null);

        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    HinhAnh: undefined
                });
            }
        };

        const handleChooseFileClick = () => {
            fileInputRef.current.click();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            HinhAnh: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        return (
            <div className="form-group">
                <label>Hình Ảnh</label>
                <div
                    style={{ textAlign: 'center', border: '1px dashed #ccc', padding: '20px' }}
                    onClick={handleChooseFileClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                    {dataReq.HinhAnh && (
                        <img
                            src={urlAnh} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                            alt="Selected"
                            style={{ maxHeight: '112px', marginTop: '10px' }}
                        />
                    )}
                </div>
            </div>
        );
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.isInsert) {
            //trường hợp check và thêm
            if (!dataReq.TenSanPham
                || !dataReq.IDDonViTinh
                || (dataReq.GiaBan !== 0 && !dataReq.GiaBan)
            ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
            else handleFetchAPISubmit();
            //check và sửa
        } else if (!dataReq.TenSanPham
            || !dataReq.IDDonViTinh
            || !dataReq.IDSanPham
            || (dataReq.GiaBan !== 0 && !dataReq.GiaBan)
        ) props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
        else handleFetchAPISubmit();
    };
    //xử lý xác nhận
    function handleFetchAPISubmit() {
        dispatch({ type: 'SET_LOADING', payload: true })
        const formData = new FormData();
        for (const key in dataReq) {
            if (dataReq.hasOwnProperty(key)) {
                formData.append(key, dataReq[key]);
            }
        }
        if (props.isInsert === true) {
            console.log('hành động thêm');
            fetch(urlInsertFinishedProduct, {
                method: 'POST',
                headers: {
                    'ss': getCookie('ss'),
                },
                body: formData
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
                    props.setdataUser({ ...props.dataUser, page: 1, sortBy: 'IDSanPham', sortOrder: 'desc' })
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    console.log(error);
                    if (error instanceof TypeError) {
                        console.log(error);
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }

                });
        } else {
            console.log('hành động sửa')
            fetch(urlUpdateFinishedProduct, {
                method: 'PUT',
                headers: {
                    'ss': getCookie('ss'),
                },
                body: formData
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
                    console.log(error);
                    if (error instanceof TypeError) {
                        console.log(error);
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }

                });
        }
    }
    //đọc tiền bằng chữ
    const [words, setWords] = useState('');
    // Config reading options
    const config = new ReadingConfig()
    config.unit = ['đồng']
    // thay đổi đọc chữ
    useEffect(() => {
        setWords(doReadNumber(config,dataReq.GiaBan.toString()))
    }, [dataReq.GiaBan]);

    //xử  lý thay đổi giá bằng combos:
    const handleComboboxChange = (event) => {
        setDataReq({
            ...dataReq,
            GiaBan: Number(event.target.value)
        });
    };
    return (
        <div className="popup-box">
            <div className="box">
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4>Thông Tin Sản Phẩm Thành Phẩm<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                            <form onSubmit={handleSubmit}>
                                {/* <div className="form-group">
                                    <label>Mã Nhân Viên</label>
                                    <input
                                        id="editSoHD"
                                        type="text"
                                        className="form-control"
                                        readOnly
                                        style={{ opacity: 0.5, cursor: "not-allowed" }}
                                        value=''
                                    />
                                </div> */}
                                <div className="row">
                                    <div className='col-6'>
                                        <div className="form-group">
                                            <label>Tên Sản Phẩm {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TenSanPham}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        TenSanPham: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <Combobox
                                            combos={combos1}
                                            columnValue="IDDonViTinh"
                                            columnAdd="TenDonViTinh"
                                            nameCombo="Đơn Vị Tính: "
                                            batBuocNhap={batBuocNhap}
                                            //defaultValue=''
                                            value={dataReq.IDDonViTinh}
                                            onChange={handleDonViTinhChange}
                                        />
                                        <div className="form-group">
                                            <label>Mô Tả</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.MoTa}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        MoTa: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <ImageUpload />
                                    </div>
                                    <div className='col-6'>
                                        <label>Giá Sản Phẩm: {batBuocNhap} ㅤ</label>
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={dataReq.GiaBan}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        GiaBan: Number(event.target.value)
                                                    });
                                                }}
                                            />
                                            {
                                                words.length > 0 ? <label>{words}</label> : null
                                            }
                                        </div>
                                        {!props.isInsert &&
                                            <div className="form-group">
                                                <label>Giá Trước Đó:ㅤ</label>
                                                <select
                                                    className="form-select-sm"
                                                    value={dataReq.GiaBan}
                                                    onChange={handleComboboxChange}
                                                >
                                                    {combos3.map((combo) => (
                                                        <option key={combos3.IDGia} value={combo.GiaBan}>
                                                            {`${combo.GiaBan}đ Ngày Áp Dụng ${combo.NgayApDung}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        }
                                        <label>Loại Sản Phẩm: ㅤ</label>
                                        <div className="form-group"
                                            style={{ maxHeight: '190px', overflow: 'auto' }}
                                        >
                                            {combos2.map(combo => (
                                                <div key={combo.IDLoaiSanPham} >
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                (dataReq.IDLoaiSanPham?.includes(combo.IDLoaiSanPham)) || false
                                                            }
                                                            onChange={() => handleLoaiSanPhamChange(combo.IDLoaiSanPham)}
                                                        />
                                                        {` ${combo["IDLoaiSanPham"]} - ${combo["TenLoaiSanPham"]}`}
                                                    </label>
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

export default Insert_updateSPThanhPham;