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
    Files?: Array
}

export interface ICustomer {
    name: string
    taxCode: number
    representative: string
    phonenumber: string
    email: string
    cccd: number
    cccdCreateAt: string
    cccdPlaceOfGrant: string
    doB: string
    sex: boolean
    address: string
    bankId: number
    accountName: string
    accountNumber: string
    bankName: string
}