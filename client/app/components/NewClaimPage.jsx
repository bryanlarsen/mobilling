import { LoadingPage } from '../components';
import { connect } from 'react-redux';
import { newClaim } from '../actions';
import { pushState } from 'redux-router';

export default @connect((state) => state)
class NewClaimPage extends React.Component {
  componentWillMount() {
    this.props.dispatch(newClaim((id) => {
      this.props.dispatch(pushState(null, `/claim/${id}/patient`));
    }));
  }

  render() {
    return <LoadingPage {...this.props}/>;
  }
};
