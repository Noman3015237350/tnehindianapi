const express = require('express');
const cors = require('cors');
const smsRoutes = require('./api/index');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(smsRoutes);

app.get('/', (req, res) => res.json({
  name: 'TNEH Indian SMS API',
  developer: '@tneh_owner',
  endpoints: {
    sms:    '/api/sms?number=&count=&services=',
    stop:   '/api/stop?jobid=',
    status: '/api/status?jobid=',
    log:    '/api/log'
  }
}));

app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

app.listen(PORT, HOST, () => {
  console.log(`🔥 TNEH SMS API running on http://${HOST}:${PORT}`);
});
