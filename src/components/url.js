//http://localhost:1234
//http://118.69.126.49:123
/* Hệ thống
 */
//kiểm tra phiên đăng nhập
export const urlCheckLogin = 'http://localhost:1234/session';
//đăng nhập
export const urlLogin = 'http://localhost:1234/login';
//đăng xuất
export const urlLogout = 'http://localhost:1234/logout';
//đổi mật khẩu
export const urlChangePassword = 'http://localhost:1234/changePassword';



/* Quản lý nhân viên
 */
//lấy danh sách nhân viên
export const urlGetAccount = 'http://localhost:1234/getAccount';
// thêm nhân viên
export const urlInsertAccount = 'http://localhost:1234/insertAccount';
// sửa nhân viên
export const urlUpdateAccount = 'http://localhost:1234/updateAccount';
// xoá nhân viên
export const urlDeleteAccount = 'http://localhost:1234/deleteAccount';
// undo delete nhân viên
export const urlUndoDeleteAccount = 'http://localhost:1234/undoDeleteAccount';
// nhập nhân viên
export const urlImportExcelAccount = 'http://localhost:1234/importExcelAccount';


//lấy danh sách vai trò
export const urlGetRole = 'http://localhost:1234/getRole';
// thêm vai trò
export const urlInsertRole = 'http://localhost:1234/insertRole';
// sửa nhân viên
export const urlUpdateRole = 'http://localhost:1234/updateRole';
// xoá vai trò
export const urlDeleteRole = 'http://localhost:1234/deleteRole';
//lấy danh sách quyền
export const urlGetPermission = 'http://localhost:1234/getPermission';


//lấy danh sách vị trí công việc
export const urlGetJobPosition = 'http://localhost:1234/getJobPosition';
// thêm vị trí công việc
export const urlInsertJobPosition = 'http://localhost:1234/insertJobPosition';
// sửa vị trí công việc
export const urlUpdateJobPosition = 'http://localhost:1234/updateJobPosition';
//xoá vị trí công việc
export const urlDeleteJobPosition = 'http://localhost:1234/deleteJobPosition';


/* Quản lý bàn và khu vực
 */
//lấy danh sách khu vực
export const urlGetArea = 'http://localhost:1234/getArea';
// thêm Khu vực
export const urlInsertArea = 'http://localhost:1234/insertArea';
// sửa khu vực
export const urlUpdateArea = 'http://localhost:1234/updateArea';
//xoá vị trí khu vực
export const urlDeleteArea = 'http://localhost:1234/deleteArea';

//lấy danh sách bàn
export const urlGetTable = 'http://localhost:1234/getTable';
// thêm bàn
export const urlInsertTable = 'http://localhost:1234/insertTable';
// sửa bàn
export const urlUpdateTable = 'http://localhost:1234/updateTable';
//xoá bàn
export const urlDeleteTable = 'http://localhost:1234/deleteTable';

/* Quản lý ca làm việc
 */
//lấy danh sách ca làm việc
export const urlGetShifts = 'http://localhost:1234/getShifts';
// thêm ca làm việc
export const urlInsertShifts = 'http://localhost:1234/insertShifts';
// sửa ca làm việc
export const urlUpdateShifts = 'http://localhost:1234/updateShifts';
//xoá ca làm việc
export const urlDeleteShifts = 'http://localhost:1234/deleteShifts';

//lấy danh sách chốt ca
export const urlGetCloseShifts = 'http://localhost:1234/getCloseShifts';
//tải danh sách ca phù hợp với giờ hiện tại
export const urlGetMatchShifts = 'http://localhost:1234/GetMatchShifts';
// thêm chốt ca mới
export const urlInsertCloseShifts = 'http://localhost:1234/insertCloseShifts';
// cập nhật chốt ca
export const urlUpdateCloseShifts = 'http://localhost:1234/updateCloseShifts';
// xoá chốt ca
export const urlDeleteCloseShifts = 'http://localhost:1234/deleteCloseShifts';


/* Quản lý Khách Hàng
 */
//lấy danh sách khách hàng
export const urlGetCustomer = 'http://localhost:1234/getCustomer';
// thêm khách hàng
export const urlInsertCustomer = 'http://localhost:1234/insertCustomer';
// sửa khách hàng
export const urlUpdateCustomer = 'http://localhost:1234/updateCustomer';
//xoá khách hàng
export const urlDeleteCustomer = 'http://localhost:1234/deleteCustomer';


/* Quản lý Kho
 */
//lấy danh sách đơn vị tính
export const urlGetUnit = 'http://localhost:1234/getUnit';
//lấy danh sách chuyển đổi đơn vị tính
export const urlGetListUnitConversions = 'http://localhost:1234/getListUnitConversions';
//lấy danh sách chuyển đổi đơn vị tính theo ID
export const urlGetListUnitConversionsByIDUnit = 'http://localhost:1234/getListUnitConversionsByIDUnit';

// thêm đơn vị tính
export const urlInsertUnit = 'http://localhost:1234/insertUnit';
// sửa đơn vị tính
export const urlUpdateUnit = 'http://localhost:1234/updateUnit';
//xoá đơn vị tính
export const urlDeleteUnit = 'http://localhost:1234/deleteUnit';

