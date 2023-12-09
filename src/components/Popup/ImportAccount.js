import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFastBackward, faStepBackward, faStepForward, faFastForward } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { getCookie } from "../Cookie";
import { urlImportExcelAccount } from "../url";
const ImportAccount = (props) => {
    //xử lý redux
    const dispatch = useDispatch()
    //dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        TenNhanVien: 'B',
        IDViTriCongViec: 'C',
        NgaySinh: 'D',
        GioiTinh: 'E',
        DiaChi: 'F',
        SoDienThoai: 'G',
        TinhTrang: 'H',
        NgayVao: 'I'
    });
    //danh sách thông báo thành công
    const [successImport, setSuccessImport] = useState('');
    ////danh sách thông báo thất bại
    const [listErrors, setListErrors] = useState([]);
    //trạng thái chọn file
    const [file, setFile] = useState(undefined);
    //xử lý chọn file
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    }
    //xử lý khi nhập
    useEffect(() => {
        console.log(dataReq);
    }, [dataReq]);
    //hàm xử lý reset dữ liệu
    const resetDataReq = () => {
        setDataReq({
            TenNhanVien: 'B',
            IDViTriCongViec: 'C',
            NgaySinh: 'D',
            GioiTinh: 'E',
            DiaChi: 'F',
            SoDienThoai: 'G',
            TinhTrang: 'H',
            NgayVao: 'I'
        })
    }
    // Hàm kiểm tra trùng giá trị
    function checkDuplicate(values) {
        for (let i = 0; i < values.length; i++) {
            for (let j = i + 1; j < values.length; j++) {
                if (values[i] === values[j]) {
                    return true;
                }
            }
        }
        return false;
    }
    const handleImportData = async () => {
        let isValid = true;
        if (!file) {
            props.openPopupAlert("Vui lòng chọn file");
            isValid = false;
        }
        // Lấy dữ liệu
        const thongtinElements = document.querySelectorAll('.thongtin');
        const values = [];

        thongtinElements.forEach(el => {
            values.push(el.value);
        });

        // Kiểm tra các trường hợp
        values.forEach(value => {
            if (!value) {
                isValid = false;
                props.addNotification('Vui lòng nhập "Vị trí các cột dữ liệu trong file Excel" .', 'warning', 5000);
            }
        });

        if (checkDuplicate(values)) {
            isValid = false;
            props.addNotification('Tên các cột dữ liệu không được phép trùng nhau.', 'warning', 4000);
        }

        // Nếu hợp lệ
        if (isValid) {
            // submit
            dispatch({type: 'SET_LOADING', payload: true})
            const formData = new FormData();
            formData.append('file', file);
            for (const key in dataReq) {
                if (dataReq.hasOwnProperty(key)) {
                    formData.append(key, dataReq[key]);
                }
            }
            fetch(urlImportExcelAccount, {
                method: 'POST',
                headers: {
                    'ss': getCookie('ss')
                },
                body: formData
            }).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 401) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                } else if (response.status === 500) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                }else if (response.status === 400) {
                    return response.json().then(errorData => { throw new Error(errorData.message); });
                }
                 else {
                    return;
                }
            }).then(data => {
                setSuccessImport(data.success);
                //setErrorImport(data.error);
                setListErrors(data.errorImport);
                dispatch({type: 'SET_LOADING', payload: false})
                props.setdataUser({ ...props.dataUser, sortBy: 'IDNhanVien', sortOrder: 'desc' })
            })
                .catch(error => {
                    dispatch({type: 'SET_LOADING', payload: false})
                    if (error instanceof TypeError) {
                        props.openPopupAlert('Không thể kết nối tới máy chủ. Vui lòng kiểm tra đường truyền kết nối!')
                    } else {
                        props.addNotification(error.message, 'warning', 5000)
                    }
                });
        }
    }
    return (
        <div className="popup-box">
            <div className="box">
                <div className="conten-modal">
                    <div>
                        <div
                            style={{ width: '80%', height: '550px', overflowY: 'auto' }}
                            className="bg-light px-4 py-3"
                        >
                            <h3 style={{ textAlign: 'center' }} id='tieudepop'>Nhập Dữ Liệu</h3>
                            <form>
                                <br></br>
                                <div style={{ textAlign: 'center' }}>
                                    <input
                                        className="form-control"
                                        type="file"
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                        onChange={handleFileChange} /><br></br>
                                </div>
                                <h5>Vị trí các cột dữ liệu trong file Excel:</h5>
                                <div className="row">
                                    <div className='col-3'>
                                        <div className="form-group">
                                            <label>Tên Nhân Viên</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.TenNhanVien}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            TenNhanVien: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        TenNhanVien: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Địa Chỉ</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.DiaChi}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            DiaChi: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        DiaChi: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <div className='col-3'>
                                        <div className="form-group">
                                            <label>ID Vị Trí Công Việc</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.IDViTriCongViec}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            IDViTriCongViec: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        IDViTriCongViec: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Số Điện Thoại</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.SoDienThoai}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            SoDienThoai: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        SoDienThoai: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>

                                    </div>
                                    <div className='col-3'>
                                        <div className="form-group">
                                            <label>Ngày Sinh</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.NgaySinh}
                                                onChange={(event) => {
                                                    if (event.target.value.length > 3) {
                                                        props.addNotification('Bạn chỉ được phép nhập không quá 3 ký tự', 'warning', 3000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            NgaySinh: event.target.value.slice(0, 3).toUpperCase()
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        NgaySinh: event.target.value.toUpperCase()
                                                    });

                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tình Trạng</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.TinhTrang}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            TinhTrang: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        TinhTrang: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-3'>
                                        <div className="form-group">
                                            <label>Giới Tính</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.GioiTinh}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            GioiTinh: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        GioiTinh: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ngày Vào</label>
                                            {/* <label>Tên Nhân Viên {batBuocNhap}</label> */}
                                            <input
                                                type="text"
                                                className="form-control thongtin"
                                                value={dataReq.NgayVao}
                                                onChange={(event) => {
                                                    const columnInputRegex = /^[A-Za-z]{1,3}$/;
                                                    if (!columnInputRegex.test(event.target.value)) {
                                                        props.addNotification('Bạn nhập ký tự không hợp lệ hoặc vượt quá 3 ký tự.', 'warning', 4000)
                                                        setDataReq({
                                                            ...dataReq,
                                                            NgayVao: ''
                                                        });
                                                    } else setDataReq({
                                                        ...dataReq,
                                                        NgayVao: event.target.value.toUpperCase()
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-sm "
                                            onClick={resetDataReq}
                                        >Đặt lại thông số</button>
                                    </div>
                                </div>
                                <div id="ketQuaImport">
                                    <h4 style={{ color: 'blue' }}>Kết Quả : </h4>
                                    <h5>Nhập Thành Công Các Hàng Dữ Liệu: {successImport}</h5>
                                    <div>
                                        {listErrors.map((item) => (
                                            <h6 style={{ color: 'red' }} key={item}>
                                                {item}
                                            </h6>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div
                            style={{ width: '80%' }}
                            className="bg-light px-4 py-3"
                        >
                            <button
                                style={{
                                    float: "right"
                                }}
                                onClick={handleImportData}
                                type="button"
                                className="btn btn-primary mt-3"
                                id="xacnhan">
                                Xác Nhận
                            </button>

                            <button onClick={props.onClose} type="button" className="btn btn-danger mt-3" id="send">Huỷ Bỏ</button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportAccount;