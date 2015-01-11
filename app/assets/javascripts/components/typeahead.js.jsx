var Typeahead = React.createClass({
  componentDidMount: function() {
    var component = this;
    var $el = $(this.getDOMNode());
    $el.typeahead({
      minLength: 1,
      highlight: true
    }, {
      displayKey: function(val) {return val;},
      source: component.props.engine.ttAdapter()
    }).on('typeahead:autocompleted', function(event, suggestion, dataset) {
      component.props.onChange(event);
    }).on('typeahead:selected', function(event, suggestion, dataset) {
      component.props.onChange(event);
    });
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).typeahead('destroy');
  },

  render: function() {
    if (this.isMounted()) {
      $(this.getDOMNode()).typeahead('val', this.props.value);
    }
    return (
      <input type="search" className="form-control typeahead" name={this.props.name} defaultValue={this.props.value} onBlur={this.props.onChange}/>
    );
  }
});

