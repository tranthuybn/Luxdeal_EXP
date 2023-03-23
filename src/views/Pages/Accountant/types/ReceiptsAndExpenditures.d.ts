export interface FormDataPostAndEdit  {
    Code: string
    CreateAt: string
    CreatedBy: string
    Description: string
    PeopleType: string
    TotalMoney: number
    EnterMoney: string
    PaymentMethod: number
    AccountNumber: number
    Paid: boolean
    Type: 1 | 2
}

export interface FormData {
    code: string
    createAt: string
    createdBy: string
    description: string
    peopleType: string
    totalMoney: number
    enterMoney: string
    paymentMethod: number
    accountNumber: number
    paid: boolean
}