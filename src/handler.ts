import {app}  from './app.js';

import serverless from 'serverless-http';
//import {createServer, proxy} from 'aws-serverless-express';
console.info({
  Body: '---------------- Product and Order Management Lambda Handler Start ----------------',
});

export const hello = serverless(app);
