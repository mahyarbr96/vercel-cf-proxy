export default async function handler(req, res) {
  const url = 'https://cdo.iranesabz.workers.dev' + req.url;
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    const body = await response.text();
    res.setHeader('Content-Type', contentType || 'text/html');
    res.status(response.status).send(body);
  } catch (error) {
    res.status(500).send("خطا در اتصال به Worker");
  }
}
