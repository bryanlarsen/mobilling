import ClaimFormGroup from '../components/ClaimFormGroup';
import PhotoUpload from '../components/PhotoUpload';

export default React.createClass({
  render: function() {
    return (
    <ClaimFormGroup label="Photo" width={8}>
      <p className="form-control-static">
        { this.props.claim.photo && this.props.claim.photo.url &&
        <a href={window.ENV.API_ROOT.slice(0,-1) + this.props.claim.photo.url}>
          <img src={window.ENV.API_ROOT.slice(0,-1) + this.props.claim.photo.small_url} width="300"/>
        </a> }
      </p>
      { !this.props.readonly && <PhotoUpload {...this.props}/> }
    </ClaimFormGroup>
    );
  }
});
