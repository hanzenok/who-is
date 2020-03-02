const { Datastore } = require('@google-cloud/datastore')

const datastore = new Datastore()

const ERROR = 'C-3P0 doesnt understand your request'

module.exports = {
  explain: async function(id) {
    const query = datastore
    .createQuery('Dialog')
    .filter('key', '=', id)
    try {
      const [dialogs] = await datastore.runQuery(query)
      if (dialogs && dialogs[0]) {
          return dialogs[0].value
      }
      else {
          throw new Error(ERROR)
      }
    } catch (error) {
      throw error
    }
  },
  canAsk: async function() {
    const query = datastore
    .createQuery('Dialog')
    try {
      const [dialogs] = await datastore.runQuery(query)
      if (dialogs) {
        const questions = dialogs.filter(dialog => dialog.question)
        if (questions) {
          const randIndex = Math.floor((Math.random()*questions.length))
          return questions[randIndex].question
        }
        else {
          throw new Error(ERROR)
        }
      }
        else {
          throw new Error(ERROR)
        }
    } catch (error) {
      throw error
    }
  }
}