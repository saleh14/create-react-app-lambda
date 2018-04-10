import fetch from 'node-fetch'
let dotenv = require('dotenv').config();
const ProxyAgent = require('proxy-agent');
const slackURL = process.env.SLACK_WEBHOOK_URL;
const proxyUri = 'http://proxy.mydzit.gov.sa:8080'
export function handler(event, context, callback) {
  // console.log(fetch)
  if (event.httpMethod !== "POST") {
    return callback(null, { statusCode: 410, body: "Unsupported Request Method" });
  }
  try {
    const payload = JSON.parse(event.body);
    fetch(slackURL, {
      method: "POST",
      body: JSON.stringify({ text: payload.text }),
      agent: new ProxyAgent(proxyUri)
    }).then(() => {
      callback(null, { statusCode: 204 });
    }).catch((e) => {
      callback(null, { statusCode: 500, body: "Internal Server Error: " + e });
    })
  } catch (e) {
    callback(null, { statusCode: 500, body: "Internal Server Error: " + e });
  }
}