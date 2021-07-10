module.exports = {
  BASE_URL: process.env.NODE_ENV === 'production' ? 'http://localhost' : 'http://localhost',
  BASE_API: process.env.NODE_ENV === 'production' ? 'http://localhost/api' : '/api',
  IS_MOCK: false
}
