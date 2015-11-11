const ConsultTab = require('../components/ConsultTab');
const { claimChangeHandler } = require('../actions');

class NativeConsultPage extends React.Component {
  render() {
    const handler = claimChangeHandler.bind(null, this.props.dispatch, this.props.claim);
    return <div className="form-horizontal">
      <ConsultTab {...this.props} store={this.props.claim} onChange={handler}/>
    </div>;
  }
};

module.exports = NativeConsultPage;
