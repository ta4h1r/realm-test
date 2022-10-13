const Realm = require('realm')
module.exports = {
  name: 'announcement',
  properties: {
    _id: 'objectId?',
    __v: 'int?',
    bidStatus: 'string?',
    boxPassword: 'string?',
    clientId: 'string?',
    createdAt: 'date?',
    from: 'string?',
    taskStatus: 'string?',
    to: 'string?',
    updatedAt: 'date?',
  },
  primaryKey: '_id',
};