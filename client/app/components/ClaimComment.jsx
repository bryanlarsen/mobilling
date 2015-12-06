import Remarkable from 'remarkable';
import moment from 'moment';

export default React.createClass({
  render: function() {
    var md = new Remarkable();
    return (
      <div className="form-group">
        <div className="control-label col-md-4">
          <label>{moment(this.props.comment.created_at).fromNow()}</label>
          <p className="text-muted">{this.props.comment.user_name}</p>
        </div>
        <div className="col-md-8">
          <p className="form-control-static" dangerouslySetInnerHTML={{"__html": md.render(this.props.comment.body)}} />
        </div>
      </div>
    );
  }
});

