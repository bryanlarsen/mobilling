var Pickadate = React.createClass({
  onClick: function() {
    event.stopPropagation();
    var element = $(this.getDOMNode());
    var picker = element.pickadate({
      format: "yyyy-mm-dd",
      //container: ".app-body",
      //min: attributes.min === undefined ? false : attributes.min,
      //max: attributes.max === undefined ? false : attributes.max,
      max: new Date(),
      //editable: this.props.birthday,
      selectYears: this.props.birthday ? 150 : false,
      selectMonths: this.props.birthday
    }).pickadate("picker");

    picker.start();
    picker.open();

    picker.on('close', function() {
      element.blur();
      picker.stop();
      element.attr({readOnly: true});
      this.props.onChange({
        target: element[0],
      });
    }.bind(this));
  },

  render: function() {
    return (
      <input
        type="text"
        readOnly
        {...this.props}
        onClick={this.onClick}  />
    );
  }
});

