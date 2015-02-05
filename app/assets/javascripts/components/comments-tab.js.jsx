var CommentsTab = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  render: function() {
    var comments = this.props.store.get('comments') || Immutable.fromJS([]);
    return (
      <div>
        <legend>Comments</legend>
        { comments.map(function(comment, i) {
            return <ClaimComment {...this.props} comment={comment} key={'comment'+i} />;
         }, this).toJS() }
        <ClaimInputGroup name="comment" store={this.props.store} onChange={this.handleChange}/>

        { this.props.store.get('template') === 'agent' &&
         <fieldset>
         <legend>File</legend>
         <div className="form-group">
           <p className="form-control-static"><pre>{this.props.store.get('submission')}</pre></p>
         </div>
         </fieldset>
        }

        {this.props.store.get('original_id') && <ClaimStaticOptional {...this.props} name="original_id" label="Original Claim" value={<a href={this.props.claimHref(this.props.store.get('original_id'))}>{this.props.store.get('original_id')}</a>}/>}

        <ClaimErrors data={this.props.store.get('validations')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('warnings')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('errors')} name="Errors"/>
      </div>
    );
  },
});
