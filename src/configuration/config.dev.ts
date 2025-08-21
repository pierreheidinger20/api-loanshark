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
  },
  jwt: {
    secret: process.env.SECRETTOKEN,
    expiresIn: process.env.TOKENEXPIRE,
  },
  bcrypt: {
    saltOrRounds: process.env.ROUNDSBCRYPT,
  },
  externalServices: {},
  twilio: {},
});
