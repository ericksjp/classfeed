class CustomError<C extends string> extends Error {
  statusCode: number
  message: string
  code?: C
  details?: {[key: string]: string};

  constructor(code: number, message: string, c?: C, details?: {[key: string]: string}) {
    super();
    this.statusCode = code
    this.message = message
    this.details = details
    this.code = c;
  }
}

export default CustomError;
