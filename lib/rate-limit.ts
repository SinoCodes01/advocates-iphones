const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastRequest: 0 };

  if (now - userData.lastRequest > windowMs) {
    userData.count = 1;
    userData.lastRequest = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  return userData.count <= limit;
}
