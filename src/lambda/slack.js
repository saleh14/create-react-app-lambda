let dotenv = require('dotenv').config()
const { google } = require('googleapis')
const { GoogleToken } = require('gtoken')
const slackURL =
  'https://hooks.slack.com/services/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'
const apiUrl =
  'https://sheets.googleapis.com/v4/spreadsheets/1fIEKhFIa9aRkGTM5NxesoNWBcG57-zExbkp7JtKNAtI/values/A2:D5'
// const slackURL = process.env.SLACK_WEBHOOK_URL
const textKey = `-----BEGIN PRIVATE KEY-----
${process.env.SERVICE_ACC_KEY.replace(/\ /g, '\n')}
-----END PRIVATE KEY-----`
export function handler (event, context, callback) {
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      statusCode: 410,
      body: 'Unsupported Request Method'
    })
  }
  const claims = context.clientContext && context.clientContext.user
  console.dir(context)
  /*   if (!claims) {
    return callback(null, {
      statusCode: 401,
      body: 'You must be signed in to call this function'
    })
  } */
  try {
    const gtoken = new GoogleToken({
      email: process.env.SERVICE_ACC_ID,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      key: textKey
    })

    gtoken
      .getToken()
      .then(accessToken => {
        console.log(accessToken)
        const sheets = google.sheets({ version: 'v4' })
        sheets.spreadsheets.values.get(
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            range: 'Class Data!A2:E'
          },
          (err, resp) => {
            if (err) {
              callback(null, {
                statusCode: 500,
                body: 'Internal Server Error 2: ' + err + `\n${slackURL}`
              })
            }
            const data = resp && resp.data ? resp.data : { values: [] }
            console.dir(data)
            const rows = data.values
            let excelData = ''
            if (rows.length) {
              console.log()
              excelData += 'Name, Major:'
              // Print columns A and E, which correspond to indices 0 and 4.
              rows.map(row => {
                excelData += `${row[0]}, ${row[4]}\n`
              })
            } else {
              excelData = 'No data found.'
            }
            callback(null, {
              statusCode: 204,
              body: JSON.stringify(data)
            })
          }
        )
      })
      .catch(e => {
        callback(null, {
          statusCode: 500,
          body: 'Internal Server Error 3: ' + err + `\n${slackURL}`
        })
      })
  } catch (e) {
    callback(null, { statusCode: 500, body: 'Internal Server Error 4: ' + e })
  }
}
