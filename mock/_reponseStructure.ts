declare interface IPagination {
  PageSize: Number
  PageIndex: Number
  Count: Number
}
declare class serviceResponse {
  Data: object
  StatusCode: Number
  Succeeded: boolean
  Code: String
  Message: String
  Pagination: IPagination
  constructor(
    _data: object,
    _statusCode: Number,
    _succeeded: boolean,
    _code: String,
    _message: String,
    _pagination: IPagination
  ) {
    this.Data = _data
    this.StatusCode = _statusCode
    this.Succeeded = _succeeded
    this.Code = _code
    this.Message = _message
    this.Pagination = _pagination
  }
  serviceResponse() {
    return {
      data: this.Data ?? {},
      statusCode: this.StatusCode ?? 0,
      succeeded: this.Succeeded ?? true,
      code: this.Code ?? 200,
      message: this.Message ?? 'Succeed',
      pagination: this.Pagination ?? {}
    }
  }
}
export default { serviceResponse }
