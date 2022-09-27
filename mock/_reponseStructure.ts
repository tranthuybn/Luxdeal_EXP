interface IPagination {
  pageSize: Number
  pageIndex: Number
  count: Number
}
export class serviceResponse {
  data: object | null
  StatusCode: Number
  Succeeded: boolean
  Code: Number | String
  Message: String
  pagination: IPagination | null
  constructor(
    _data: object | null,
    _statusCode: Number,
    _succeeded: boolean,
    _code: Number | String,
    _message: String,
    _pagination: IPagination | null
  ) {
    this.data = _data
    this.StatusCode = _statusCode
    this.Succeeded = _succeeded
    this.Code = _code
    this.Message = _message
    this.pagination = _pagination
  }
  setServiceResponse() {
    return {
      data: this.data ?? {},
      statusCode: this.StatusCode ?? 0,
      succeeded: this.Succeeded ?? true,
      code: this.Code ?? 200,
      message: this.Message ?? 'Succeed',
      pagination: this.pagination ?? {}
    }
  }
}
