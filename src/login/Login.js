import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "../components/Cookie";
import curvedImage from '../assets/img/logos/logo2-removebg-preview.png';
import unidecode from 'unidecode';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { urlCheckLogin, urlLogin } from "../components/url";
function Login() {
    //Kiểm tra đăng nhập trang login
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);// kiểm tra đăng nhập
    useEffect(() => {
        const url = urlCheckLogin; // Đường dẫn API của bạn
        const data = {
            ss: getCookie("ss")
            //ss: '1'
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                setIsLoading(false);
                if (result.success == true) {
                    const menuPath = unidecode(result.menu[0]).replace(/\s+/g, '') // Loại bỏ dấu cách
                    //window.location.href = `/${menuPath}`;//Chuyển trang
                    navigate(`/${menuPath}`);
                    //router.push("/NhanVien");
                }
            })
            .catch(error => {
                alert("Không thể kết nối tới máy chủ")
            });
    }, []);

    //--
    //hàm xử lý  bắt lỗi
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [titleError, setTitleError] = useState('');
    const [error, setError] = useState(false);//hiển thị lỗi
    const [isSubmitting, setIsSubmitting] = useState(false);// trạng thái bấm nút đăng nhập
    const handleEmailChange = (event) => {
        setError(false);
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setError(false);
        setPassword(event.target.value);
    };
    const emailRegex = /^[^ @]+@[^ @]+\.[^ @]+$/;

    const handleSubmit = () => {
        if (!email || !password) {
            setTitleError("Vui lòng nhập đầy đủ thông tin đăng nhập.");
            setError(true);
            setIsSubmitting(false); // Đặt isSubmitting thành false nếu có lỗi không nhập
            return;
        }else if (!emailRegex.test(email)) {
            setTitleError("Email không đúng định dạng.");
            setError(true);
            setIsSubmitting(false);
            return;
        }
        if (isSubmitting) {
            return; // Ngăn chặn việc bấm nút nếu đã gửi yêu cầu trước đó
        }

        setIsSubmitting(true);

        setError(false);
        console.log('Đang đăng nhập');
        // Thực hiện xử lý đăng nhập
        // Gọi API
        const data = {
            Email: email,
            MatKhau: password
        };
        fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                setIsSubmitting(false);
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
                setCookie('ss', `${data.cookieValue}`, 3);
                setCookie('IDDoiTac', `${data.IDDoiTac}`, 3);
                window.location.reload();
            })
            .catch(error => {
                setIsSubmitting(false);
                if (error instanceof TypeError) {
                    setTitleError("Không thể kết nối tới máy chủ")
                    setError(true);
                } else {
                    setTitleError(error.message)
                    setError(true);
                }

            });

    };
    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };
    if (isLoading) {
        return <h4 className="loading">Đang Kiểm Tra Đăng Nhập...</h4>
    } else {
        return (
            <div class="container">
                <div class="row">
                    <div className="col-md-6">
                        <div className="d-none d-md-block">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <img style={{ width: '60%', marginTop: '25%' }} src={curvedImage} alt="Curved Image" />
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                        <div style={{ backgroundColor: 'white' }} class="card card-plain mt-8">
                            <div class="card-header pb-0 text-left bg-transparent">
                                <h3 class="font-weight-bolder text-primary">Đăng Nhập</h3>
                                <p class="mb-0">Truy Cập Vào Hệ Thống Của Bạn</p>
                            </div>
                            <div class="card-body">
                                <form role="form">
                                    <label>Email</label>
                                    <div class="mb-3">
                                        <input
                                            autoFocus
                                            value={email}
                                            onChange={handleEmailChange}
                                            type="text"
                                            class="form-control"
                                            placeholder="Nhập Email"
                                            aria-label="Email" a
                                            ria-describedby="email-addon"
                                            onKeyDown={handleEnterKeyPress}
                                            autoCapitalize="none"
                                        />
                                    </div>
                                    <label>Mật Khẩu</label>
                                    <div class="mb-3">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            class="form-control"
                                            placeholder="Nhập Mật Khẩu"
                                            aria-label="Mật Khẩu"
                                            aria-describedby="password-addon"
                                            onKeyDown={handleEnterKeyPress}
                                            autoCapitalize="none"
                                        />
                                    </div>
                                    {error && <div style={{ color: 'red' }}>{titleError}</div>}
                                    <div className="text-center">
                                        <button onClick={handleSubmit} disabled={isSubmitting} type="button" className="btn bg-gradient-primary w-100 mt-4 mb-0">
                                            {isSubmitting ? 'Đang xử lý...' : 'Đăng Nhập'}
                                        </button>
                                    </div>
                                    {/* <p style={{ margin: '0',marginTop:'1rem', fontSize: '0.7em', textAlign: 'center', fontWeight: 'bolder' }}>Tài Khoản Trải Nghiệm</p>
                                    <table class="table align-items-center mb-0" style={{ fontSize: '0.7em', textAlign: 'center' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10"></th>
                                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Tài Khoản</th>
                                                <th style={{ textAlign: 'center', padding: 8 }} class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-10">Mật Khẩu</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Quản Trị Viên</td>
                                                <td>admin</td>
                                                <td>admin</td>
                                            </tr>
                                            <tr>
                                                <td>Nhân Viên</td>
                                                <td>nhanvien</td>
                                                <td>nhanvien</td>
                                            </tr>
                                        </tbody>

                                    </table> */}
                                </form>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
export default Login