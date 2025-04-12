import CustomError from "./customError";

class EntityNotFoundError extends CustomError<ErrorCode> {}
class ValidationError extends CustomError<ErrorCode> {}
class ParamError extends CustomError<ErrorCode> {}
class AuthorizationError extends CustomError<ErrorCode> {}
class AuthenticationError extends CustomError<ErrorCode> {}
class TokenError extends CustomError<ErrorCode> {}
class TimeoutError extends CustomError<ErrorCode> {}
class ConflictError extends CustomError<ErrorCode> {}
class FileError extends CustomError<ErrorCode> {}
class InternalError extends CustomError<ErrorCode> {}
class OTPError extends CustomError<ErrorCode> {}

export {
  EntityNotFoundError,
  ValidationError,
  ParamError,
  AuthorizationError,
  AuthenticationError,
  TokenError,
  TimeoutError,
  ConflictError,
  FileError,
  InternalError,
  OTPError,
}
