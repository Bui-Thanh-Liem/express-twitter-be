abstract class ABaseResponse {
  statusCode: number = 500
  message: string = 'Internal Server Error'

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode
    this.message = message
  }
}


