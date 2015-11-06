const globalActions = require('./globalActions');
const userActions = require('./userActions');
const claimActions = require('./claimActions');
const paramsActions = require('./paramsActions');

module.exports = {
    ...globalActions,
    ...userActions,
    ...claimActions,
    ...paramsActions,
}
