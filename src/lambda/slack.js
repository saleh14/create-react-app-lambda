import fetch from 'node-fetch'
let dotenv = require('dotenv').config()
const ProxyAgent = require('proxy-agent')
const slackURL =
  'https://hooks.slack.com/services/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'
// const slackURL = process.env.SLACK_WEBHOOK_URL
const proxyUri = 'http://proxy.mydzit.gov.sa:8080'
export function handler (event, context, callback) {
  // console.log(fetch)
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 410,
      body: 'Unsupported Request Method'
    })
  }
  const claims = context.clientContext && context.clientContext.user
  if (!claims) {
    return callback(null, {
      statusCode: 401,
      body: 'You must be signed in to call this function'
    })
  }
  try {
    const payload = JSON.parse(event.body)
    fetch(slackURL, {
      method: 'POST',
      body: JSON.stringify({
        text: payload.text,
        attachments: [{ text: `From ${claims.email}` }]
      })
    })
      .then(() => {
        callback(null, { statusCode: 204 })
      })
      .catch(e => {
        callback(null, {
          statusCode: 500,
          body: 'Internal Server Error 1: ' + e + `\n${slackURL}`
        })
      })
  } catch (e) {
    callback(null, { statusCode: 500, body: 'Internal Server Error 2: ' + e })
  }
}
