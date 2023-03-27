export interface FormDataPostAndEdit  {
    Code: string
    CreateAt: string
    CreatedBy: string
    Description: string
    PeopleId: number
    PeopleType: 1
    TotalMoney: number
    EnterMoney: string
    TypeOfPayment: 1 | 2
    AccountNumber?: number
    Transacted: boolean
    Type: 1 | 0
}

export interface FormData {
    code: string
    createdAt: string
    createdBy: string
    description: string
    peopleType: string
    totalMoney: number
    enterMoney: string
    typeOfPayment: 1 | 2
    accountNumber: number
    paid: boolean
}