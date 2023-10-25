import React, { useState } from "react";
import CheckLogin from "../components/CheckLogin"
import Navigation from "../components/Navigation"
import NavTop from "../components/NavTop";
function BangDieuKhien() {
    const [showNavigation, setShowNavigation] = useState(true);
    const handleToggleNavigation = () => {
        setShowNavigation(!showNavigation);
    };

    const navigationColumnClass = showNavigation ? "col-2" : "col-0";
    const contentColumnClass = showNavigation ? "col-10" : "col-12";

    const [menu, setMenu] = useState([]);
    const xuLyLayMenuTuCheckLogin = (data) => {
        setMenu(data);
    };
    return (
        <CheckLogin menu={xuLyLayMenuTuCheckLogin}>
            <div className="row">
                <div className={navigationColumnClass}>
                {showNavigation && <Navigation menu={menu} />}
                </div>
                <div className={contentColumnClass}>
                    <div className='container'>
                        <NavTop NamePage='Bảng Điều Khiển'/>
                        <h2 style={{ width: "100%", backgroundColor: "aqua" }}>Đây là nội dung trang BangDieuKhien</h2>
                        <h4  onClick={handleToggleNavigation}>
                            {showNavigation ? "<<" : ">>"}
                        </h4>
                    </div>
                </div>
            </div>
        </CheckLogin>
    );
}

export default BangDieuKhien