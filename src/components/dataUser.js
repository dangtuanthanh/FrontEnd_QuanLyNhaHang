function dataUser(rowNhanVienTable) {
    sessionStorage.setItem("rowNhanVienTable",rowNhanVienTable);
}
function filterUser(colFilter){
    sessionStorage.setItem("colFilter",colFilter);
}
export {
    dataUser,
    filterUser
}