export const SITE_MAIN = 'https://vialabsdigital.com';
export const SITE_BLOG = 'https://mindfulml.vialabsdigital.com';

export const ensureMain = (url: string) => {
  if (!url) return SITE_MAIN + '/';
  if (/^https?:\/\//i.test(url)) return url; // ya absoluta
  return `${SITE_MAIN}${url.startsWith('/') ? '' : '/'}${url}`;
};
