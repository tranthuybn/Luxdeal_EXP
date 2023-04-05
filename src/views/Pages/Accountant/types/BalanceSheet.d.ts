export interface FormDataPostAndEdit {
    ParentId: number | null
    AccountNumber: number
    AccountNumber2? : number
    AccountName: string
    Status: 0 | 1
    Id?: number
}
export interface FormData {
    typeAccount: '1' | '2'
    accountNumber2?: number
    accountNumber1: number
    accountName1: string
    accountName2: string
    status: boolean
    id: number
  }

export default {}