export default React.createClass({
  getInitialState: function() {
    return { focused: false };
  },
  componentDidMount: function() {
    var component = this;
    var $el = $(ReactDOM.findDOMNode(this));
    $el.typeahead({
      minLength: 1,
      highlight: true
    }, {
      displayKey: function(val) {return val;},
      source: component.props.engine.ttAdapter(),
      display: component.props.display,
      templates: component.props.templates
    }).on('typeahead:autocompleted', function(event, suggestion, dataset) {
      component.props.onChange(event);
    }).on('typeahead:selected', function(event, suggestion, dataset) {
      component.props.onChange(event, suggestion);
    });
  },

  componentWillUnmount: function() {
    $(ReactDOM.findDOMNode(this)).typeahead('destroy');
  },

  componentDidUpdate: function() {
    if (this.isMounted() && !this.state.focused) {
      $(ReactDOM.findDOMNode(this)).typeahead('val', this.props.value);
    }
  },

  handleFocus: function(ev) {
    this.setState({focused: true});
  },

  handleBlur: function(ev) {
    this.setState({focused: false});
    this.props.onChange(ev);
  },

  render: function() {
    return (
      <input type="search" className="form-control typeahead" name={this.props.name} defaultValue={this.props.value} onBlur={this.handleBlur} onFocus={this.handleFocus} />
    );
  }
});

