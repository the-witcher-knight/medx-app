import { AuthLoginKey } from 'constants';

import JwtParser from './jwt';
import StorageAPI from './storageAPI';

export default function CheckUserLogin() {
  const jwt = StorageAPI.local.get(AuthLoginKey);
  if (!jwt) {
    return false;
  }

  const payload = JwtParser(jwt);
  const { exp } = payload;
  if (exp && Date.now() < exp * 1000) {
    return true;
  }

  return false;
}
