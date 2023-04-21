export interface FormDataPostAndEdit  {
    Id: number
    Code: string
    CreateAt: string
    CreatedBy: string
    Description: string
    PeopleId: number
    PeopleType: 1
    TotalMoney: number
    EnterMoney: string
    TypeOfPayment: 1 | 2
    FundID?: number
    Transacted: boolean
    Type: 1 | 0
    Status: number
    Carrying: boolean
    CreatedId: number
}

export interface FormData {
    code: string
    createdAt: string
    createdBy?: string
    createdId: number
    description: string
    peopleId: number
    totalMoney: number
    enterMoney: string
    typeOfPayment: 1 | 2
    accountNumber: any
    paid: boolean
}

