const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

const PORT = process.env.WEBHOOK_PORT || 9000;
const routeConfig = {
  '/deploy': {
    secret: process.env.WEBHOOK_SECRET_GEORGIA || 'georgia-legal-webhook-secret-2025',
    script: '/var/www/webhooks/deploy.sh',
  },
  '/legalcore-deploy': {
    secret: process.env.WEBHOOK_SECRET_LEGALCORE || 'legalcore-webhook-secret-2025',
    script: '/var/www/webhooks/legalcore-deploy.sh',
  },
  '/geresidency-deploy': {
    secret: process.env.WEBHOOK_SECRET_GERESIDENCY || 'geresidency-webhook-secret-2025',
    script: '/var/www/webhooks/geresidency-deploy.sh',
  },
  '/georgian-support-deploy': {
    secret: process.env.WEBHOOK_SECRET_GEORGIAN_SUPPORT || 'georgian-support-webhook-secret-2025',
    script: '/var/www/webhooks/georgian-support-deploy.sh',
  },
};

const server = http.createServer((req, res) => {
  const path = req.url.split('?')[0];
  const route = routeConfig[path];

  if (req.method === 'POST' && route) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const signature = req.headers['x-hub-signature-256'];
      const hash = 'sha256=' + crypto.createHmac('sha256', route.secret).update(body).digest('hex');

      if (signature === hash) {
        console.log(`Valid webhook for ${path}, deploying...`);
        exec(route.script, (err, stdout, stderr) => {
          console.log(stdout);
          if (err) console.error(stderr);
        });
        res.writeHead(200);
        res.end('Deploying...');
      } else {
        res.writeHead(401);
        res.end('Unauthorized');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => console.log(`Webhook server on port ${PORT}`));
