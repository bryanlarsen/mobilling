var ClaimPhoto = React.createClass({
  render: function() {
    return (
    <ClaimFormGroup label="Photo" width={8}>
      <p className="form-control-static">
        <a href={this.props.store.getIn(['photo', 'url'])}>
          <img src={this.props.store.getIn(['photo', 'small_url'])} width="300"/>
        </a>
      </p>
      { !this.props.readonly && <PhotoUpload {...this.props}/> }
    </ClaimFormGroup>
    );
  }
});
