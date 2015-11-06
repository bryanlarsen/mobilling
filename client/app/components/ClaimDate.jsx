const ClaimInputWrapper = require('./ClaimInputWrapper');
const ClaimInputInner = require('./ClaimInputInner');

const normalizeDate = require('../data/normalizeDate');

module.exports = React.createClass({
  onClick: function() {
    event.stopPropagation();
    var element = $(this.refs.pickerInput);
    var picker = element.pickadate({
      format: "yyyy-mm-dd",
      //container: ".app-body",
      min: this.props.min,
      max: this.props.max || new Date(),
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

  onTextChange: function(ev) {
    ev.target.value = normalizeDate(ev.target.value);
    this.props.onChange(ev);
  },

  render: function() {
    return (
      <ClaimInputWrapper type="text" {...this.props}>
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
