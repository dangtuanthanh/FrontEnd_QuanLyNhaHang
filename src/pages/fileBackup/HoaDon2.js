import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCog, faBell } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
function HoaDon() {
    const [data, setData] = useState([
        { id: 1, name: 'John', age: 25, email: 'john@example.com' },
        { id: 2, name: 'Jane', age: 30, email: 'jane@example.com' },
        { id: 3, name: 'Bob', age: 35, email: 'bob@example.com' },
        { id: 4, name: 'John', age: 25, email: 'john@example.com' },
        { id: 5, name: 'Jane', age: 30, email: 'jane@example.com' },
        { id: 6, name: 'Bob', age: 35, email: 'bob@example.com' },
        { id: 7, name: 'John', age: 25, email: 'john@example2.com' },
        { id: 8, name: 'Jane', age: 30, email: 'jane@example.com' },
        { id: 9, name: 'Bob', age: 35, email: 'bob@example.com' },
        { id: 10, name: 'John', age: 25, email: 'john@example.com' },
        { id: 11, name: 'Jane', age: 30, email: 'jane@example.com' },
        { id: 12, name: 'Bob', age: 35, email: 'bob@example.com' },
        // ...
      ]);
    
      const [sizePerPage, setSizePerPage] = useState(10);
      const [isAdding, setIsAdding] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [rowData, setRowData] = useState({});
    
      const handleSizePerPageChange = (sizePerPage) => {
        setSizePerPage(sizePerPage);
        console.log(sizePerPage);
      };
    
      const columns = [
        { dataField: 'id', text: 'ID', sort: true },
        { dataField: 'name', text: 'Name', sort: true, filter: textFilter() },
        { dataField: 'age', text: 'Age', sort: true },
        { dataField: 'email', text: 'Email', sort: true, filter: textFilter() },
        {
          dataField: '',
          text: '',
          formatter: (cell, row) => {
            return (
              <div>
                <button onClick={() => handleDelete(row.id)}>Delete</button>
                <button onClick={() => handleEditClick(row)}>Edit</button>
              </div>
            );
          }
        }
      ];
    
      const defaultSorted = [{
        dataField: 'id',
        order: 'asc'
      }];
    
      const paginationOptions = {
        sizePerPage: sizePerPage,
        totalSize: data.length,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        onPageChange: (page, sizePerPage) => handleSizePerPageChange(sizePerPage)
      };
    
    //   const cellEdit = cellEditFactory({
    //     mode: 'click',
    //     blurToSave: true
    //   });
    
      const filter = filterFactory();
    
      const handleAddClick = () => {
        setIsAdding(true);
        setIsEditing(false);
        setRowData({});
      }
    
      const handleEditClick = (row) => {
        setIsAdding(false);
        setIsEditing(true);
        setRowData(row);
      }
    
      const handleCancelClick = () => {
        setIsAdding(false);
        setIsEditing(false);
        setRowData({});
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (isAdding) {
          handleAdd(rowData);
        } else if (isEditing) {
          handleUpdate(rowData);
        }
        setIsAdding(false);
        setIsEditing(false);
        setRowData({});
      }
    
      const handleAdd = (newData) => {
        setData([...data, newData]);
      };
    
      const handleUpdate = (newData) => {
        const index = data.findIndex((item) => item.id === rowData.id);
        const updatedData = [...data];
        updatedData[index] = newData;
        setData(updatedData);
      };
    
      const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
      };

    return (
        <div >
            <nav class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                <div class="container-fluid py-1 px-3">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="/">VSell</a></li>
                            <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Hoá Đơn</li>
                        </ol>
                    </nav>
                    <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                        <div class="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div class="input-group">
                                <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                                <input type="text" class="form-control" placeholder="Type here..." />
                            </div>
                        </div>
                        <ul class="navbar-nav  justify-content-end">
                            <li class="nav-item d-flex align-items-center">
                                <a class="btn btn-outline-primary btn-sm mb-0 me-3" target="_blank" href="https://www.creative-tim.com/builder?ref=navbar-soft-ui-dashboard">Online Builder</a>
                            </li>
                            <li class="nav-item d-flex align-items-center">
                                <a href="javascript:;" class="nav-link text-body font-weight-bold px-0">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span class="d-sm-inline d-none"> Chào! Admin  </span>
                                </a>
                            </li>
                            <li class="nav-item px-3 d-flex align-items-center">
                                <a href="javascript:;" class="nav-link text-body p-0" id="iconNavbarSidenav">
                                    <FontAwesomeIcon icon={faCog} />
                                    <span class="d-sm-inline d-none">  </span>
                                </a>
                            </li>
                            <li class="nav-item dropdown pe-2 d-flex align-items-center">
                                <a href="javascript:;" class="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                    <FontAwesomeIcon icon={faBell} />
                                </a>
                                <ul class="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4" aria-labelledby="dropdownMenuButton">
                                    <li class="mb-2">
                                        <a class="dropdown-item border-radius-md" href="javascript:;">
                                            <div class="d-flex py-1">
                                                <div class="my-auto">
                                                    <img src="../assets/img/team-2.jpg" class="avatar avatar-sm  me-3 " />
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="text-sm font-weight-normal mb-1">
                                                        <span class="font-weight-bold">New message</span> from Laur
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0 ">
                                                        <i class="fa fa-clock me-1"></i>
                                                        13 minutes ago
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li class="mb-2">
                                        <a class="dropdown-item border-radius-md" href="javascript:;">
                                            <div class="d-flex py-1">
                                                <div class="my-auto">
                                                    <img src="../assets/img/small-logos/logo-spotify.svg" class="avatar avatar-sm bg-gradient-dark  me-3 " />
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="text-sm font-weight-normal mb-1">
                                                        <span class="font-weight-bold">New album</span> by Travis Scott
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0 ">
                                                        <i class="fa fa-clock me-1"></i>
                                                        1 day
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item border-radius-md" href="javascript:;">
                                            <div class="d-flex py-1">
                                                <div class="avatar avatar-sm bg-gradient-secondary  me-3  my-auto">
                                                    icon
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="text-sm font-weight-normal mb-1">
                                                        Payment successfully completed
                                                    </h6>
                                                    <p class="text-xs text-secondary mb-0 ">
                                                        <i class="fa fa-clock me-1"></i>
                                                        2 days
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="border-0 border-radius-xl ">
                <h2>Quản Lý Hoá Đơn</h2>
                <h4>Bảng Hoá Đơn</h4>``
            </div>

            <div>
                Hiển thị{' '}
                <select value={sizePerPage} onChange={(e) => handleSizePerPageChange(e.target.value)}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>{' '}
                Hàng
            </div>
            {isAdding || isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Name:
                            <input type="text" value={rowData.name || ''} onChange={(e) => setRowData({ ...rowData, name: e.target.value })} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Age:
                            <input type="number" value={rowData.age || ''} onChange={(e) => setRowData({ ...rowData, age: e.target.value })} />
                        </label>
                    </div>
                    <div>
                        <label>
                            Email:
                            <input type="email" value={rowData.email || ''} onChange={(e) => setRowData({ ...rowData, email: e.target.value })} />
                        </label>
                    </div>
                    <div>
                        <button type="submit">{isAdding ? 'Add' : 'Save'}</button>
                        <button type="button" onClick={handleCancelClick}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div>
                    <BootstrapTable
                        keyField='id'
                        data={data}
                        columns={columns}
                        defaultSorted={defaultSorted}
                        pagination={paginationFactory(paginationOptions)}
                        //cellEdit={cellEdit}
                        filter={filter}
                        noDataIndication="No data found"
                        striped
                        hover
                        condensed
                        bordered={false}
                        headerClasses="table-header"
                        editable={false}
                    />
                    <div>
                        <button onClick={handleAddClick}>Add</button>
                    </div>
                </div>
            )}


        </div>

    );
}

export default HoaDon