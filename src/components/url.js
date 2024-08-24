//http://118.69.126.49:1234
//http://118.69.126.49:123
/* Hệ thống
 */
//kiểm tra phiên đăng nhập
export const urlCheckLogin = 'http://118.69.126.49:1234/session';
//đăng nhập
export const urlLogin = 'http://118.69.126.49:1234/login';
//đăng xuất
export const urlLogout = 'http://118.69.126.49:1234/logout';
//đổi mật khẩu
export const urlChangePassword = 'http://118.69.126.49:1234/changePassword';
// cập nhật ảnh thanh toán
export const urlUpdatePicturePayment = 'http://118.69.126.49:1234/updatePicturePayment';
// lấy số % điểm tích luỹ khách hàng
export const urlGetPerPointCustomert = 'http://118.69.126.49:1234/getPerPointCustomert';
// cập nhật số % điểm tích luỹ khách hàng
export const urlUpdatePerPointCustomert = 'http://118.69.126.49:1234/updatePerPointCustomert';
// cập nhật logo
export const urlUpdateLogo = 'http://118.69.126.49:1234/updateLogo';
// lấy trạng thái sử dụng dữ liệu mẫu
export const urlGetUseSampleData = 'http://118.69.126.49:1234/getUseSampleData';
//đổi trạng thái sử dụng dữ liệu mẫu
export const urlUpdateUseSampleData = 'http://118.69.126.49:1234/updateUseSampleData';



/* Quản lý nhân viên
 */
//lấy danh sách nhân viên
export const urlGetAccount = 'http://118.69.126.49:1234/getAccount';
// thêm nhân viên
export const urlInsertAccount = 'http://118.69.126.49:1234/insertAccount';
// sửa nhân viên
export const urlUpdateAccount = 'http://118.69.126.49:1234/updateAccount';
// xoá nhân viên
export const urlDeleteAccount = 'http://118.69.126.49:1234/deleteAccount';
// undo delete nhân viên
export const urlUndoDeleteAccount = 'http://118.69.126.49:1234/undoDeleteAccount';
// nhập nhân viên
export const urlImportExcelAccount = 'http://118.69.126.49:1234/importExcelAccount';


//lấy danh sách vai trò
export const urlGetRole = 'http://118.69.126.49:1234/getRole';
// thêm vai trò
export const urlInsertRole = 'http://118.69.126.49:1234/insertRole';
// sửa nhân viên
export const urlUpdateRole = 'http://118.69.126.49:1234/updateRole';
// xoá vai trò
export const urlDeleteRole = 'http://118.69.126.49:1234/deleteRole';
//lấy danh sách quyền
export const urlGetPermission = 'http://118.69.126.49:1234/getPermission';


//lấy danh sách vị trí công việc
export const urlGetJobPosition = 'http://118.69.126.49:1234/getJobPosition';
// thêm vị trí công việc
export const urlInsertJobPosition = 'http://118.69.126.49:1234/insertJobPosition';
// sửa vị trí công việc
export const urlUpdateJobPosition = 'http://118.69.126.49:1234/updateJobPosition';
//xoá vị trí công việc
export const urlDeleteJobPosition = 'http://118.69.126.49:1234/deleteJobPosition';


/* Quản lý bàn và khu vực
 */
//lấy danh sách khu vực
export const urlGetArea = 'http://118.69.126.49:1234/getArea';
// thêm Khu vực
export const urlInsertArea = 'http://118.69.126.49:1234/insertArea';
// sửa khu vực
export const urlUpdateArea = 'http://118.69.126.49:1234/updateArea';
//xoá vị trí khu vực
export const urlDeleteArea = 'http://118.69.126.49:1234/deleteArea';

//lấy danh sách bàn
export const urlGetTable = 'http://118.69.126.49:1234/getTable';
// thêm bàn
export const urlInsertTable = 'http://118.69.126.49:1234/insertTable';
// sửa bàn
export const urlUpdateTable = 'http://118.69.126.49:1234/updateTable';
//xoá bàn
export const urlDeleteTable = 'http://118.69.126.49:1234/deleteTable';

