const ClaimComment = require('./ClaimComment');
const ClaimInputGroup = require('./ClaimInputGroup');
const ClaimStaticOptional = require('./ClaimStaticOptional');
const ClaimErrors = require('./ClaimErrors');
const { setComment } = require('../actions');

module.exports = React.createClass({
  handleChange: function(ev) {
    this.props.actions.updateFields([[[ev.target.name], ev.target.value]]);
  },

  componentDidMount: function() {
    if (this.props.store.unread_comments > 0) {
      this.props.actions.updateFields([[['unread_comments'], 0]]);
    }
  },

  render: function() {
    var liveComment = null;
    var comments = (this.props.claim.comments || []).filter((comment) => {
      if (comment.live) {
        liveComment = comment;
        return false;
      } else return true;
    });
    var warningText = !this.props.agent && 'Your agent can fix these for you.'
    return (
      <div>
        {!this.props.readonly && <legend>Comments</legend>}
        { comments.map(function(comment, i) {
            return <ClaimComment {...this.props} comment={comment} key={'comment'+i} />;
         }, this) }
        {!this.props.readonly && liveComment && <ClaimInputGroup store={liveComment} name="body" onChange={(ev) => this.props.dispatch(setComment(this.props.claim.id, liveComment.id, ev.target.value))} />}
        {!this.props.readonly && !liveComment && <ClaimInputGroup store={{}} name="body" onChange={(ev) => this.props.dispatch(setComment(this.props.claim.id, null, ev.target.value))} />}

        { this.props.agent && !this.props.readonly &&
          <fieldset>
            <legend>File</legend>
            <div className="form-group">
              <pre className="form-control-static">{this.props.store.submission}</pre>
            </div>
          </fieldset>
        }
        {this.props.store.original_id && <ClaimStaticOptional {...this.props} name="original_id" label="Original Claim" value={<a href={this.props.claimHref(this.props.store.original_id)}>{this.props.store.original_id}</a>}/>}
    {!this.props.readonly && <ClaimErrors store={this.props.store} type="warnings" name="Warnings" text={warningText}/>}
    {!this.props.readonly && <ClaimErrors store={this.props.store} type="errors" name="Errors"/>}
      </div>

    );
    <div>

      </div>
  },
});
