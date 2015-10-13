import { startBusy, endBusy, updateClaim } from "../actions";

export default React.createClass({
    handleFile: function(e) {
      var file = e.target.files[0];
      var formData = new FormData();
      var actions = this.props.actions;
      formData.append('photo[file]',  file, file.name);
      this.props.dispatch(startBusy());
      $.ajax({
        url: window.ENV.API_ROOT+'v1/photos',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        success: (data) => {
          console.log('success', data);
          this.props.dispatch(endBusy());
          this.props.dispatch(updateClaim(this.props.claim, {photo_id: data.id}));
        },
        error: () => {
          this.props.dispatch(endBusy());
          console.error('error uploading file');
        },
      });
    },

    takePicture: function(ev) {
      ev.preventDefault();
      navigator.camera.getPicture((imageUri) => {
        var options = new FileUploadOptions();
        options.fileKey = 'photo[file]';
        options.fileName = imageUri.substr(imageUri.lastIndexOf('/')+1);
        options.mimeType = 'image/jpeg';
        options.chunkedMode = true;
        var ft = new FileTransfer();
        ft.upload(imageUri, window.ENV.API_ROOT+'v1/photos', (response) => {
          console.log('picture success', response);
          this.props.dispatch(endBusy());
          var data = JSON.parse(response.response);
          this.props.dispatch(updateClaim(this.props.claim, {photo_id: data.id}));
        }, function(err) {
          console.log('picture fail', err);
        }, options);
      }, function(message) {
        console.log('picture taking failed', message);
      }, {
        destinationType: Camera.DestinationType.FILE_URI
      });
    },

    render: function() {
      return (
        <div>
          <input className="btn btn-default btn-file" type="file" onChange={this.handleFile} accept="image/*;capture=camera"/>
          {navigator.camera && <button className="btn btn-default" onClick={this.takePicture}>Take Picture</button>}
        </div>
      );
    }
});
