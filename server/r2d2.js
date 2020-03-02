const dialogflow = require('dialogflow')

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
  const sessionPath = sessionClient.sessionPath(projectId, sessionId)

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

  // if (contexts && contexts.length > 0) {
  //   request.queryParams = {
  //     contexts: contexts,
  //   }
  // }

  const responses = await sessionClient.detectIntent(request)
  return responses[0]
}

async function executeQuery(projectId, sessionId, query, languageCode) {
  // Keeping the context across queries let's us simulate an ongoing conversation with the bot
  // let context
  const intentResponse = await detectIntent(
      projectId,
      sessionId,
      query,
      languageCode
      )

  return intentResponse.queryResult.fulfillmentText
  // Use the context from this response for next queries
  // context = intentResponse.queryResult.outputContexts
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