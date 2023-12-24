import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'
import { useNavigate } from 'react-router-dom';
import Combobox from "../Combobox";
import { getCookie, deleteCookie } from "../Cookie";
import { urlGetMatchShifts, urlInsertCloseShifts, urlUpdateCloseShifts } from "../url"
const Logout_ChotCa = (props) => {
    const navigate = useNavigate();
    //xử lý redux
    const dispatch = useDispatch()
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        IDNhanVien: props.thongTinDangNhap.NhanVien.IDNhanVien,
        //Tiền đầu ca
        TienDauCa: '0'
    });
    const [combosMatchShifts, setCombosMatchShifts] = useState([]);//danh sách vị trí công việc
    //combo vị trí công việc
    function handleMatchShiftsChange(selectedValue) {
        setDataReq({
            ...dataReq,
            IDCaLamViec: selectedValue
        });
    }
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);
    }, [dataReq]);
    //bắt buộc nhập
    const batBuocNhap = <span style={{ color: 'red' }}>*</span>;
    useEffect(() => {
        if (props.thongTinDangNhap.shiftsNotClosed === true) {
            setDataReq(props.thongTinDangNhap.listShiftsNotClosed[0])
        } else {
            dispatch({ type: 'SET_LOADING', payload: true });
            fetch(`${urlGetMatchShifts}`, {
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
                    setCombosMatchShifts(data.MatchShifts)
                    setDataReq({
                        ...dataReq,
                        NgayLamViec: data.DateCurrent,
                        IDCaLamViec: data.MatchShifts[0].IDCaLamViec
                    });
                    //ẩn loading
                    dispatch({ type: 'SET_LOADING', payload: false })
                })
                .catch(error => {
                    dispatch({ type: 'SET_LOADING', payload: false })
                    if (error instanceof TypeError) {
                        alert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        alert(error.message, 'warning', 5000)
                    }

                });
        }
    }, []);
    const handleSubmit = (isCloseShifts) => {
        if (dataReq.TienDauCa && dataReq.TienChotCa) {
            dispatch({ type: 'SET_LOADING', payload: true })
            var data;
            //xử lý lại ngày định dạng trước khi gửi lên server
            const dateParts = dataReq.NgayLamViec.split('/');
            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2];
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedDate = `${year}/${formattedMonth}/${formattedDay}`;
            if (isCloseShifts) data = {
                IDCaLamViec: dataReq.IDCaLamViec,
                IDNhanVien: dataReq.IDNhanVien,
                NgayLamViec: formattedDate,
                TienDauCa: dataReq.TienDauCa,
                TienChotCa: dataReq.TienChotCa,
                IDNhanVien: dataReq.IDNhanVien,
                XacNhanNhanCa: true,
                XacNhanGiaoCa: true,
                GhiChu: dataReq.GhiChu
            };
            else data = {
                IDCaLamViec: dataReq.IDCaLamViec,
                IDNhanVien: dataReq.IDNhanVien,
                NgayLamViec: formattedDate,
                TienDauCa: dataReq.TienDauCa,
                TienChotCa: dataReq.TienChotCa,
                IDNhanVien: dataReq.IDNhanVien,
                XacNhanNhanCa: true,
                XacNhanGiaoCa: false,
                GhiChu: dataReq.GhiChu
            };
            if (props.thongTinDangNhap.shiftsNotClosed === true) {
                //cập nhật chốt ca khi thu ngân chưa chốt
                data = {
                    ...data,
                    IDChotCa: dataReq.IDChotCa,
                    NgayLamViec: dataReq.NgayLamViec
                }
                fetch(urlUpdateCloseShifts, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (response.status === 200) {
                            // reload trang
                            deleteCookie('ss')
                            dispatch({ type: 'SET_LOADING', payload: false })
                            navigate(`/`);
                        } else if (response.status === 401) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else if (response.status === 400) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else if (response.status === 500) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else {
                            return;
                        }
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        if (error instanceof TypeError) {
                            alert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            alert(error.message)
                        }
                    });
            } else {
                //thêm chốt ca khi thu ngân muốn đăng xuất
                fetch(urlInsertCloseShifts, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ss': getCookie('ss'),
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (response.status === 200) {
                            // reload trang
                            deleteCookie('ss')
                            dispatch({ type: 'SET_LOADING', payload: false })
                            navigate(`/`);
                        } else if (response.status === 401) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else if (response.status === 400) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else if (response.status === 500) {
                            return response.json().then(errorData => { throw new Error(errorData.message); });
                        } else {
                            return;
                        }
                    })
                    .catch(error => {
                        dispatch({ type: 'SET_LOADING', payload: false })
                        if (error instanceof TypeError) {
                            alert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                        } else {
                            alert(error.message)
                        }
                    });
            }
        }
        else {
            alert('Vui lòng nhập đầy đủ thông tin. Các trường có dấu * là bắt buộc nhập')
        }
    }
    //đọc tiền bằng chữ
    const [words, setWords] = useState('');
    const [words2, setWords2] = useState('');
    // Config reading options
    const config = new ReadingConfig()
    config.unit = ['đồng']

    return (
        <div className="popup">
            <div className="popup-box">
                <div className="box">
                    <div className="conten-modal">
                        <div>
                            <div className="bg-light px-4 py-3">
                                <h4 id='tieudepop'>Xác Nhận Giao Ca<span style={{ color: 'blue' }}>ㅤ{props.iDAction}</span></h4>
                                <form>
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label>Tên Nhân Viên</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={props.thongTinDangNhap.NhanVien.TenNhanVien}
                                                    disabled
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Ngày Làm Việc</label>
                                                {
                                                    props.thongTinDangNhap.shiftsNotClosed ?
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={
                                                                new Date(dataReq.NgayLamViec).getDate() +
                                                                '/' +
                                                                (new Date(dataReq.NgayLamViec).getMonth() + 1) +
                                                                '/' +
                                                                new Date(dataReq.NgayLamViec).getFullYear()
                                                            }
                                                            disabled
                                                        />
                                                        :
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={dataReq.NgayLamViec}
                                                            disabled
                                                        />
                                                }

                                            </div>
                                            {
                                                props.thongTinDangNhap.shiftsNotClosed ?
                                                    <div className="form-group">
                                                        <label>Ca Làm Việc</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={dataReq.TenCaLamViec}
                                                            disabled
                                                        />
                                                    </div>
                                                    :
                                                    <Combobox
                                                        combos={combosMatchShifts}
                                                        columnValue="IDCaLamViec"
                                                        columnAdd="TenCaLamViec"
                                                        nameCombo="Ca Làm Việc: "
                                                        batBuocNhap={batBuocNhap}
                                                        //defaultValue=''
                                                        value={dataReq.IDCaLamViec}
                                                        onChange={handleMatchShiftsChange}
                                                    />
                                            }
                                        </div>
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label>Tiền Đầu Ca</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={dataReq.TienDauCa}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            TienDauCa: event.target.value
                                                        });
                                                        setWords(doReadNumber(config, event.target.value))
                                                    }}
                                                />
                                                {
                                                    words.length > 0 ? <label>{words}</label> : null
                                                }
                                                
                                            </div>
                                            <div className="form-group">
                                                <label>Tiền Chốt Ca</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={dataReq.TienChotCa}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            TienChotCa: event.target.value
                                                        });
                                                        setWords2(doReadNumber(config, event.target.value))
                                                    }}
                                                />
                                                {
                                                    words2.length > 0 ? <label>{words2}</label> : null
                                                }
                                            </div>
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

                                    <button
                                        onClick={() => { props.setPopupChotCa(false) }} type="button"
                                        className="btn btn-danger mt-3" >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={() => { handleSubmit(true) }}
                                        style={{ float: "right", marginLeft: '10px' }} type="button"
                                        className="btn btn-primary mt-3"
                                    >
                                        Đăng Xuất & Giao Ca
                                    </button>
                                    <button
                                        onClick={() => { handleSubmit(false) }}
                                        style={{ float: "right" }} type="button"
                                        className="btn btn-dark mt-3"
                                    >
                                        Đăng Xuất & Không Giao Ca
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div>
    );
}
export default Logout_ChotCa;