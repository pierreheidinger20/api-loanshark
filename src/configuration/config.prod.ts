export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    user: 'teste',
    password: 'teste',
    database: 'AccessControl',
  },
  externalServices: {},
});
