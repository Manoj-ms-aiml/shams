const normalizeBaseUrl = (baseUrl: string): string => {
  if (!baseUrl) return '/';
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

export const resolveMediaPath = (path: string): string => {
  const sanitizedPath = path.replace(/^\/+/, '');
  const base = normalizeBaseUrl(import.meta.env.BASE_URL);
  return `${base}${sanitizedPath}`;
};
