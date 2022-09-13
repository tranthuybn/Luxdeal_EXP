const config: {
  base_url: {
    base: string
    dev: string
    pro: string
    test: string
  }
  result_code: number | string
  default_headers: AxiosHeaders
  request_timeout: number
} = {
  /**
   * API request the basic path
   */
  base_url: {
    // Development environment interface prefix
    base: '',

    // Packing and development environment interface prefix
    dev: '',

    // Packing the production environment interface prefix
    pro: '',

    // Package test environment interface prefix
    test: ''
  },

  /**
   * The interface successfully returns status code
   */
  result_code: '0000',

  /**
   * Interface request timeout time
   */
  request_timeout: 7000,

  /**
   * Default interface request type
   * Optional value: Application/X-WWW-Form-Urlencoded Multipart/Form-Data
   */
  default_headers: 'application/json'
}

export { config }
