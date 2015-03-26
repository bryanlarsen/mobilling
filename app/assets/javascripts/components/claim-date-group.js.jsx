var normalizeDate = function(s, today) {
  var re = /^([0-9]{0,4}?)[.,:\/-]?([0-9]{0,2}?)[.,:\/-]?([0-9]{0,2})$/;
  var match = s.match(re);
  if (!today) today = new Date();
  var zf = function(s, l) { return ('00' + s).slice(-(l||2)); };
  if (!match) {
    return zf(today.getFullYear(),4)+'-'+zf(today.getMonth()+1)+'-'+zf(today.getDate());
  }
  var y = parseInt(match[1] || today.getFullYear());
  if (y < today.getFullYear()-2000) y=y+2000;
  if (y < 999) y=y+1900;
  var m = parseInt(match[2] || (today.getMonth()+1));
  var d = parseInt(match[3] || today.getDate());
  var date = new Date(y,m-1,d); // round trip to validate
  return zf(date.getFullYear(),4)+'-'+zf(date.getMonth()+1)+'-'+zf(date.getDate());
};

var ClaimDate = React.createClass({
  onClick: function() {
    event.stopPropagation();
    var element = $(this.refs.pickerInput.getDOMNode());
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

  onTextChange: function(ev) {
    ev.target.value = normalizeDate(ev.target.value);
    this.props.onChange(ev);
  },

  render: function() {
    return (
      <ClaimInputWrapper type="text" {...this.props}>
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

var ClaimDateGroup = React.createClass({
  render: function() {
    return (
      <ClaimFormGroup label={this.props.label || s.humanize(this.props.name)}>
        <ClaimDate {...this.props}/>
      </ClaimFormGroup>
    );
  }
});

