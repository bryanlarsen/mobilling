import _ from 'underscore';
import s from 'underscore.string';

export default React.createClass({
  render: function() {
    var data = {...(this.props.store[this.props.type] || {})};
    for (let i=0; i<this.props.store.items.length; i++) {
      const item = this.props.store.items[i];
      _.each(item[this.props.type] || [], (value, name) => {
        data[`item ${i} ${name}`] = value;
      });

      for (let j=0; j<item.rows.length; j++) {
        const row = item.rows[j];
        _.each(row[this.props.type] || [], (value, name) => {
          data[`item ${i} code ${j} ${name}`] = value;
        });
      }
    }
    if (_.size(data) === 0) return false;
    return (
      <fieldset>
        <legend>{this.props.name}</legend>
        <span>{this.props.text}</span>

      {_.map(data, (errors, name) => {
        console.log(errors, name);
            return <div className="form-group" key={'err-'+this.props.name+'-'+name}>
              <label className="control-label col-md-4">{s.humanize(name)}</label>
          <div className="col-md-8">
          { _.map(errors, function(err, i) {
            return (
              <p key={'err-'+this.props.name+'-'+name+'-'+i}
                 className="form-control-static">
                {err}
              </p>
            );
          }, this)}
          </div>
        </div>
        })}
      </fieldset>
    );
  }
});

