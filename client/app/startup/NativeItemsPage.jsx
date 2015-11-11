const ItemsTab = require('../components/ItemsTab');
const { claimChangeHandler } = require('../actions');

class NativeItemsPage extends React.Component {
  render() {
    const handler = claimChangeHandler.bind(null, this.props.dispatch, this.props.claim);
    return <div className="form-horizontal">
      <ItemsTab {...this.props} store={this.props.claim} onChange={handler}/>
    </div>;
  }
};

module.exports = NativeItemsPage;
