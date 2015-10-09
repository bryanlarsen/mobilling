var ClaimPhoto = React.createClass({
  render: function() {
    return (
    <ClaimFormGroup label="Photo" width={8}>
      <p className="form-control-static">
        { this.props.store.getIn(['photo', 'url']) &&
        <a href={window.ENV.API_ROOT.slice(0,-1) + this.props.store.getIn(['photo', 'url'])}>
          <img src={window.ENV.API_ROOT.slice(0,-1) + this.props.store.getIn(['photo', 'small_url'])} width="300"/>
        </a> }
      </p>
      { !this.props.readonly && <PhotoUpload {...this.props}/> }
    </ClaimFormGroup>
    );
  }
});
