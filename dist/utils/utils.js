"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
const throwError = (msg, code) => {
    const error = new Error(msg);
    error.statusCode = code;
    throw error;
};
exports.throwError = throwError;
