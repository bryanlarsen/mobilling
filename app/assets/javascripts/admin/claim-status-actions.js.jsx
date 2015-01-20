var ClaimStatusActions = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  doneHandler: function(ev) {
    var disabled = this.props.store.get('unsaved') || this.props.store.get('errors').count() !== 0;
    if (!disabled) window.location.href = this.props.backURL;
  },

  nextHandler: function(ev) {
    var cur = this.props.stack.indexOf(this.props.store.get('id'));
    var next = this.props.stack[cur+1];
    this.props.actions.load(next);
   },

  render: function() {
    var statuses = {
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
    }[this.props.store.get('status')];

    var statusOptions = {};
    _.each(statuses, function(status) {
      if (status!=='reclaimed') statusOptions[status] = _.string.humanize(status);
    });

    var cur = this.props.stack.indexOf(this.props.store.get('id'));
    var next = this.props.stack[cur+1];
    var prev = this.props.stack[cur-1];
    var form = this;

    var disabled = this.props.store.get('unsaved') || this.props.store.get('errors').count() !== 0;

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

          <ClaimFormGroup label="Status">
            <ClaimInputWrapper {...this.props} name="status">
              <RadioSelect {...this.props} name="status" options={statusOptions} onChange={this.handleChange} />
            </ClaimInputWrapper>
          </ClaimFormGroup>

          <div className="row" >
            <div className="col-md-2"/>
            <button className='btn btn-lg btn-primary col-md-2' disabled={true || !prev || disabled}>
              <i className="fa fa-angle-left"/>
              &nbsp;Previous
            </button>

            <button className='btn btn-lg btn-primary col-md-2' onClick={this.doneHandler} disabled={disabled}>
              <i className="fa fa-check"/>
              &nbsp;Done
            </button>

            <button className='btn btn-lg btn-primary col-md-2' onClick={this.nextHandler} disabled={true || !next || disabled}>
              <i className="fa fa-angle-right"/>
              &nbsp;Next
            </button>
          </div>
           {
           _.map(statuses, function(status) {

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

             return undefined;
           }, this)
          }
        </fieldset>
    );
  }
});

