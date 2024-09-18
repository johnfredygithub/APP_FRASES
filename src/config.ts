import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  postgres: {
    DATABASE_URL: process.env.DB_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
  emailUser: process.env.EMAIL,
  emailPassword: process.env.PASS_EMAIL,
  apiKey: process.env.API_KEY,
  tasks: process.env.TASKS,
  LINK_FRONTEND: process.env.LINK_FRONTEND,
  LINK_FRONTEN_RECOVERY: process.env.LINK_FRONTEND_RECOVERY,
}));
