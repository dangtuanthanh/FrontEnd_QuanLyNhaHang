import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faRotate, faAdd, faArrowLeft } from '@fortawesome/free-solid-svg-icons'



import Insert_updateKhachHang from "../Popup/Insert_updateKhachHang";
import TabTachDon from "../Tabs/TabTachDon";
import TabGhepDon from "../Tabs/TabGhepDon";
const ChonTachGhep = (props) => {

    const tabs = {
        tab1: 'TabTachDon',
        tab2: 'TabGhepDon',
        tab3: 'TabDonViTinh'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }


    return (
        <div className="lg-popup-box" style={{ zIndex: '9991' }}>
            <div className="lg-box">
                <div className="conten-modal">
                    <div className="card">
                        <ul class="nav nav-tabs">

                            <li class="nav-item">
                                <button
                                    className={activeTab === 'TabTachDon' ? 'nav-link active' : 'nav-link'}
                                    onClick={() => handleTabClick(tabs.tab1)}>Tách Đơn</button>
                            </li>
                            <li class="nav-item">
                                <button
                                    className={activeTab === 'TabGhepDon' ? 'nav-link active' : 'nav-link'}
                                    onClick={() => {
                                        if(props.dataReq.TrangThaiThanhToan){
                                            props.addNotification('Bạn không thể ghép đơn với hoá đơn đã thanh toán', 'warning', 4000)
                                        }else
                                        handleTabClick(tabs.tab2)
                                    }}>Ghép Đơn</button>
                            </li>
                        </ul>
                        {activeTab === tabs.tab1 && <TabTachDon
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            dataReq={props.dataReq}
                            IDNhanVien={props.IDNhanVien}
                            // setDataReq={setDataReq}
                            setActiveTab={setActiveTab} 

                            setPopupTachGhep={props.setPopupTachGhep}
                            setDataUser={props.setDataUser}
                            dataUser={props.dataUser}
                            />}
                       {activeTab === tabs.tab2 && <TabGhepDon
                            addNotification={props.addNotification}
                            openPopupAlert={props.openPopupAlert}
                            dataReq={props.dataReq}
                            IDNhanVien={props.IDNhanVien}
                            // setDataReq={setDataReq}
                            setActiveTab={setActiveTab} 

                            setPopupTachGhep={props.setPopupTachGhep}
                            setDataUser={props.setDataUser}
                            dataUser={props.dataUser}
                            setPopupInsertUpdate={props.setPopupInsertUpdate}
                            />}
                    </div>

                </div>
            </div >

        </div >
    );
}
export default ChonTachGhep;