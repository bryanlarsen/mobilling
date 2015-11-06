const ClaimInputWrapper = require('./ClaimInputWrapper');
const ClaimInputInner = require('./ClaimInputInner');
const { inMinutes } = require('../data/FeeGenerator');

module.exports = React.createClass({
  toTimeArray: function(minutes) {
    return [parseInt(minutes / 60), minutes % 60];
  },

  onClick: function(event) {
    event.stopPropagation();
    var element = $(this.refs.pickerInput);
    var component = this;
    var disable;
    var tin, tout;

    if (this.props.min) {
      tin = inMinutes(this.props.min);
      tout = tin + (this.props.disableRange||0);
    }

    if (this.props.max) {
      tout = inMinutes(this.props.max);
      tin = tout - (this.props.disableRange||0);
    }

    // pickatime rounds up, we want to round down
    if (this.props.disableRange && tin && tout) {
      var din = (Math.floor(tin/15) + 1)*15;
      var dout = (Math.ceil(tout/15) - 1)*15;
      disable = [{ from: this.toTimeArray(din), to: this.toTimeArray(dout) }];
    }
    var picker = element.pickatime({
      interval: 15,
      format: "HH:i",
      disable: disable,
      formatLabel: function (time) {
        if (component.props.min) {
          tout = time.pick;
        }

        if (component.props.max) {
          tin = time.pick;
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
        <input type="text" readOnly className="hide" name={this.props.name} value={this.props.value || this.props.store[this.props.name]} onChange={this.props.onChange} ref="pickerInput"/>
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
