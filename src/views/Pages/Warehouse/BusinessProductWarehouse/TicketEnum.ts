export enum TicketStatusHistory {
  NewCreate = 1,
  Imported = 2,
  Exported = 3,
  Approve = 4,
  Depositing = 5,
  CancelExport = 7,
  CancelImport = 8,
  CancelTransfer = 9,
  Transferred = 10
}
export interface statusWhType {
  name: string
  isActive?: boolean
  approveAt?: string
  value: TicketStatusHistory
}
export enum TicketType {
  NhapKho = 1,
  XuatKho = 2,
  ChuyenKho = 3
}
export enum TicketStatus
{
    // [Description("Chờ xác nhận")]
    // [StringValue("Chờ xác nhận")]
    Pending = 1,
    // [Description("Chờ xuất/nhập kho")]
    // [StringValue("Chờ xuất/nhập kho")]
    PendingTransfer = 2,
    // [Description("Hủy phiếu")]
    // [StringValue("Hủy phiếu")]
    Cancelled = 3,
    // [Description("Đã xuất/nhập kho")]
    // [StringValue("Đã xuất/nhập kho")]
    Accepted = 4,
    // [Description("Đang đặt cọc")]
    // [StringValue("Đang đặt cọc")]
    Depositing = 5,
    // [Description("Đã đặt cọc")]
    // [StringValue("Đã đặt cọc")]
    Deposited = 6

}