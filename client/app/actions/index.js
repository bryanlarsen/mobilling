import globalActions from './globalActions';
import userActions from './userActions';
import claimActions from './claimActions';
import paramsActions from './paramsActions';

export default {
    ...globalActions,
    ...userActions,
    ...claimActions,
    ...paramsActions,
}
