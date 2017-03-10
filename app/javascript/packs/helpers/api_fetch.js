import fetchDefaults from 'fetch-defaults'

function getCookieValue(a) {
  const b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

export const apiFetch = fetchDefaults(fetch, {
  headers: { 'X-CSRF-TOKEN': decodeURIComponent(getCookieValue('CSRF-TOKEN')) }
});
