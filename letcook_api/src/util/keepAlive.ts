import axios from 'axios';
import env from './validateEnv';

export const keepAlive = () => {
  setInterval(async () => {
    try {
      await axios.get(`${env.SERVER_URL}`);
      console.log('Server pinged to keep alive');
    } catch (error) {
      console.error('Keep-alive ping failed:', error);
    }
  }, 14 * 60 * 1000); // Ping every 14 minutes
};