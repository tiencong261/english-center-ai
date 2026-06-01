export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export function createCorsResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...init.headers,
    },
    ...init,
  })
}

export function corsOptionsResponse() {
  return new Response(null, { headers: CORS_HEADERS })
}
