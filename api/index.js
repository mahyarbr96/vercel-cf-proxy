export default async function handler(req, res) {
  const upstream = 'https://cdo.iranesabz.workers.dev';
  const blockedCountries = ['CN', 'KP', 'SY', 'PK', 'CU'];
  const blockedIPs = ['0.0.0.0', '127.0.0.1'];
  const disableCache = true;

  const region = req.headers['x-vercel-ip-country']?.toUpperCase() || '';
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || '';
  const userAgent = req.headers['user-agent'] || '';

  // بلاک منطقه یا آی‌پی
  if (blockedCountries.includes(region)) {
    res.status(403).send('Access denied: Not available in your region.');
    return;
  }
  if (blockedIPs.includes(ip)) {
    res.status(403).send('Access denied: Your IP is blocked.');
    return;
  }

  try {
    const targetURL = upstream + req.url.replace('/api', '');
    const upstreamResponse = await fetch(targetURL, {
      method: req.method,
      headers: {
        'User-Agent': userAgent,
        'Referer': req.headers['host'],
      },
    });

    const contentType = upstreamResponse.headers.get('content-type');
    const body = await upstreamResponse.text();

    if (disableCache) {
      res.setHeader('Cache-Control', 'no-store');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType || 'text/html');
    res.status(upstreamResponse.status).send(body);
  } catch (err) {
    res.status(500).send('Proxy Error: ' + err.message);
  }
}
