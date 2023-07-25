import { Buffer } from 'buffer';

function JwtParser(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(Buffer.from(base64, 'base64'));
}

export default JwtParser;
