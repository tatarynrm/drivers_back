const axios = require('axios')

const instance = axios.create({
  baseURL: "https://api.lardi-trans.com/v2",
  headers: {
    Accept: "application/json",
    Authorization: "2W3Z1XD24W3000003534",
  },
});

module.exports = instance

