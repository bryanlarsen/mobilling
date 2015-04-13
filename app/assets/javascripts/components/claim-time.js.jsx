var ClaimTime = React.createClass({
  onClick: function(event) {
    event.stopPropagation();
    var element = $(this.refs.pickerInput.getDOMNode());
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
          var minutes = parseInt((hours - parseInt(hours))*60);
          var hours = parseInt(hours);
          if (minutes) {
            return "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h" + minutes + "m</sm!all>";
          } else {
            return "HH:i <sm!all cl!ass='text-muted'>" + hours + "!h</sm!all>";
          }
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

  onTextChange: function(ev) {
    var re = /^([0-9]{0,2}?)[.:]?([0-9]{0,2})$/;
    var match = ev.target.value.match(re);
    if (!match) {
      ev.target.value = "00:00";
      this.props.onChange(ev);
    }
    var zf = function(s) { return ('00' + s).slice(-2); };
    ev.target.value = zf(match[1])+':'+zf(match[2]);
    this.props.onChange(ev);
  },

  render: function() {
    return (
      <ClaimInputWrapper {...this.props}>
        <input type="text" readOnly className="hide" name={this.props.name} value={this.props.value || this.props.store.get(this.props.name)} onChange={this.props.onChange} ref="pickerInput"/>
        <div className="input-group">
          <ClaimInputInner type="text" {...this.props} onChange={this.onTextChange}/>
          <span onClick={this.onClick} className="input-group-btn">
            <label className="btn btn-primary btn-block">
              <i className="fa fa-chevron-down" />
            </label>
          </span>
        </div>
      </ClaimInputWrapper>
    );
  }
});
