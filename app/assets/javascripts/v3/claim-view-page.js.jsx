var ClaimViewPage=React.createClass({
  render: function() {
    return (
      <div className="body">
        <div className="container with-bottom">
          <div className="form-horizontal">
            <ClaimHeader {...this.props} />
            <ClaimSubmitButtons {...this.props} />
            <ClaimView {...this.props} />
          </div>
        </div>
      </div>
    )
  }
});
