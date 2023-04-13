export interface IFormData {
    code: string
    discount: number
    customerId: number
}
export interface FormDataPostAndEdit {
    CustomerId: number
    Code: string
    Status: number
    Discount: number
    AccountNumber: string
    AccountName: string
    BankId: number | null
    Files?: any
}