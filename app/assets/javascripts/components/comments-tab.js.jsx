var CommentsTab = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    var comments = this.props.store.get('comments') || Immutable.fromJS([]);
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
           <p className="form-control-static"><pre>{this.props.store.get('submission')}</pre></p>
         </div>
         </fieldset>
        }

        {this.props.store.get('original_id') && <ClaimStaticOptional {...this.props} name="original_id" label="Original Claim" value={<a href={this.props.claimHref(this.props.store.get('original_id'))}>{this.props.store.get('original_id')}</a>}/>}

        {!this.props.readonly && <ClaimErrors data={this.props.store.get('validations')} name="Warnings" text={warningText}/>}
        {!this.props.readonly && <ClaimErrors data={this.props.store.get('warnings')} name="Warnings" text={warningText}/>}
        {!this.props.readonly && <ClaimErrors data={this.props.store.get('errors')} name="Errors"/>}
      </div>
    );
  },
});