/* Quản lý ca làm việc
 */
//lấy danh sách ca làm việc
export const urlGetShifts = 'http://118.69.126.49:1234/getShifts';
// thêm ca làm việc
export const urlInsertShifts = 'http://118.69.126.49:1234/insertShifts';
// sửa ca làm việc
export const urlUpdateShifts = 'http://118.69.126.49:1234/updateShifts';
//xoá ca làm việc
export const urlDeleteShifts = 'http://118.69.126.49:1234/deleteShifts';

//lấy danh sách chốt ca
export const urlGetCloseShifts = 'http://118.69.126.49:1234/getCloseShifts';
//tải danh sách ca phù hợp với giờ hiện tại
export const urlGetMatchShifts = 'http://118.69.126.49:1234/GetMatchShifts';
// thêm chốt ca mới
export const urlInsertCloseShifts = 'http://118.69.126.49:1234/insertCloseShifts';
// cập nhật chốt ca
export const urlUpdateCloseShifts = 'http://118.69.126.49:1234/updateCloseShifts';
// xoá chốt ca
export const urlDeleteCloseShifts = 'http://118.69.126.49:1234/deleteCloseShifts';


/* Quản lý Khách Hàng
 */
//lấy danh sách khách hàng
export const urlGetCustomer = 'http://118.69.126.49:1234/getCustomer';
// thêm khách hàng
export const urlInsertCustomer = 'http://118.69.126.49:1234/insertCustomer';
// sửa khách hàng
export const urlUpdateCustomer = 'http://118.69.126.49:1234/updateCustomer';
//xoá khách hàng
export const urlDeleteCustomer = 'http://118.69.126.49:1234/deleteCustomer';


/* Quản lý Kho
 */
//lấy danh sách đơn vị tính
export const urlGetUnit = 'http://118.69.126.49:1234/getUnit';
//lấy danh sách chuyển đổi đơn vị tính
export const urlGetListUnitConversions = 'http://118.69.126.49:1234/getListUnitConversions';
//lấy danh sách chuyển đổi đơn vị tính theo ID
export const urlGetListUnitConversionsByIDUnit = 'http://118.69.126.49:1234/getListUnitConversionsByIDUnit';

// thêm đơn vị tính
export const urlInsertUnit = 'http://118.69.126.49:1234/insertUnit';
// sửa đơn vị tính
export const urlUpdateUnit = 'http://118.69.126.49:1234/updateUnit';
//xoá đơn vị tính
export const urlDeleteUnit = 'http://118.69.126.49:1234/deleteUnit';

//lấy danh sách phiếu nhập
export const urlGetReceipt = 'http://118.69.126.49:1234/getReceipt';
// thêm phiếu nhập
export const urlInsertReceipt = 'http://118.69.126.49:1234/insertReceipt';
// sửa phiếu nhập
export const urlUpdateReceipt = 'http://118.69.126.49:1234/updateReceipt';
//xoá phiếu nhập
export const urlDeleteReceipt = 'http://118.69.126.49:1234/deleteReceipt';

//lấy danh sách nguyên liệu
export const urlGetIngredient = 'http://118.69.126.49:1234/getIngredient';
// thêm nguyên liệu
export const urlInsertIngredient = 'http://118.69.126.49:1234/insertIngredient';
// sửa nguyên liệu
export const urlUpdateIngredient = 'http://118.69.126.49:1234/updateIngredient';
//xoá nguyên liệu
export const urlDeleteIngredient = 'http://118.69.126.49:1234/deleteIngredient';


/* Quản lý Thực đơn
 */
//lấy danh sách toàn bộ sản phẩm 
export const urlGetProduct = 'http://118.69.126.49:1234/getProduct';
//xoá sản phẩm
export const urlDeleteProduct = 'http://118.69.126.49:1234/deleteProduct';


