import fetchDefaults from 'fetch-defaults'
import 'whatwg-fetch'
import { browserHistory } from 'react-router';

function getCookieValue(a) {
  const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

const leadApiFetch = fetchDefaults(fetch, {
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': decodeURIComponent(getCookieValue('CSRF-TOKEN'))
  },
  credentials: 'same-origin'
});

export const apiFetch = (url, options) => {
  return new Promise((resolve, error) => {
    return leadApiFetch(url, options).then(result => {
      if (result.status === 401) {
        error(result);
        browserHistory.replace('/');
      } else {
        resolve(result);
      }
    });
  });
}
