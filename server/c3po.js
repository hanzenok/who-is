const { Datastore } = require('@google-cloud/datastore');

const datastore = new Datastore();

module.exports = {
    explain: async function(id) {
        const query = datastore
        .createQuery('Dialog')
        .filter('key', '=', id);
        try {
            console.log('Requesting Datastore ...')
            const [dialogs] = await datastore.runQuery(query);
            if (dialogs && dialogs[0]) {
                return dialogs[0].value;
            }
            else {
                throw new Error('C-3P0 doesnt understand your request')
            }
        } catch (error) {
            throw error
        }
    }
}