const CommentsTab = require('../components/CommentsTab');
const { claimChangeHandler } = require('../actions');

class NativeCommentsPage extends React.Component {
  render() {
    const handler = claimChangeHandler.bind(null, this.props.dispatch, this.props.claim);
    return <div className="form-horizontal">
      <CommentsTab {...this.props} store={this.props.claim} onChange={handler}/>
    </div>;
  }
};

module.exports = NativeCommentsPage;
