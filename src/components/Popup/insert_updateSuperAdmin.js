import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import Combobox from "../Combobox";
import SearchComBoBox from "../SearchCombobox";
import { getCookie } from "../Cookie";
import Insert_updateJobPosition from "./Insert_updateJobPosition";
import Insert_updateRole from "./Insert_updateRole";
import { urlGetPartner } from "../url"
import { data } from "jquery";

const Insert_updateSuperAdmin = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({});
    useEffect(() => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`${urlGetPartner}?id=${props.iDAction}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ss': getCookie('loginsuperadmin'),
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
                if (props.isInsert === false) {
                    setDataReq(data)
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
    // xử lý ảnh
    //url xử lý hiển thị hình ảnh
    const [urlAnh, setUrlAnh] = useState();
    useEffect(() => {
        if (dataReq.Logo && dataReq.Logo instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh(URL.createObjectURL(dataReq.Logo));
        } else setUrlAnh(dataReq.Logo);
    }, [dataReq.Logo]);
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
                            Logo: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    Logo: undefined
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
                            Logo: file // Lưu file hình ảnh vào dataReq
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
                <label>Logo</label>
                <div
                    style={{ textAlign: 'center', border: '1px dashed #ccc', padding: '0.5rem' }}
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
                    {dataReq.Logo && (
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
    // hình ảnh 2
    const [urlAnh2, setUrlAnh2] = useState();
    useEffect(() => {
        if (dataReq.AnhThanhToan && dataReq.AnhThanhToan instanceof File) { // Kiểm tra kiểu dữ liệu
            setUrlAnh2(URL.createObjectURL(dataReq.AnhThanhToan));
        } else setUrlAnh2(dataReq.AnhThanhToan);
    }, [dataReq.AnhThanhToan]);

    function ImageUpload2() {
        const fileInputRef2 = useRef(null);

        const handleImageChange2 = (event) => {
            const file = event.target.files[0];
            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            AnhThanhToan: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            } else {
                setDataReq({
                    ...dataReq,
                    AnhThanhToan: undefined
                });
            }
        };

        const handleChooseFileClick2 = () => {
            fileInputRef2.current.click();
        };

        const handleDrop2 = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            if (file) {
                // Kiểm tra xem file có phải là hình ảnh hay không
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        setDataReq({
                            ...dataReq,
                            AnhThanhToan: file // Lưu file hình ảnh vào dataReq
                        });
                    };
                    reader.readAsDataURL(file);
                } else {
                    props.openPopupAlert('Bạn chỉ có thể chọn file hình ảnh.')
                }
            }
        };

        const handleDragOver2 = (event) => {
            event.preventDefault();
        };

        return (
            <div className="form-group">
                <label>Ảnh Thanh Toán</label>
                <div
                    style={{ textAlign: 'center', border: '1px dashed #ccc', padding: '0.5rem' }}
                    onClick={handleChooseFileClick2}
                    onDrop={handleDrop2}
                    onDragOver={handleDragOver2}
                >
                    <span style={{ color: 'blue' }}>Chọn file</span> hoặc Kéo và thả ảnh vào đây
                    <input
                        ref={fileInputRef2}
                        type="file"
                        accept="image/*" // Chỉ chấp nhận các file hình ảnh
                        style={{ display: 'none' }}
                        onChange={handleImageChange2}
                    />
                    {dataReq.AnhThanhToan && (
                        <img
                            src={urlAnh2} // Sử dụng URL.createObjectURL để hiển thị hình ảnh đã chọn
                            alt="Selected"
                            style={{ maxHeight: '112px', marginTop: '10px' }}
                        />
                    )}
                </div>
            </div>
        );
    }
    const isMobile = useSelector(state => state.isMobile.isMobile)
    return (
        <div className="popup-box">
            <div className="box" style={{ marginTop: '1%', padding: '1rem', width: isMobile && '100%' }}>
                <div className="conten-modal">
                    <div>
                        <div className="bg-light px-4 py-3">
                            <h4 id='tieudepop'>Thông Tin Đối Tác<span style={{ color: 'blue', fontSize: "0.9em" }}>ㅤ{props.iDAction}</span></h4>
                            <form
                                // <form onSubmit={handleSubmit}
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}>
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
                                <div className={`${isMobile ? 'flex-column' : 'row'}`}>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                        <div className="form-group">
                                            <label>Tên Doanh Nghiệp</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.TenDoanhNghiep}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        TenDoanhNghiep: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.Email}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        Email: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Địa Chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.DiaChi}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        DiaChi: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Số Điện Thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={dataReq.SoDienThoai}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        SoDienThoai: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày Đăng Ký</label>
                                            <input
                                                type="date"
                                                style={{ marginBottom: 0 }}
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayDangKy: event.target.value
                                                    });
                                                }}
                                                value={dataReq.NgayDangKy} />
                                        </div>
                                        <div className="form-group">
                                            <label>Phần Trăm Điểm Tích Luỹ Khách Hàng ㅤ</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={dataReq.PhanTramDiemTichLuy}
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        PhanTramDiemTichLuy: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <div className={`${isMobile ? 'col-12' : 'col-6 '}`}>
                                       
                                        <div className="form-group">
                                            <label>Ngày Hết Hạn</label>
                                            <input
                                                type="date"
                                                style={{ marginBottom: 0 }}
                                                className="form-control"
                                                onChange={(event) => {
                                                    setDataReq({
                                                        ...dataReq,
                                                        NgayHetHan: event.target.value
                                                    });
                                                }}
                                                value={dataReq.NgayHetHan} />
                                        </div>
                                        <ImageUpload />
                                        <ImageUpload2 />
                                    </div>

                                </div>
                            </form>
                            <button
                                onClick={() => { props.setPopupInsertUpdate(false) }}
                                type="button"
                                style={{ marginBottom: 0 }}
                                className="btn btn-danger" >
                                Đóng
                            </button>
                            {/* <button
                                // onClick={handleSubmit}
                                style={{ float: "right", marginBottom: 0 }}
                                type="button"
                                className="btn btn-primary"
                            >
                                Xác Nhận
                            </button> */}

                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Insert_updateSuperAdmin;