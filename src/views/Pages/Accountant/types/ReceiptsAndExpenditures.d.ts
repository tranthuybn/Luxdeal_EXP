export interface FormDataPostAndEdit  {
    Code: string
    CreateAt: string
    CreatedBy: string
    Description: string
    PeopleType: string
    TotalMoney: number
    EnterMoney: string
    TypeOfPayment: 1 | 2
    AccountNumber?: number
    Paid?: boolean
    Type: 1 | 0
}

export interface FormData {
    code: string
    createAt: string
    createdBy: string
    description: string
    peopleType: string
    totalMoney: number
    enterMoney: string
    typeOfPayment: 1 | 2
    accountNumber: number
    paid: boolean
}