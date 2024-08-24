import curvedImage from '../assets/img/logos/logo.png';
import chucNang1 from '../assets/img/landing/chucnang1.jpg';
import chucNang2 from '../assets/img/landing/chucnang2.jpg';
import chucNang3 from '../assets/img/landing/chucnang3.jpg';
import chucNang4 from '../assets/img/landing/chucnang4.jpg';
import chucNang5 from '../assets/img/landing/chucnang5.jpg';
import chucNang6 from '../assets/img/landing/chucnang6.jpg';

import React, { useState, useEffect, useRef } from "react";
import ThongTinDoanhNghiep from "../components/Popup/ThongTinDoanhNghiep";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom';
import loadingGif from '../assets/img/loading/loading1.gif'
// landing page
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../assets/css/Landing.css'; // Import file CSS tùy chỉnh
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp, faChartLine, faLock, faUsers, faCogs, faLifeRing, faCheck, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import iconFB from '../assets/img/landing/iconFB.png';
import iconZalo from '../assets/img/landing/iconZalo.png';
import iconDT from '../assets/img/landing/iconDT.png';
function Landing() {
    const navigate = useNavigate();
    const location = useLocation();
    const loading = useSelector(state => state.loading.loading)
    //popup thêm,sửa nhân viên
    const [popup1, setPopup1] = useState(false);//trạng thái popup1
    const [dataReq, setDataReq] = useState({
        SuDungDuLieuMau: true
    });
    const [err, setErr] = useState(false);
    useEffect(() => {
        console.log(dataReq);
    }, [dataReq]);
    // popup hộp thoại thông báo
    const [popupAlert, setPopupAlert] = useState(false);//trạng thái thông báo
    const [popupMessageAlert, setPopupMessageAlert] = useState('');
    const [onAction, setOnAction] = useState(() => { });
    const isMobile = useSelector(state => state.isMobile.isMobile)
    const PopupAlert = (props) => {
        return (
            <div className="popup">
                <div className="popup-box">
                    <div className="box" style={{ textAlign: 'center', marginTop: '1%', padding: '1rem', width: isMobile && '100%' }}>
                        <h5>Thông Báo</h5>

                        <p>{props.message}</p>
                        {props.onAction ? <div>
                            <button style={{ float: 'left' }} className="btn btn-danger" onClick={props.onClose}>Thoát</button>
                            <button style={{ float: 'right' }} className="btn btn-success" onClick={handleConfirm}>Xác Nhận</button>
                        </div> :
                            <button className="btn btn-success" onClick={props.onClose}>Xác Nhận</button>
                        }
                    </div>
                </div>
            </div>
        );
    };
    const openPopupAlert = (message, actionHandler) => {
        setPopupMessageAlert(message);
        setPopupAlert(true);
        setOnAction(() => actionHandler);
    }
    const closePopupAlert = () => {
        setPopupAlert(false);
    };
    const handleConfirm = () => {
        onAction();
        closePopupAlert();
    }
    //popup thông báo góc màn hình
    const [notifications, setNotifications] = useState([]);
    const addNotification = (message, btn, duration = 3000) => {
        const newNotification = {
            id: Date.now(),
            message,
            btn,
            duration,
        };
        setNotifications(prevNotifications => [...prevNotifications, newNotification]);
        setTimeout(() => {
            removeNotification(newNotification.id);
        }, duration);
    };
    const removeNotification = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
    };
    const NotificationContainer = ({ notifications }) => {
        return (
            <div className="notification-container">
                {notifications.map(notification => (
                    <div
                        key={notification.id}
                        className={` btn btn-${notification.btn}`}
                        onClick={() => removeNotification(notification.id)}
                    >
                        {notification.message}
                    </div>
                ))}
            </div>
        );
    };
    useEffect(() => {
        const hash = window.location.hash;

        if (hash) {
            const elementId = hash.substring(1);
            const element = document.getElementById(elementId);

            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);
    // landing page
    // Khởi tạo hiệu ứng AOS
    useEffect(() => {
        AOS.init({
            duration: 1500, // Thời gian thực hiện hiệu ứng
            easing: 'ease-in-out', // Hiệu ứng easing
        });
    }, []);
    //cuộn trang đổi nền nav
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Định nghĩa style cho thanh điều hướng dựa trên isScrolled
    const navbarStyle = {
        background: isScrolled
            ? 'white'
            // ? 'linear-gradient(to left,rgb(255, 140, 0) ,rgb(0, 255, 255) )' // Màu nền đục hơn khi cuộn
            : 'rgba(255, 255, 255, 0)', // Màu nền trong suốt khi ở trên cùng
        // backdropFilter: 'blur(5px)', // Làm mờ nền phía sau,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Tạo bóng nhẹ
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Đường viền nhẹ phía dưới
        zIndex: 1000, // Đặt z-index cao để đè lên nội dung
        transition: 'background-color 0.3s ease', // Hiệu ứng chuyển đổi màu nền
    };
    const logoBG = {
        width: '70px',
        height: 'auto',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderRadius: '10px'
    }
    // tại sao lựa chọn chúng tôi
    const taiSao = [
        { icon: faThumbsUp, title: "Dễ sử dụng", description: "Giao diện thân thiện và trực quan giúp bạn quản lý dễ dàng." },
        { icon: faChartLine, title: "Tăng trưởng doanh thu", description: "Tối ưu hoạt động, giúp tăng doanh thu cho doanh nghiệp của bạn." },
        { icon: faLock, title: "Bảo mật cao", description: "Đảm bảo an toàn cho dữ liệu của bạn với hệ thống bảo mật tiên tiến." },
        { icon: faUsers, title: "Quản lý nhân viên", description: "Dễ dàng phân quyền và theo dõi hiệu suất làm việc của nhân viên." },
        { icon: faCogs, title: "Tích hợp linh hoạt", description: "Tích hợp dễ dàng với các hệ thống khác để tối ưu quy trình." },
        { icon: faLifeRing, title: "Hỗ trợ 24/7", description: "Đội ngũ hỗ trợ luôn sẵn sàng giải quyết mọi vấn đề của bạn." }
    ];
    // chức năng
    const features = [
        {
            title: "Quản lý nhân viên và phân quyền",
            content: [
                "Quản lý toàn diện nhân viên từ ca làm việc đến phân quyền chi tiết.",
                "Phân vai trò truy cập và quyền hạn dễ dàng.",
                "Quản lý việc nối ca và chốt ca hoàn hảo."
            ],
            image: chucNang1,
        },
        {
            title: "Quản lý thực đơn và đơn hàng",
            content: [
                "Hiển thị thực đơn chi tiết.",
                "Hỗ trợ gọi món, tách hóa đơn.",
                "Tính toán chính xác số lượng tồn kho."
            ],
            image: chucNang2,
        },
        {
            title: "Quản lý kho và nguyên liệu",
            content: [
                "Theo dõi lượng nguyên liệu tồn kho.",
                "Cập nhật tự động sau mỗi lần chế biến món ăn.",
                "Hỗ trợ nhập và xuất phiếu nguyên liệu nhanh chóng."
            ],
            image: chucNang3,
        },
        {
            title: "Quản lý khách hàng và tích điểm",
            content: [
                "Quản lý khách hàng và xử lý điểm tích lũy.",
                "Tăng cường sự hài lòng và giữ chân khách hàng trung thành."
            ],
            image: chucNang4,
        },
        {
            title: "Quản lý hóa đơn và thanh toán",
            content: [
                "Tự động tính toán tổng tiền.",
                "Áp dụng giảm giá và điểm tích lũy.",
                "Hỗ trợ thanh toán nhanh chóng và in hóa đơn chuyên nghiệp."
            ],
            image: chucNang5,
        },
        {
            title: "Báo cáo doanh thu chi tiết",
            content: [
                "Hiển thị báo cáo doanh thu theo ngày, tháng với đồ thị trực quan.",
                "Dễ dàng phân tích và theo dõi hiệu suất kinh doanh."
            ],
            image: chucNang6,
        }
    ];
    const plans = [
        {
            name: 'Dùng Thử',
            price: 'Miễn phí',
            duration: '7 ngày',
            features: [
                'Truy cập đầy đủ các tính năng cơ bản',
                'Hỗ trợ kỹ thuật qua email',
                'Không yêu cầu thẻ tín dụng'
            ],
            buttonText: 'Đăng ký miễn phí',
            buttonLink: '/#DangKyDungThu',
            highlighted: false
        },
        {
            name: 'Chuyên Nghiệp',
            price: '199.000 VNĐ',
            duration: 'tháng',
            features: [
                'Tất cả tính năng của gói Dùng Thử',
                'Dữ liệu dùng chung trên máy chủ',
                'Hỗ trợ kỹ thuật qua điện thoại',
                'Cập nhật tính năng mới tự động',
                'Báo cáo doanh thu chi tiết'
            ],
            buttonText: 'Liên hệ',
            buttonLink: '#LienHe',
            highlighted: true
        },
        {
            name: 'Doanh Nghiệp',
            price: 'Tùy chỉnh',
            duration: '',
            features: [
                'Tất cả tính năng của gói Chuyên Nghiệp',
                'Máy chủ riêng biệt',
                'Tùy chỉnh tính năng theo yêu cầu',
                'Hỗ trợ kỹ thuật 24/7',
                'Đào tạo nhân viên sử dụng'
            ],
            buttonText: 'Liên hệ',
            buttonLink: '#LienHe',
            highlighted: false
        }
    ];
    const contacts = [
        {
            title: 'Liên hệ Zalo',
            description: 'Liên hệ với tư vấn viên của chúng tôi qua Zalo',
            icon: iconZalo,
            buttonLabel: 'Liên hệ Zalo',
            link: 'https://chat.zalo.me/?c=201228013801410853', // Link to Zalo
        },
        {
            title: 'Liên hệ Facebook',
            description: 'Liên hệ với nhân viên qua Facebook',
            icon: iconFB,
            buttonLabel: 'Liên hệ Facebook',
            link: 'https://m.me/thanhmixed', // Link to Facebook
        },
        {
            title: 'Gọi điện thoại',
            description: 'Liên hệ với nhân viên qua số điện thoại',
            icon: iconDT,
            buttonLabel: 'Gọi điện thoại',
            link: 'tel:0387712368', // Phone number
        },
    ];

    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className={isScrolled ? 'scrolled' : ''} style={{ backgroundColor: '#f9f9f9', overflow: 'hidden' }}>
            {loading && <div className="loading">
                <img src={loadingGif} style={{ width: '30%' }} />
            </div>}
            <NotificationContainer notifications={notifications} />
            <nav className="navbar navbar-expand-lg fixed-top" style={navbarStyle}>
                <div className="container-fluid">
                    {/* Logo */}
                    <a className="navbar-brand" href="/">
                        <img src={curvedImage} alt="VRes Logo" style={logoBG} />
                    </a>
                    {/* Toggle button for responsive navbar */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleNavbar}
                        aria-controls="navbarNav"
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                        style={{ paddingTop: '12px', paddingBottom: '4px' }}
                    >
                        <span className="navbar-toggler-icon">
                            {isOpen ? '✖' : '☰'}
                        </span>
                    </button>
                    {/* Nav Items */}
                    <div className={`collapse navbar-collapse justify-content-end ${isOpen ? 'show' : ''}`} id="navbarNav" >
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a style={{ color: isScrolled ? 'black' : 'white', fontWeight: 'bold' }} className="nav-link active" aria-current="page" href="#trangChu">Trang Chủ</a>
                            </li>

                            <li className="nav-item">
                                <a style={{ color: isScrolled ? 'black' : 'white', fontWeight: 'bold' }} className="nav-link" href="#taiSaoLuaChonChungToi">|ㅤTại Sao Lựa Chọn Chúng Tôi ?</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: isScrolled ? 'black' : 'white', fontWeight: 'bold' }} className="nav-link" href="#tinhNang">|ㅤTính Năng</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: isScrolled ? 'black' : 'white', fontWeight: 'bold' }} className="nav-link" href="#bangGia">|ㅤBảng Giá</a>
                            </li>
                            <li className="nav-item">
                                <a style={{ color: isScrolled ? 'black' : 'white', fontWeight: 'bold' }} className="nav-link" href="#LienHe">|ㅤLiên Hệ</a>
                            </li>
                        </ul>
                        <button
                            className="btn btn-light btn-sm mb-0"
                            onClick={() => {
                                navigate('/Login');
                            }}
                            style={{ marginLeft: '20px', color: isScrolled ? 'black' : 'white', backgroundColor: 'rgb(255 255 255 / 0%)', border: '2px white solid' }}
                        >
                            <FontAwesomeIcon style={{ marginRight: '3px' }} icon={faUserCircle} />
                            Đăng Nhập
                        </button>
                    </div>
                </div>
            </nav>
            {/* banner */}
            <div className="landing-container" id='trangChu'>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    effect="fade"
                    loop
                >
                    {/* Slide 1 */}
                    <SwiperSlide>
                        <div className="slide-content" data-aos="fade-up">
                            <h1>Khám phá VRes ngay hôm nay</h1>
                            <h2>Đơn giản hóa việc quản lý và tăng trưởng doanh nghiệp F&B của bạn!</h2>
                            <div className="cta-buttons">
                                <button
                                    className="btn btn-primary mt-2 mb-0"
                                    onClick={() => navigate('/#DangKyDungThu')}
                                    style={{ marginRight: '1rem' }}
                                >Đăng ký dùng thử ngay</button>
                                <button className="btn btn-primary mt-2 mb-0" onClick={() => navigate('/#taiSaoLuaChonChungToi')}>Tìm hiểu thêm</button>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 2 */}
                    <SwiperSlide>
                        <div className="slide-content" data-aos="fade-up">
                            <h1>Giải pháp tối ưu cho quản lý nhà hàng và quán cà phê</h1>
                            <h2>Nâng cao hiệu quả và tăng trưởng doanh thu nhanh chóng!</h2>
                            <div className="cta-buttons">
                                <button className="btn btn-primary mt-2 mb-0"
                                    onClick={() => navigate('/#tinhNang')}
                                    style={{ marginRight: '1rem' }}
                                >Khám phá</button>
                                <button className="btn btn-primary mt-2 mb-0" onClick={() => navigate('/#LienHe')}>Liên hệ với chúng tôi</button>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            {/* tại sao lựa chọn chúng tôi */}
            <section id='taiSaoLuaChonChungToi' className="why-choose-us" style={{ padding: '50px 0', backgroundColor: '#f9f9f9' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginTop: '40px', marginBottom: '30px', color: '#ff8c00' }}>Tại sao lựa chọn chúng tôi ?</h2>
                    <div className="row">
                        {taiSao.map((feature, index) => (
                            <div className="col-md-4 col-sm-6" key={index} data-aos="fade-up">
                                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                    <FontAwesomeIcon icon={feature.icon} size="4x" style={{ color: '#ff8c00' }} />
                                    <h3 style={{ marginTop: '20px', color: '#333' }}>{feature.title}</h3>
                                    <p style={{ color: '#666' }}>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* chức năng chính */}
            <div id='tinhNang' className="features-section py-5" style={{ backgroundColor: '#f9f9f9' }}>
                <div className="container" >
                    <h2
                        style={{ textAlign: 'center', marginTop: '40px', marginBottom: '30px', color: '#ff8c00' }}>Các tính năng của phần mềm quản lý VRes</h2>

                    {features.map((feature, index) => (
                        <div className={`row feature-row ${index % 2 === 0 ? 'align-items-center' : 'align-items-center flex-row-reverse'}`} key={index}>
                            <div className="col-md-6 feature-image" data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                                <img src={feature.image} alt={feature.title} className="img-fluid rounded shadow" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                            </div>
                            <div className="col-md-6 mt-3 feature-content" data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}>
                                <h3>{feature.title}</h3>
                                <ul>
                                    {feature.content.map((content, i) => (
                                        <li key={i}>{content}</li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary mt-3" onClick={() => navigate('/#DangKyDungThu')}>Dùng thử miễn phí</button>
                            </div>
                            <hr className="horizontal dark mt-1" />
                        </div>

                    ))}
                </div>
            </div>
            <section className="pricing py-5" id="bangGia">
                <div className="container">
                    <div className="row mb-5 text-center">
                        <div className="col">
                            <h2 data-aos="fade-up" style={{ textAlign: 'center', marginTop: '40px', marginBottom: '30px', color: '#ff8c00' }}>Bảng Giá</h2>
                        </div>
                    </div>
                    <div className="row">
                        {plans.map((plan, index) => (
                            <div className="col-lg-4 mb-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                                <div className={`card h-100 ${plan.highlighted ? 'border-primary shadow' : 'border-0'}`} style={{ transition: 'transform 0.3s' }}>
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{plan.name}</h5>
                                        <h6 className="card-price text-center">
                                            {plan.price}
                                            {plan.duration && <span className="period">/{plan.duration}</span>}
                                        </h6>
                                        <hr />
                                        <ul className="fa-ul">
                                            {plan.features.map((feature, i) => (
                                                <li key={i}><span className="fa-li"><FontAwesomeIcon icon={faCheck} /></span>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-footer text-center">
                                        <a href={plan.buttonLink} className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-outline-primary'} btn-block`} style={{ transition: 'background-color 0.3s, color 0.3s' }}>{plan.buttonText}</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            <section style={{ paddingTop: '5rem' }} id='DangKyDungThu'>
                <div className='container mb-5' style={{
                    textAlign: 'center', border: '2px solid #ff8c00',
                    borderRadius: '25px',
                }}
                >
                    <h2
                        className='mt-3 '
                        data-aos="fade-up"
                        style={{ textAlign: 'center', marginTop: '40px', marginBottom: '30px', color: '#ff8c00' }}>
                        Đăng Ký Dùng Thử Miễn Phí</h2>
                    <input
                        className="form-control"
                        placeholder="Nhập tên doanh nghiệp của bạn"
                        value={dataReq.TenDoanhNghiep}
                        data-aos="fade-left"
                        onChange={(event) => {
                            setDataReq({
                                ...dataReq,
                                TenDoanhNghiep: event.target.value
                            });
                        }}
                        onFocus={() => { setErr(false) }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              // Gọi hàm xử lý click của button
                              if (dataReq.TenDoanhNghiep) setPopup1(true);
                              else setErr(true);
                            }
                          }}
                    ></input>
                    {err && <p className='mb-0' style={{ color: 'red' }}>Vui lòng nhập tên doanh nghiệp</p>}
                    <button className="btn btn-primary mt-2"
                        data-aos="fade-right"
                        onClick={() => {
                            if (dataReq.TenDoanhNghiep)
                                setPopup1(true)
                            else setErr(true)
                        }}>Bắt đầu dùng thử
                    </button>
                </div>
            </section>
            <div id='LienHe' className="contact-section" style={{ padding: '4em 0', backgroundColor: '#f9f9f9' }}>
                <div className="container">
                    <h2
                        className='mt-3'
                        data-aos="fade-up"
                        style={{ textAlign: 'center', marginBottom: '30px', color: '#ff8c00' }}>
                        Liên Hệ</h2>
                    <div className="row">
                        {contacts.map((contact, index) => (
                            <div
                                className="col-md-4"
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={`${index * 100}`}
                                style={{ marginBottom: '2em', textAlign: 'center' }}
                            >
                                <div className="contact-card p-4">
                                    <div className="contact-icon mb-3">
                                        <img src={contact.icon} style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                    </div>
                                    <h5>{contact.title}</h5>
                                    <p>{contact.description}</p>
                                    <a href={contact.link} className="btn btn-primary">
                                        {contact.buttonLabel}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center" style={{ backgroundColor: 'white', color: 'black', padding: '10px 0' }}>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-7 col-sm-12'>
                            <div className='row'>
                                <div className='col-md-3 col-sm-12 d-flex justify-content-center align-items-center'>
                                    <img
                                        src={curvedImage}
                                        alt="Company Logo"
                                        style={{ width: '150px', height: '76px' }}
                                    />
                                </div>
                                <div className='col-md-9 col-sm-12'>
                                    <h3 style={{ color: 'black', marginTop: '14px' }}>Về Chúng Tôi</h3>
                                    <p style={{ textAlign: 'left' }}>
                                        Chúng tôi là một đội ngũ đầy đam mê với mục tiêu tạo ra những sản phẩm phần mềm
                                        chất lượng cao giúp các doanh nghiệp F&B tối ưu hóa hoạt động và thành công vượt trội.
                                        Với kinh nghiệm và sự am hiểu sâu sắc về ngành, chúng tôi cam kết mang đến cho khách hàng
                                        những giải pháp tốt nhất.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5 col-sm-12 mt-6' style={{ textAlign: 'left', borderLeft: '2px black solid' }}>
                            <p className='mb-0'>Câu Lạc Bộ Lập Trình - Khoa Công nghệ Thông Tin - Đại Học Lạc Hồng</p>
                            <p className='mb-0'>Số điện thoại: 0911132826</p>
                            <p className='mb-0'>Email: phuc@lhu.edu.vn</p>
                            <p className='mb-0'>Địa chỉ: Phòng B301, Số 10 Huỳnh Văn Nghệ, Bửu Long, TP Biên Hòa, Đồng Nai </p>
                        </div>
                    </div>
                </div>
                <hr className="horizontal dark mt-1" />
                <p className='mb-0'>2024 VRes © Copyright 2022-2024. All Rights Reserved</p>
            </footer>

            {
                popup1 && <div className="popup">
                    <ThongTinDoanhNghiep
                        setPopup1={setPopup1}
                        dataReq={dataReq}
                        setDataReq={setDataReq}
                        addNotification={addNotification}
                        openPopupAlert={openPopupAlert}
                    />
                </div>
            }
            {
                popupAlert && <PopupAlert
                    message={popupMessageAlert}
                    onClose={closePopupAlert}
                    onAction={onAction}
                />
            }
        </div>
    );

}
export default Landing