//lấy danh sách phiếu nhập
export const urlGetReceipt = 'http://localhost:1234/getReceipt';
// thêm phiếu nhập
export const urlInsertReceipt = 'http://localhost:1234/insertReceipt';
// sửa phiếu nhập
export const urlUpdateReceipt = 'http://localhost:1234/updateReceipt';
//xoá phiếu nhập
export const urlDeleteReceipt = 'http://localhost:1234/deleteReceipt';

//lấy danh sách nguyên liệu
export const urlGetIngredient = 'http://localhost:1234/getIngredient';
// thêm nguyên liệu
export const urlInsertIngredient = 'http://localhost:1234/insertIngredient';
// sửa nguyên liệu
export const urlUpdateIngredient = 'http://localhost:1234/updateIngredient';
//xoá nguyên liệu
export const urlDeleteIngredient = 'http://localhost:1234/deleteIngredient';


/* Quản lý Thực đơn
 */
//lấy danh sách toàn bộ sản phẩm 
export const urlGetProduct = 'http://localhost:1234/getProduct';
//xoá sản phẩm
export const urlDeleteProduct = 'http://localhost:1234/deleteProduct';


// thêm sản phẩm thành phẩm
export const urlInsertFinishedProduct = 'http://localhost:1234/insertFinishedProduct';
// sửa sản phẩm thành phẩm
export const urlUpdateFinishedProduct = 'http://localhost:1234/updateFinishedProduct';
// thêm sản phẩm chế biến
export const urlInsertProcessedProduct = 'http://localhost:1234/insertProcessedProduct';
// sửa sản phẩm chế biến
export const urlUpdateProcessedProduct = 'http://localhost:1234/updateProcessedProduct';

//lấy danh sách loại sản phẩm
export const urlGetTypeProduct = 'http://localhost:1234/getTypeProduct';
// thêm loại sản phẩm
export const urlInsertTypeProduct = 'http://localhost:1234/insertTypeProduct';
// sửa loại sản phẩm
export const urlUpdateTypeProduct = 'http://localhost:1234/updateTypeProduct';
//xoá loại sản phẩm
export const urlDeleteTypeProduct = 'http://localhost:1234/deleteTypeProduct';

/* Quản lý Hoá Đơn
 */
//lấy danh sách hoá đơn
export const urlGetInvoice = 'http://localhost:1234/getInvoice';
// thêm hoá đơn
export const urlInsertInvoice = 'http://localhost:1234/insertInvoice';
// sửa hoá đơn
export const urlUpdateInvoice = 'http://localhost:1234/updateInvoice';
//xoá hoá đơn
export const urlDeleteInvoice = 'http://localhost:1234/deleteInvoice';
// cập nhật trạng thái bàn ăn
export const urlUpdateStatusTable = 'http://localhost:1234/updateStatusTable';
// lấy ảnh thanh toán
export const urlGetPicturePayment = 'http://localhost:1234/getPicturePayment';
// cập nhật ảnh thanh toán
export const urlUpdatePicturePayment = 'http://localhost:1234/updatePicturePayment';
// lấy ảnh thanh toán
export const urlGetPerPointCustomert = 'http://localhost:1234/getPerPointCustomert';
// cập nhật ảnh thanh toán
export const urlUpdatePerPointCustomert = 'http://localhost:1234/updatePerPointCustomert';
// cập nhật logo
export const urlUpdateLogo = 'http://localhost:1234/updateLogo';

/* Quản lý Bếp
 */
//lấy danh sách order
export const urlGetOrder = 'http://localhost:1234/getListProductsByStatus';
//cập nhật trạng thái món ăn
export const urlUpdateStatusProduct = 'http://localhost:1234/updateStatusProduct';

/* Bảng điều khiển
 */
//lấy số bàn đang có khách
export const urlGetOccupiedTables = 'http://localhost:1234/getOccupiedTables';
//lấy số hoá đơn trong ngày
export const urlGetInvoiceToday = 'http://localhost:1234/getInvoiceToday';
//lấy tổng tiền hoá đơn trong ngày
export const urlGetRevenueToday = 'http://localhost:1234/getRevenueToday';
//lấy tổng tiền hoá đơn trong tháng
export const urlGetRevenueMonth = 'http://localhost:1234/getRevenueMonth';
//lấy tổng tiền hoá đơn trong tuần
export const urlGetListRevenueMonth = 'http://localhost:1234/getListRevenueMonth';

/* Đối tác
 */
//đăng ký đối tác mới
export const urlRegister = 'http://localhost:1234/register';
//xác thực email đối tác
export const urlRegisterCode = 'http://localhost:1234/registerCode';
// đăng nhập superadmin
export const urlLoginSuperAdmin = 'http://localhost:1234/loginSuperAdmin';
//xác thực mã code superadmin
export const urlRegisterCodeLoginSuperAdmin = 'http://localhost:1234/registerCodeLoginSuperAdmin';
//lấy danh sách đối tác (các nhà hàng đã đăng ký với hệ thống)
export const urlGetPartner = 'http://localhost:1234/getPartner';
//xoá đối tác
export const urlDeletePartner = 'http://localhost:1234/deletePartner';
//đặt lại dữ liệu đối tác
export const urlResetDataByIDDoiTac = 'http://localhost:1234/resetDataByIDDoiTac';