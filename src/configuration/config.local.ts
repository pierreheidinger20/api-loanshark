export default () => ({
  database: {
    user: "postgres",
    password: "VjIFfSIazdEWYtFJvhJrLDxdYSutkbxl",
    database: "postgres",
    server: "monorail.proxy.rlwy.net",
    port: 28244,
    synchronize: process.env.SYNCRONIZE === 'true' || process.env.TYPEORM_SYNCHRONIZE === 'true',
    ssl: process.env.SSL === 'true' || process.env.DATABASE_SSL === 'true',
    rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
    url: "postgresql://postgres:VjIFfSIazdEWYtFJvhJrLDxdYSutkbxl@monorail.proxy.rlwy.net:28244/postgres",
  },
  jwt: {
    secret: 'Kyoku@1P=W5Yp0hh+tJc',
    algorithms: ['HS256']
  },
  bcrypt: {
    saltOrRounds: 10,
  },
  externalServices: {},
  twilio: {},
});
