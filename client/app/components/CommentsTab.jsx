export default React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  componentDidMount: function() {
    if (this.props.store.unread_comments > 0) {
      this.props.actions.updateFields([[['unread_comments'], 0]]);
    }
  },

  render: function() {
    var comments = this.props.store.comments || Immutable.fromJS([]);
    var warningText = !this.props.agent && 'Your agent can fix these for you.'
    return (
      <div>
        {!this.props.readonly && <legend>Comments</legend>}
        { comments.map(function(comment, i) {
            return <ClaimComment {...this.props} comment={comment} key={'comment'+i} />;
         }, this).toJS() }
        {!this.props.readonly && <ClaimInputGroup name="comment" store={this.props.store} onChange={this.handleChange}/>}

        { this.props.agent && !this.props.readonly &&
         <fieldset>
         <legend>File</legend>
         <div className="form-group">
           <p className="form-control-static"><pre>{this.props.store.submission}</pre></p>
         </div>
         </fieldset>
        }

        {this.props.store.original_id && <ClaimStaticOptional {...this.props} name="original_id" label="Original Claim" value={<a href={this.props.claimHref(this.props.store.original_id)}>{this.props.store.original_id}</a>}/>}

        {!this.props.readonly && <ClaimErrors data={this.props.store.validations} name="Warnings" text={warningText}/>}
        {!this.props.readonly && <ClaimErrors data={this.props.store.warnings} name="Warnings" text={warningText}/>}
        {!this.props.readonly && <ClaimErrors data={this.props.store.errors} name="Errors"/>}
      </div>
    );
  },
});
