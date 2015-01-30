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
