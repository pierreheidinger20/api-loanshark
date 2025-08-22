export default () => ({
  database: {
    user: process.env.DATABASEUSER,
    password: process.env.DATABASPASSWORD,
    database: process.env.DATABASENAME,
    server: process.env.DATABASESERVER,
    port: process.env.DATABASEPORT,
    synchronize: process.env.SYNCRONIZE,
    ssl: process.env.SSL,
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
    url: process.env.MONGO_URL,
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
