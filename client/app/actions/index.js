import globalActions from './globalActions';
import userActions from './userActions';
import claimActions from './claimActions';
import paramsActions from './paramsActions';
import { pushState } from 'redux-router';

export default {
    ...globalActions,
    ...userActions,
    ...claimActions,
    ...paramsActions,
  pushState
}
