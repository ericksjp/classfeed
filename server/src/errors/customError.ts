class CustomError<C extends string> extends Error {
  statusCode: number
  message: string
  code?: C

  constructor(code: number, message: string, c?: C) {
    super();
    this.statusCode = code
    this.message = message
    this.code = c;
  }
}

export default CustomError;
