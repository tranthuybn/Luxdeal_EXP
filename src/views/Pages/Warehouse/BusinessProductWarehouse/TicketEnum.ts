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