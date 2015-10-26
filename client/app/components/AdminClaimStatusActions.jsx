import _ from 'underscore';
import s from 'underscore.string';
import { ClaimFormGroup, ClaimInputWrapper, RadioSelect} from '../components';

export default React.createClass({
  doneHandler: function(ev) {
    var disabled = this.props.store.unsaved || _.size(this.props.store.errors) !== 0;
    if (!disabled) window.location.href = this.props.backURL;
  },

  nextHandler: function(ev) {
    var cur = this.props.stack.indexOf(this.props.store.id);
    var next = this.props.stack[cur+1];
    this.props.loadClaim(next);
  },

  prevHandler: function(ev) {
    var cur = this.props.stack.indexOf(this.props.store.id);
    var prev = this.props.stack[cur-1];
    this.props.loadClaim(prev);
  },

  render: function() {
    var statuses = {
      "saved":          ["saved", "for_agent", "ready"],
      "for_agent":      ["for_agent", "ready", "file_created", "doctor_attention", "done"],
      "ready":          ["for_agent", "ready", "file_created", "doctor_attention", "done", "reclaimed"],
      "file_created":   ["file_created", "agent_attention", "done", "reclaimed"],
//      "uploaded":       ["uploaded", "acknowledged", "agent_attention", "done"],
//      "acknowledged":   ["acknowledged", "agent_attention", "done", "reclaimed"],
      "agent_attention": ["agent_attention", "done", "reclaimed"],
      "doctor_attention": ["doctor_attention", "for_agent", "ready"],
      "done":           ["done", "reclaimed"],
      "reclaimed":      [],
    }[this.props.store.status];

    var cur = this.props.stack.indexOf(this.props.store.id);
    var next = this.props.stack[cur+1];
    var prev = this.props.stack[cur-1];
    var form = this;

    var disabled = this.props.store.unsaved || _.size(this.props.store.errors) !== 0;

    console.log(this.props.store.unsaved, this.props.store.errors, disabled, statuses);
    var statusOptions = {};
    _.each(statuses, function(status) {
      if (status==='reclaimed') return;
      if (status==='ready' &&
           _.size(this.props.store.warnings) !== 0 ||
           _.size(this.props.store.errors) !== 0) {
             return;
      }
      statusOptions[status] = s.humanize(status);
    }, this);
    console.log(statusOptions);

    return (
        <fieldset>
          <legend>Action</legend>
          <ClaimFormGroup label="Status" width={8}>
            <ClaimInputWrapper {...this.props} name="status" >
              <RadioSelect {...this.props} name="status" options={statusOptions} />
            </ClaimInputWrapper>
          </ClaimFormGroup>

           {
           _.map(statuses, function(status) {

             if (status === 'reclaimed') {
               return (
                 <div className="row" key="action-reclaimed">
                   <form action={'/admin/claims/'+this.props.store.id+'/reclaim'} method="POST">
                     <input type="hidden" name="authenticity_token" value={$('meta[name=csrf-token]').attr('content')}/>
                     <button className="btn btn-primary btn-lg col-md-2 col-md-offset-6" type="submit" disabled={disabled}>
                       <i className="fa fa-recycle"/>
                       &nbsp;Reclaim
                     </button>
                   </form>
                 </div>
               );
             }

             return undefined;
           }, this)
          }

          <div className="row" >
            <div className="col-md-4"/>
            <button className='btn btn-lg btn-primary col-md-2' disabled={!prev || disabled} onClick={this.prevHandler}>
              <i className="fa fa-angle-left"/>
              &nbsp;Previous
            </button>

            <button className='btn btn-lg btn-primary col-md-2' onClick={this.doneHandler} disabled={disabled}>
              <i className="fa fa-check"/>
              &nbsp;OK
            </button>

            <button className='btn btn-lg btn-primary col-md-2' onClick={this.nextHandler} disabled={!next || disabled}>
              <i className="fa fa-angle-right"/>
              &nbsp;Next
            </button>
          </div>
       </fieldset>
    );

          <div className="form-group">
            <div className="col-md-8 col-md-offset-4">
              <button className="btn btn-warning" onClick={this.props.actions.undo} disabled={!this.props.store.changed}>
                <i className="fa fa-undo"/>
                &nbsp;Undo
              </button>
            </div>
          </div>

  }
});

