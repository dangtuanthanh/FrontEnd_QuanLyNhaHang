import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { getCookie } from "../Cookie";
import Insert_updateRole from "./Insert_updateRole";
import { urlRegister, urlRegisterCode } from "../url"
import { useNavigate } from 'react-router-dom';

const ThongTinDoanhNghiep = (props) => {
    //xử lý redux
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [themVTTC, setThemVTTC] = useState(false);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    const [isCode, setIsCode] = useState(false);// hiển thị form mã xác thực
    const [code, setCode] = useState('');

    //xử lý xác nhận
    const emailRegex = /^[^ @]+@[^ @]+\.[^ @]+$/;
    const phoneRegex = /^\+?[0-9\s\-().]*$/;
    const [timeLeft, setTimeLeft] = useState(30);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(time => time - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);
    const handleSubmit = (e) => {
        // kiểm tra không nhập
        //e.preventDefault();
        if (props.dataReq.Email &&
            props.dataReq.MatKhau &&
            props.dataReq.NgaySinh &&
            props.dataReq.DiaChi &&
            props.dataReq.SoDienThoai &&
            props.dataReq.TenDoanhNghiep
        ) {
            //kiểm tra định dạng email
            if (emailRegex.test(props.dataReq.Email)) {
                if (phoneRegex.test(props.dataReq.SoDienThoai)) {
                    dispatch({ type: 'SET_LOADING', payload: true })
                    fetch(urlRegister, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(props.dataReq)
                    })
                        .then(response => {
                            if (response.status === 200) {
                                return response.json();
                            } else if (response.status === 401) {
                                return response.json().then(errorData => { throw new Error(errorData.message); });
                            } else if (response.status === 500) {
                                return response.json().then(errorData => { throw new Error(errorData.message); });
                            } else if (response.status === 400) {
                                return response.json().then(errorData => { throw new Error(errorData.message); });
                            }
                            else {
                                return;
                            }
                        })
                        .then(data => {
                            setIsCode(true)
                            setTimeLeft(30);
                            //props.addNotification(data.message, 'success', 3000)
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
                } else props.openPopupAlert('Số điện thoại không đúng định dạng')
            } else props.openPopupAlert('Email không đúng định dạng')
        }
        else props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
    };
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const handleCodeChange = (event) => {
        setCode(event.target.value);
    };
    // xử lý xác thực code
    const handleSubmit2 = () => {
        if (code) {
            dispatch({ type: 'SET_LOADING', payload: true })
            // Gọi API
            const data = {
                Code: code
            };
            fetch(urlRegisterCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else if (response.status === 401) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    }
                    else if (response.status === 400) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else if (response.status === 500) {
                        return response.json().then(errorData => { throw new Error(errorData.message); });
                    } else {
                        return;

                    }
                })
                .then(data => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    props.addNotification('Đăng Ký Thành Công', 'success', 3000)
                    navigate(`/Login`);
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
        else props.openPopupAlert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')

    }
    return (
        <div className="popup-box" >
            <div className="box" style={{
                width: isMobile && '100%'
            }}>
                <div className="conten-modal" >
                    <div>
                        <div className="bg-light px-4 py-3" >
                            <form
                                style={{
                                    maxHeight: isMobile ? '74vh' : '530px',
                                    overflow: 'auto',
                                    overflowX: 'hidden'
                                }}
                            >
                                <h4 style={{ textAlign: "center", fontWeight: 'bolder' }}>{isCode ? 'Xác Thực Email' : 'Thiết Lập Tài Khoản Quản Trị Viên'}</h4>
                                {isCode ?
                                    <form role="form">
                                        <div>
                                            <label>Nhập Mã Xác Thực Đã Được Gửi Đến Email {batBuocNhap}</label>
                                            <div class="mb-3">
                                                <input
                                                    type="text"
                                                    value={code}
                                                    onChange={handleCodeChange}
                                                    class="form-control"
                                                    placeholder="Nhập Mã"
                                                />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '5px', flexDirection: 'column' }}>
                                            {
                                                timeLeft > 0 ?
                                                    <span
                                                        style={{ color: '#ff8c00', textAlign: 'center' }}
                                                    >Gửi Lại Mã ({timeLeft} giây)
                                                    </span>
                                                    : <span
                                                        style={{ color: '#ff8c00', textAlign: 'center' }}
                                                        onClick={handleSubmit}
                                                    >Gửi Lại Mã
                                                    </span>
                                            }
                                        </div>

                                    </form>
                                    :
                                    <form role="form">
                                        <div className="form-group">
                                            <label>Email {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={props.dataReq.Email}
                                                onChange={(event) => {
                                                    props.setDataReq({
                                                        ...props.dataReq,
                                                        Email: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Mật Khẩu {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={props.dataReq.MatKhau}
                                                onChange={(event) => {
                                                    props.setDataReq({
                                                        ...props.dataReq,
                                                        MatKhau: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày Sinh {batBuocNhap}</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                onChange={(event) => {
                                                    props.setDataReq({
                                                        ...props.dataReq,
                                                        NgaySinh: event.target.value
                                                    });
                                                }}
                                                value={props.dataReq.NgaySinh}
                                            //  defaultValue='' 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Địa Chỉ {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={props.dataReq.DiaChi}
                                                onChange={(event) => {
                                                    props.setDataReq({
                                                        ...props.dataReq,
                                                        DiaChi: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Số Điện Thoại {batBuocNhap}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={props.dataReq.SoDienThoai}
                                                onChange={(event) => {
                                                    props.setDataReq({
                                                        ...props.dataReq,
                                                        SoDienThoai: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="form-group"
                                            style={{ marginBottom: '0px' }}
                                            // onClick={() => {
                                            //     alert("Tính năng này đang được phát triển")
                                            // }}
                                        >
                                            <label >
                                                <input
                                                    type="checkbox"
                                                     checked={props.dataReq.SuDungDuLieuMau}
                                                     onChange={() => {
                                                        props.setDataReq({
                                                            ...props.dataReq,
                                                            SuDungDuLieuMau: !props.dataReq.SuDungDuLieuMau
                                                        });
                                                    }}
                                                />

                                                ㅤSử dụng dữ liệu mẫu
                                            </label>
                                        </div>
                                    </form>
                                }


                            </form>
                            <div>
                                <button onClick={() => {
                                    if (isCode)
                                        setIsCode(!isCode)
                                    else
                                        props.setPopup1(false)
                                }} type="button" className="btn btn-danger mt-3" >{isCode ? 'Quay Lại' : 'Huỷ Bỏ'}</button>
                                <button
                                    onClick={() => {
                                        if (isCode)
                                            handleSubmit2()
                                        else
                                            handleSubmit()
                                    }}
                                    style={{ float: "right" }} type="button"
                                    className="btn btn-primary mt-3"
                                >
                                    Xác Nhận
                                </button>
                            </div>
                            {/* {
                                themVTTC && <div className="popup">
                                    <Insert_updateRole
                                        isInsert={true}
                                        setPopupInsertUpdate={setThemVTTC}
                                        dataUser={dataUser}
                                        setdataUser={setdataUser}
                                        addNotification={props.addNotification}
                                        openPopupAlert={props.openPopupAlert}
                                    />
                                </div>
                            } */}

                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ThongTinDoanhNghiep;