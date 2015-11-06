const LoadingPage = require('./LoadingPage');
const { connect } = require('react-redux');
const { newClaim } = require('../actions');
const { pushState } = require('redux-router');

module.exports = @connect((state) => state)
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
