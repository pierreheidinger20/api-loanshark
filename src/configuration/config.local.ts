export default () => ({
  database: {
    user: 'mongo',
    password: 'uxkZbIPsXMMMlPuGdSXhzXGBlgtoOmDp',
    database: 'admin',
    server: 'shinkansen.proxy.rlwy.net',
    port: '28836',
    synchronize: true,
    ssl: false,
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
    url: "mongodb://mongo:uxkZbIPsXMMMlPuGdSXhzXGBlgtoOmDp@shinkansen.proxy.rlwy.net:28836",
  },
  jwt: {
    secret: 'Kyoku@1P=W5Yp0hh+tJc',
    algorithms: ['HS256']
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
