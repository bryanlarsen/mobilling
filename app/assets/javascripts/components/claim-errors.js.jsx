var ClaimErrors = React.createClass({
  render: function() {
    if (!this.props.data || this.props.data.count()===0) return null;
    var numErrors = 0;
    var response = (
      <fieldset>
        <legend>{this.props.name}</legend>

        {
         _.map(this.props.data.toJS(), function(errs, name) {
           var nErrors = 0;
           var r = (
        <div className="form-group" key={'err-'+this.props.name+'-'+name}>
          <label className="control-label col-md-2">{_.string.humanize(name.replace(/\./g, ': '))}</label>
          <div className="col-md-10">
          { _.map(errs, function(err, i) {
            nErrors++;
            numErrors++;
            return (
              <p key={'err-'+this.props.name+'-'+name+'-'+i}
                 className="form-control-static">
                {err}
              </p>
            );
            }, this)
          }
          </div>
        </div>
           );
           return nErrors ? r : null;
         }, this)
         }
      </fieldset>
    );
    return numErrors ? response : null;
  }
});

