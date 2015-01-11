var ClaimComment = React.createClass({
  render: function() {
    return (
      <div className="form-group">
        <div className="control-label col-md-2">
          <label>{moment(this.props.comment.get('created_at')).fromNow()}</label>
          <p className="text-muted">{this.props.comment.get('user_name')}</p>
        </div>
        <div className="col-md-10">
          <p className="form-control-static">
            {this.props.comment.get('body')}
          </p>
        </div>
      </div>
    );
  }
});

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

        <ClaimErrors data={this.props.store.get('validations')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('warnings')} name="Warnings"/>
        <ClaimErrors data={this.props.store.get('errors')} name="Errors"/>
      </div>
    );
  },
});
