var ClaimStatusActions = React.createClass({
  render: function() {
    var cur = this.props.stack.indexOf(this.props.store.get('id'));
    var next = this.props.stack[cur+1];
    var prev = this.props.stack[cur-1];
    var form = this;
    return (
        <fieldset>
          <legend>Action</legend>

          <div className="form-group">
            <div className="col-md-10 col-md-offset-2">
              <button className="btn btn-warning" onClick={this.props.actions.undo} disabled={!this.props.store.get('changed')}>
                <i className="fa fa-undo"/>
                &nbsp;Undo
              </button>
            </div>
          </div>

          {
           _.map({
            "saved":          ["saved", "for_agent", "ready"],
            "for_agent":      ["for_agent", "ready", "doctor_attention", "done"],
            "ready":          ["for_agent", "ready", "doctor_attention", "done", "reclaimed"],
            "file_created":   ["file_created", "uploaded", "acknowledged", "agent_attention", "done"],
            "uploaded":       ["uploaded", "acknowledged", "agent_attention", "done"],
            "acknowledged":   ["acknowledged", "agent_attention", "done"],
            "agent_attention": ["agent_attention", "done", "reclaimed"],
            "doctor_attention": ["doctor_attention", "for_agent", "ready"],
            "done":           ["done", "reclaimed"],
            "reclaimed":      ["done", "reclaimed"],
           }[this.props.store.get('status')], function(status) {

             var disabled = this.props.store.get('unsaved') || this.props.store.get('errors').count() !== 0;
             if (status === 'ready' &&
                 ((this.props.store.get('validations') || Immutable.List()).count() !== 0 ||
                  this.props.store.get('warnings').count() !== 0)) {
                    disabled = true;
             }

             if (status === 'reclaimed') {
               return (
                 <div className="row" key="action-reclaimed">
                   <button className="btn btn-primary col-md-2 col-md-offset-4" onClick={this.load.bind(this, prev)} disabled={!prev || disabled}>
                     <i className="fa fa-recycle"/>
                     &nbsp;Reclaim
                   </button>
                 </div>
               );
             }

             var className = (status === this.props.store.get('status') ? 'btn btn-info col-md-2' : 'btn btn-primary col-md-2');

             var prevHandler = function() {
/*               form.state.store.get('status') = status;
               form.sync(form.state.claim, function(err, claim) {
                 if (!err) form.load(prev);
               }); */
             };

             var nextHandler = function() {
               form.actions.updateFields({status: status}, 17);
               form.actions.load(next);
             };

             var doneHandler = function() {
               /* form.state.store.get('status') = status; */
               form.sync(form.state.claim, function(err, claim) {
                 if (!err) window.location.href = form.props.backURL;
               });
             };

             return (
              <div className="row" key={'action-'+status}>
                  <div className="col-md-2"/>
                  <button className={className} onClick={prevHandler} disabled={!prev || disabled}>
                    <i className="fa fa-angle-left"/>
                    &nbsp;{_.string.humanize(status)}
                  </button>

                  <button className={className} onClick={doneHandler} disabled={disabled}>
                    <i className="fa fa-check"/>
                    &nbsp;{_.string.humanize(status)}
                  </button>

                  <button className={className} onClick={nextHandler} disabled={!next || disabled}>
                    <i className="fa fa-angle-right"/>
                    &nbsp;{_.string.humanize(status)}
                  </button>
              </div>
             );
           }, this)
          }
        </fieldset>
    );
  }
});

