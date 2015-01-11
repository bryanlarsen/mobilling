var Pickatime = React.createClass({
  onClick: function(event) {
    event.stopPropagation();
    var element = $(this.getDOMNode());
    var component = this;
    var picker = element.pickatime({
      interval: 15,
      format: "HH:i",
      formatLabel: function (time) {
        var tin, tout;

        if (component.props.min) {
          tin = FeeGenerator.inMinutes(component.props.min);
          tout = time.pick;
        }

        if (component.props.max) {
          tin = time.pick;
          tout = FeeGenerator.inMinutes(component.props.max);
        }

        if (tin !== undefined) {
          var hours = (tout-tin) / 60;
          if (hours < 0) hours = hours+24;
          return  "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
        } else {
          return "HH:i";
        }
      },
    }).pickatime("picker");

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

