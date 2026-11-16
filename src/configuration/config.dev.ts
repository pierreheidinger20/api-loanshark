export default () => ({
  database: {
    user: process.env.DATABASEUSER || process.env.DATABASE_USER,
    password: process.env.DATABASEPASSWORD || process.env.DATABASE_PASSWORD,
    database: process.env.DATABASENAME || process.env.DATABASE_NAME,
    server: process.env.DATABASESERVER || process.env.DATABASE_HOST,
    port: Number(process.env.DATABASEPORT || process.env.DATABASE_PORT || 5432),
    synchronize: process.env.SYNCRONIZE === 'true' || process.env.TYPEORM_SYNCHRONIZE === 'true',
    ssl: process.env.SSL === 'true' || process.env.DATABASE_SSL === 'true',
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    algorithms: process.env.JWT_ALGORITHM,
  },
  bcrypt: {
    saltOrRounds: process.env.ROUNDSBCRYPT,
  },
  externalServices: {},
  twilio: {},
});
