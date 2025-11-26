import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV ?? 'dev',
  postgres: {
    dbName: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  aws: {
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET,
  },
}));
