const dialogflow = require('@google-cloud/dialogflow')

const projectId = process.env.PROJECT_ID
const languageCode = 'en'
const sessionClient = new dialogflow.SessionsClient()

async function detectIntent(
  projectId,
  sessionId,
  query,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId)

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  }

  const responses = await sessionClient.detectIntent(request)
  return responses[0]
}

async function executeQuery(projectId, sessionId, query, languageCode) {
  const intentResponse = await detectIntent(
      projectId,
      sessionId,
      query,
      languageCode
      )

  return intentResponse.queryResult.fulfillmentText
}

module.exports = {
  ask: function(request = {}) {
    const { question,  sessionId} = request
    console.log('Question:', `'${question}'`)
    if (question && sessionId) {
      return executeQuery(projectId, sessionId, question, languageCode)
    } else {
      throw new Error('R2-D2 is confused by the request')
    }
  }
}