import globalActions from './globalActions';
import userActions from './userActions';
import claimActions from './claimActions';

export default {
    ...globalActions,
    ...userActions,
    ...claimActions,
}