// thêm sản phẩm thành phẩm
export const urlInsertFinishedProduct = 'http://118.69.126.49:1234/insertFinishedProduct';
// sửa sản phẩm thành phẩm
export const urlUpdateFinishedProduct = 'http://118.69.126.49:1234/updateFinishedProduct';
// thêm sản phẩm chế biến
export const urlInsertProcessedProduct = 'http://118.69.126.49:1234/insertProcessedProduct';
// sửa sản phẩm chế biến
export const urlUpdateProcessedProduct = 'http://118.69.126.49:1234/updateProcessedProduct';

//lấy danh sách loại sản phẩm
export const urlGetTypeProduct = 'http://118.69.126.49:1234/getTypeProduct';
// thêm loại sản phẩm
export const urlInsertTypeProduct = 'http://118.69.126.49:1234/insertTypeProduct';
// sửa loại sản phẩm
export const urlUpdateTypeProduct = 'http://118.69.126.49:1234/updateTypeProduct';
//xoá loại sản phẩm
export const urlDeleteTypeProduct = 'http://118.69.126.49:1234/deleteTypeProduct';

/* Quản lý Hoá Đơn
 */
//lấy danh sách hoá đơn
export const urlGetInvoice = 'http://118.69.126.49:1234/getInvoice';
// thêm hoá đơn
export const urlInsertInvoice = 'http://118.69.126.49:1234/insertInvoice';
// sửa hoá đơn
export const urlUpdateInvoice = 'http://118.69.126.49:1234/updateInvoice';
//xoá hoá đơn
export const urlDeleteInvoice = 'http://118.69.126.49:1234/deleteInvoice';
// cập nhật trạng thái bàn ăn
export const urlUpdateStatusTable = 'http://118.69.126.49:1234/updateStatusTable';
// lấy ảnh thanh toán
export const urlGetPicturePayment = 'http://118.69.126.49:1234/getPicturePayment';


/* Quản lý Bếp
 */
//lấy danh sách order
export const urlGetOrder = 'http://118.69.126.49:1234/getListProductsByStatus';
//cập nhật trạng thái món ăn
export const urlUpdateStatusProduct = 'http://118.69.126.49:1234/updateStatusProduct';

/* Bảng điều khiển
 */
//lấy số bàn đang có khách
export const urlGetOccupiedTables = 'http://118.69.126.49:1234/getOccupiedTables';
//lấy số hoá đơn trong ngày
export const urlGetInvoiceToday = 'http://118.69.126.49:1234/getInvoiceToday';
//lấy tổng tiền hoá đơn trong ngày
export const urlGetRevenueToday = 'http://118.69.126.49:1234/getRevenueToday';
//lấy tổng tiền hoá đơn trong tháng
export const urlGetRevenueMonth = 'http://118.69.126.49:1234/getRevenueMonth';
//lấy tổng tiền hoá đơn trong tuần
export const urlGetListRevenueMonth = 'http://118.69.126.49:1234/getListRevenueMonth';

/* Đối tác
 */
//đăng ký đối tác mới
export const urlRegister = 'http://118.69.126.49:1234/register';
//xác thực email đối tác
export const urlRegisterCode = 'http://118.69.126.49:1234/registerCode';
// đăng nhập superadmin
export const urlLoginSuperAdmin = 'http://118.69.126.49:1234/loginSuperAdmin';
//xác thực mã code superadmin
export const urlRegisterCodeLoginSuperAdmin = 'http://118.69.126.49:1234/registerCodeLoginSuperAdmin';
//lấy danh sách đối tác (các nhà hàng đã đăng ký với hệ thống)
export const urlGetPartner = 'http://118.69.126.49:1234/getPartner';
//xoá đối tác
export const urlDeletePartner = 'http://118.69.126.49:1234/deletePartner';
//đặt lại dữ liệu đối tác
export const urlResetDataByIDDoiTac = 'http://118.69.126.49:1234/resetDataByIDDoiTac';