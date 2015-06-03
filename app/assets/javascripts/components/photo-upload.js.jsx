var PhotoUpload = React.createClass({
    handleFile: function(e) {
      var file = e.target.files[0];
      var formData = new FormData();
      var actions = this.props.actions;
      formData.append('photo[file]',  file, file.name);
      globalActions.startBusy();
      $.ajax({
        url: window.ENV.API_ROOT+'v1/photos',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(data) {
          console.log('success', data);
          globalActions.endBusy();
          actions.updateFields([
            [['photo', 'small_url'], data.small_url],
            [['photo', 'url'], data.url],
            [['photo_id'], data.id]
          ]);
        },
        error: function() {
          console.error('error uploading file');
        },
      });
    },
    render: function() {
      return (
        <input className="btn btn-default btn-file" type="file" onChange={this.handleFile} accept="image/*;capture=camera"/>
      );
    }
});
