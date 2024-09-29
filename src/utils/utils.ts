const throwError = (msg: string, code: number) => {
  const error = new Error(msg);
  error.statusCode = code;
  throw error;
};

export { throwError };
