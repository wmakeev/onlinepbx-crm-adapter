const nock = require('nock')

const getScope = (token, httpMethod, apiMethod, data, response) => {
  return nock('https://api.telegram.org:443', { 'encodedQueryParams': true })
    .replyContentLength()
    .replyDate()
    .intercept(`/bot${token}/${apiMethod}`, httpMethod.toUpperCase(), data || undefined)
    .reply(response.code, response.body,
    [
      'Server', 'nginx/1.10.0',
      'Content-Type', 'application/json',
      'Connection', 'close',
      'Access-Control-Allow-Origin', '*',
      'Access-Control-Allow-Methods', 'GET, POST, OPTIONS',
      'Access-Control-Expose-Headers', 'Content-Length,Content-Type,Date,Server,Connection',
      'Strict-Transport-Security', 'max-age=31536000; includeSubdomains'
    ])
}

module.exports = token => ({
  shouldGetOk ({ apiMethod, result }) {
    return getScope(token, 'GET', apiMethod, null, {
      code: 200,
      body: {
        ok: true,
        result
      }
    })
  },

  shouldPostOk ({ apiMethod, payload, result }) {
    return getScope(token, 'POST', apiMethod, payload, {
      code: 200,
      body: {
        ok: true,
        result
      }
    })
  },

  // onReplied (handler) {
  //   return nock.emitter.on('replied', handler)
  // },

  isDone () {
    return nock.isDone()
  }
})
