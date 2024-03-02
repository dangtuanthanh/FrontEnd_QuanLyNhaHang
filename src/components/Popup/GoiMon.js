import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux'
import { ReadingConfig, doReadNumber, } from 'read-vietnamese-number'

import { getCookie } from "../Cookie";
import { urlGetUnit, urlGetIngredient, urlGetTypeProduct, urlGetProduct, urlInsertProcessedProduct, urlUpdateProcessedProduct } from "../url"
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faIdCard, faBell, faClone,faFile } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

import TabChonBan from "./ChonBan";
import TabChonMon from "./ChonMon";
import ChonKhachHang from "./ChonKhachHang";
const GoiMon = (props) => {
    //lưu trữ dữ liệu gửi đi
    const [dataReq, setDataReq] = useState({
        DanhSach: []
    });
    const [popupChonKhachHang, setPopupChonKhachHang] = useState(false);
    useEffect(() => {
        console.log('dữ liệu gửi đi: ', dataReq);

    }, [dataReq]);
    const tabs = {
        tab1: 'TabChonBan',
        tab2: 'TabChonMon',
        tab3: 'TabDonViTinh'
    }

    const [activeTab, setActiveTab] = useState(tabs.tab1);

    const handleTabClick = tab => {
        setActiveTab(tab);
    }
    useEffect(() => {
        console.log('activeTab: ', activeTab);
    }, [activeTab]);
    let TabComponent;

    if (activeTab === tabs.tab1) {
        TabComponent = TabChonBan;
    }

    if (activeTab === tabs.tab2) {
        TabComponent = TabChonMon;
    }
    // if (activeTab === tabs.tab3) {
    //     TabComponent = TabDonViTinh;
    // }



    // Phân tách dữ liệu thành các dòng
    const lines = JSON.stringify(dataReq)
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n');
    /*xử lý phần chi tiết*/
    function handleDetailChange(ID, value, TenCot) {
        const index = dataReq.DanhSach.findIndex(
            item => {
                return item.IDSanPham === ID;
            }
        );
        dataReq.DanhSach[index][TenCot] = value
        setDataReq({
            ...dataReq,
            DanhSach: [...dataReq.DanhSach]
        })
    }
    return (
        <div className="full-popup-box">
            <div className="full-box">
                <div>
                    <div >
                        <div className="row">
                            <div className="col-8 card mb-4">
                                <ul class="nav nav-tabs col-6">
                                    <li class="nav-item">
                                        <button
                                            className={activeTab === 'TabChonBan' ? 'nav-link active' : 'nav-link'}
                                            onClick={() => handleTabClick(tabs.tab1)}>Bàn</button>
                                    </li>
                                    <li class="nav-item">
                                        <button
                                            className={activeTab === 'TabChonMon' ? 'nav-link active' : 'nav-link'}
                                            onClick={() => handleTabClick(tabs.tab2)}>Chọn Món</button>
                                    </li>
                                    {/* <li class="nav-item">
                                        <button
                                            className={activeTab === 'TabDonViTinh' ? 'nav-link active' : 'nav-link'}
                                            onClick={() => handleTabClick(tabs.tab3)}>Đơn Vị Tính</button>
                                    </li> */}
                                </ul>
                                <TabComponent
                                    addNotification={props.addNotification}
                                    openPopupAlert={props.openPopupAlert}
                                    dataReq={dataReq}
                                    setDataReq={setDataReq}
                                    setActiveTab={setActiveTab}

                                />
                                {popupChonKhachHang && <div className="popup">
                                    <ChonKhachHang
                                        addNotification={props.addNotification}
                                        openPopupAlert={props.openPopupAlert}
                                        dataReq={dataReq}
                                        setDataReq={setDataReq}
                                        setPopupChonKhachHang={setPopupChonKhachHang}
                                    />
                                </div>}
                            </div>
                            <div className="col-4 card mb-4">
                                {dataReq.IDBan ? <div>
                                    <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>Thông Tin Bàn Ăn</h3>
                                    <div className="row" style={{ marginLeft: '2%' }}>
                                        <div className="col-6" style={{ padding: '0' }}>
                                            <button
                                                style={{ width: '85%' }}
                                                className="btn btn-light btn-sm"
                                                onClick={() => handleTabClick(tabs.tab1)}
                                            >{dataReq.TenBan} / {dataReq.TenKhuVuc}</button>
                                        </div>
                                        <div className="col-6" style={{ padding: '0' }}>
                                            <button
                                                style={{ width: '85%' }}
                                                className="btn btn-light btn-sm"
                                                onClick={() => { setPopupChonKhachHang(true) }}
                                            >
                                                {dataReq.TenKhachHang ? (
                                                    <>
                                                        <FontAwesomeIcon icon={faIdCard} />

                                                        {dataReq.TenKhachHang}
                                                    </>
                                                ) : (
                                                    'Chọn Khách Hàng'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ height: '600px', maxHeight: '64%', overflow: 'auto' }}>
                                        {dataReq.DanhSach.map((item,index)=> (
                                            <div key={item.IDSanPham}
                                                className="row card-body">
                                                <div className="col-6">
                                                    <h6>{index + 1}. {item.TenSanPham} </h6>
                                                     <label 
                                                     onClick={()=>{
                                                        const GhiChuMonAn = prompt("Nhập Ghi Chú Cho Món Ăn:");
                                                        if(GhiChuMonAn){
                                                            handleDetailChange(item.IDSanPham,
                                                                GhiChuMonAn,
                                                                'GhiChu'
                                                            )
                                                        }
                                                     }}
                                                     style={{color:'#9d9d9d'}}
                                                     >
                                                        {item.GhiChu ? (
                                                    <>
                                                        {item.GhiChu}
                                                    </>
                                                ) : <><FontAwesomeIcon icon={faFile} />
                                                    ' Nhập Ghi Chú / Món Thêm'
                                                    </>
                                                }
                                                        </label> 
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        type="number"
                                                        className="form-control-sm"
                                                        value={item.KhoiLuong}
                                                        onChange={(event) =>
                                                            handleDetailChange(item.IDNguyenLieu,
                                                                event.target.value,
                                                                'KhoiLuong'
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <hr></hr>
                                            </div>
                                        ))}
                                        <pre
                                            style={{
                                                background: '#333',
                                                color: '#fff',
                                                padding: '10px',
                                                margin: '20px auto',
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-all'
                                            }}
                                        >
                                            Đã chọn: {lines.map(line => <div>{line}</div>)}
                                        </pre>
                                    </div>




                                    <div className="row" style={{ marginLeft: '2%' }}>
                                        <div className="col-6" style={{ padding: '0' }}>
                                            <div className="form-group" style={{
                                                width: '85%'
                                            }}>
                                                <input
                                                    type="text"
                                                    className="form-control-sm"
                                                    placeholder="Ghi Chú"
                                                    value={dataReq.GhiChu}
                                                    style={{ border: '0.8px grey solid', width: '100%', height: '33px' }}
                                                    onChange={(event) => {
                                                        setDataReq({
                                                            ...dataReq,
                                                            GhiChu: event.target.value
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6" style={{ padding: '0' }}>
                                            <button
                                                style={{ width: '85%' }}
                                                className="btn btn-light btn-sm"
                                            >
                                                <FontAwesomeIcon icon={faClone} />  Tách / Ghép
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginLeft: '2%' }}>
                                        <div className="col-6" style={{ padding: '0' }}>
                                            <button style={{ width: '85%' }} className="btn btn-success">
                                                <FontAwesomeIcon icon={faDollarSign} />  Thanh Toán</button>
                                        </div>
                                        <div className="col-6" style={{ padding: '0' }}>
                                            <button
                                                style={{ width: '85%' }}
                                                className="btn btn-primary"
                                            >
                                                <FontAwesomeIcon icon={faBell} />  Thông Báo Bếp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                    : <div style={{
                                        position: 'absolute',
                                        top: '40%',
                                        left: '15%'
                                    }}>
                                        <h3 style={{ color: 'gray' }} >Vui lòng chọn một bàn ăn</h3>
                                    </div>
                                }
                            </div>
                        </div>
                        <button onClick={() => { props.setPopupInsertUpdate(false) }} type="button" className="btn btn-danger mt-3" >Đóng</button>
                    </div>
                </div>

            </div >
        </div >
    );
};

export default GoiMon;