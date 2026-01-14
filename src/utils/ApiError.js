class ApiError extends Error {
  constructor(message="something went wrong", statusCode,
    errors=[],
    statck=""){
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.errors = errors;
    this.statck = statck;
    this.success = false;
    if(statck){
      this.stack = statck;
    }else{
      Error.captureStackTrace(this, this.constructor);}
  }}
export default ApiError;