import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT || 3000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, 'dist');

app.disable('x-powered-by');

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  next();
});

app.use(express.static(distPath, { index: false }));

app.get(['/', '/admin', '/services', '/portals', '/analytics', '/woredas', '/landmarks', '/about', '/search', '/auctions'], (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('*', (req, res) => {
  const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
  if (acceptsHtml) {
    return res.sendFile(path.join(distPath, 'index.html'));
  }
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Nifas Silk-Lafto portal server running on http://localhost:${port}`);
});
