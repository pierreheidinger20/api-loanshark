export default () => ({
  database: {
    user: 'postgres',
    password: 'AB6sq99q46alFINqjlKq',
    database: 'railway',
    server: 'containers-us-west-51.railway.app',
    port: '7123',
    synchronize: true,
    ssl: false,
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
  },
  jwt: {
    secret: 'i4xlLEWulJX3DfYkJtXWobRj',
    expiresIn: '3000s',
  },
  bcrypt: {
    saltOrRounds: 10,
  },
  externalServices: {
    google: {
      clientID: '',
    },
  },
  twilio: {},
});
