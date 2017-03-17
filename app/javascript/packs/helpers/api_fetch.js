import fetchDefaults from 'fetch-defaults'
import 'whatwg-fetch'

function getCookieValue(a) {
  const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

export const apiFetch = fetchDefaults(fetch, {
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': decodeURIComponent(getCookieValue('CSRF-TOKEN'))
  },
  credentials: 'same-origin'
});
