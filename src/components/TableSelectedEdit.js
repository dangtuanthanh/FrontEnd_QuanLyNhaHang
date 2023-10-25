import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import Combobox from './Combobox';
import $, { data, error } from 'jquery';

function TableSelectedEdit({ selectedIds }) {

    const [tableData, setTableData] = useState([]);
    const [combos, setCombos] = useState([]);
    const [combos2, setCombos2] = useState([]);
    const [columns, setColumns] = useState([]);
    const [successImport, setSuccessImport] = useState('');
    const [listErrors, setListErrors] = useState([]);

    useEffect(() => {
        const integerIds = selectedIds.map(id => parseInt(id));

        const fetchData1 = fetch(`http://localhost:3000/getDataSelected?recordIds=${integerIds.join(',')}`)
            .then(response => response.json())
            .then(data => {
                setTableData(data);
            })
            .catch(error => {
                console.error('Lỗi lấy dữ liệu đổ lên bảng: ', error);
            });

        const fetchData2 = fetch("http://localhost:3000/getdataMaKHTenKHFromKhachHang")
            .then(response => response.json())
            .then(data => {
                setCombos(data);
            })
            .catch(error => {
                console.error('Lỗi Combobox 1: ', error);
            });

        const fetchData3 = fetch("http://localhost:3000/getdataMaNVHoNVTenNVFromNhanVien")
            .then(response => response.json())
            .then(data => {
                setCombos2(data);
            })
            .catch(error => {
                console.error('Lỗi Combobox 2: ', error);
            });

        Promise.all([fetchData1, fetchData2, fetchData3])
            .then(() => {
                console.log('Cả 3 API fetch đã hoàn thành');
            })
            .catch(error => {
                console.error('Lỗi trong quá trình cả 3 fetch: ', error);
            });
    }, [selectedIds]);

    useEffect(() => {
        setColumns(createColumns(combos));
    }, [combos]);
    useEffect(() => {
        console.log('tableData', tableData);
    }, [tableData]);

    function createColumns(combos) {
        return [
            {
                Header: 'Số Hoá Đơn',
                accessor: 'SoHD',
                isCombobox: false,
                Cell: ({ cell }) => (
                    <p
                        style={{ opacity: 0.5, cursor: "not-allowed", margin:"0", fontWeight:'bolder'}}
                    >
                        {cell.value}
                    </p>
                ),

            },
            {
                Header: 'Ngày Hoá Đơn',
                accessor: 'NgayHD',
                isCombobox: false,


            },
            {
                Header: 'Ngày Giao',
                accessor: 'NgayGiao',
                isCombobox: false
            },
            {
                Header: 'Mã Khách Hàng',
                accessor: 'MaKH',
                isCombobox: true,
                Cell: ({ cell }) => (
                    <Combobox
                        combos={combos}
                        columnValue="MaKH"
                        columnAdd="TenKH"
                        nameCombo=""
                        idCombo="editMaKH"
                        defaultValue={cell.value}
                        onChange={handleComboboxChange}

                    />
                ),
            },
            {
                Header: 'Mã Nhân Viên',
                accessor: 'MaNV',
                isCombobox: true,
                Cell: ({ cell }) => (
                    <Combobox
                        combos={combos2}
                        columnValue="MaNV"
                        columnAdd="HoTen"
                        nameCombo=""
                        idCombo="editMaNV"
                        defaultValue={cell.value}
                        onChange={handleComboboxChange}

                    />
                ),
            },
        ];
    }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data: tableData,
    });


    // const handleCellChange = (event, rowIdx, colIdx) => {
    //     const newData = [...tableData];
    //     newData[rowIdx][columns[colIdx].accessor] = event.target.textContent;
    //     setTableData(newData);
    // };

    //xử lý khi combobox thay đổi: 
    const handleComboboxChange = (selectedValue, rowIdx, colIdx) => {
        const column = columns[colIdx];

        if (column && column.accessor) {
            const newData = [...tableData];
            newData[rowIdx][column.accessor] = selectedValue;
            setTableData(newData);
        } else {
            console.error("Invalid column or accessor");
        }
    };

    const handleCellChange = (event, rowIdx, colIdx) => {
        const column = columns[colIdx];

        if (column && column.isCombobox && column.accessor) {
            const selectedValue = event.target.value;
            handleComboboxChange(selectedValue, rowIdx, colIdx);
        } else if (column && column.accessor) {
            const newValue = event.target.textContent;
            const newData = [...tableData];
            newData[rowIdx][column.accessor] = newValue;
            setTableData(newData);
        } else {
            console.error("Invalid column or accessor");
        }
    };

    //Lưu Khi Sửa Hàng Loạt
    const handleSave = () => {
        const integerIds = selectedIds.map(id => parseInt(id));
        const requestBody = { SoHDs: integerIds, data: tableData };
        fetch('http://localhost:3000/updateDataSelected', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error('Lỗi Server');
                }
            }).then(data => {
                setSuccessImport(data.success);
                setListErrors(data.errorImport);
                $("#ketQuaSua").delay(200).show("medium");
                
            }).catch(function (error) {
                console.error(error);
            });
    };
    return (
        <div>
            <h3 style={{ textAlign: 'center' }} id='tieudepop'>Sửa Nhiều Dữ Liệu</h3>
            <br></br>

            <table style={{
                'borderCollapse': 'collapse',
                'width': '100%',
                'textAlign': 'center'
            }} {...getTableProps()}>
                <thead style={{
                    'backgroundColor': '#ccc',
                    'color': '#000',
                    'fontWeight': 'bold',
                    'position': 'sticky',
                    'top': '0'
                }}>
                    {headerGroups.map((headerGroup) => (
                        <tr  {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, rowIdx) => {
                        prepareRow(row);
                        const editableColumns = [1, 2];
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell, colIdx) => {
                                    const isEditableColumn = editableColumns.includes(colIdx);
                                    return (
                                        <td
                                            style={{
                                                backgroundColor: '#fff',
                                                color: '#000',
                                                border: '1px solid #ccc',
                                                padding: '8px',
                                            }}
                                            {...cell.getCellProps()}
                                            contentEditable={isEditableColumn}
                                            suppressContentEditableWarning
                                            onBlur={(event) => handleCellChange(event, rowIdx, colIdx)}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div id="ketQuaSua" style={{ display: 'none' }}>
                            <h4 style={{ color: 'blue' }}>Kết Quả : </h4>
                            <h5>Các Số Hoá Đơn Đã Cập Nhật Thành Công:  {successImport}</h5>
                            <div>
                                {listErrors.map((item) => (
                                    <h6 style={{ color: 'red' }} key={item}>
                                        {item}
                                    </h6>
                                ))}
                            </div>
                        </div>
            <button onClick={handleSave}
                            style={{ float: "right" }} type="button" className="btn btn-primary mt-3" id="xacnhan">Lưu Toàn Bộ</button>
                        
        </div>
    )
}
export default TableSelectedEdit;