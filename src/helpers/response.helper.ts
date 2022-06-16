import { HttpStatus } from '@nestjs/common';
import { ResponseInterface } from '../interface/response.interface';

const sendSuccess = (...args): ResponseInterface => {
  const json: ResponseInterface = {
    status: HttpStatus.OK,
    message: '',
    data: args,
  };
  if (args.length === 1) {
    if (typeof args[0] === 'string') {
      json.message = args[0];
      json.data = null;
    } else {
      json.data = args[0];
    }
  }
  if (args.length === 2) {
    json.message = args[0];
    json.data = args[1];
  }
  if (args.length === 3) {
    json.message = args[0];
    json.status = args[1];
    json.data = args[2];
  }
  return json;
};
const sendFail = (...args): ResponseInterface => {
  const json: ResponseInterface = {
    status: HttpStatus.BAD_REQUEST,
    message: '',
    data: null,
  };
  if (args.length === 1) {
    if (typeof args[0] === 'string') {
      json.message = args[0];
    } else {
      json.data = args[0];
    }
  }
  if (args.length === 2) {
    json.message = args[0];
    json.status = args[1];
  }
  if (args.length === 3) {
    json.message = args[0];
    json.status = args[1];
    json.data = args[2];
  }
  if (!json.status) {
    json.status = HttpStatus.BAD_REQUEST;
  }
  return json;
};
export default {
  sendSuccess,
  sendFail,
};
