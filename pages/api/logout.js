// pages/api/logout.js
import { clearSession } from '../../lib/auth';

export default function handler(req, res) {
  clearSession(res);
  return res.redirect('/');
}
