const _ = require('underscore');
const ClaimItem = require('./ClaimItem');
const ClaimItemSummary = require('./ClaimItemSummary');
const dollars = require('../data/dollars');
const { claimTotal, itemTotal } = require('../data/claimTotal');
const normalizeDate = require('../data/normalizeDate');
const { newItem, itemChangeHandler } = require('../actions');

var ClaimItemCollapse = React.createClass({
  expand: function() {
    this.props.expand(this.props.index);
  },

  collapse: function() {
    this.props.expand(-1);
  },

  render: function() {
    if (!this.props.expanded || this.props.readonly) {
      return (
        <ClaimItemSummary {...this.props} onClick={this.expand} />
      );
    } else {
      return (
        <ClaimItem {...this.props} done={this.collapse} />
      );
    }
  }
});

var NewItemButton = React.createClass({
  click: function(ev) {
    ev.preventDefault();
    var template = {
      day: normalizeDate(''),
    };
    if (this.props.index !== undefined) {
      var item = this.props.claim.items[this.props.index];
      template.day = item.day;
      template.time_in = item.time_in;
      template.time_out = item.time_out;
    }
    this.props.dispatch(newItem(this.props.claim.id, template));
    this.props.expand((this.props.index === undefined ? -1 : this.props.index) + 1);
  },

  render: function() {
    return (
      <div className="form-group row" key="new-code-button">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          <button type="button" className="btn btn-block btn-success" onClick={this.click}>
            <i className="fa fa-plus"/> Add a new code
          </button>
        </div>
      </div>
    );
  }
});

module.exports = React.createClass({
  getInitialState: function() {
    return {
      expanded: -1
    };
  },

  expand: function(item) {
    this.setState({expanded: item});
  },

  render: function() {
    var items = this.props.claim.items;
    var lastIndex;
    if (items.length) {
      var days = _.uniq(items.map((item) => item.day)).sort();
      return React.createElement("div",
                                 {},
                                 days.map(function(day) {
        return (
          <div key={'item-day-'+day}>
            <div className="col-xs-12 day-header" key={"day-header-"+day}>
              <span>{day}</span>
              <span className="pull-right">{
                dollars(items.reduce(function(memo, item) {
                  return item.day === day ? memo + itemTotal(item) : memo;
                }, 0))
              }</span>
            </div>
            <div key={"day-body-"+day}>
             {items.map(function(item, i) {
               if (item.day === day) {
                 lastIndex = i;
                 return React.createElement(ClaimItemCollapse, {
                   claim: this.props.claim,
                   store: this.props.claim.items[i],
                   item: this.props.claim.items[i],
                   index: i,
                   key: item.id,
                   full: this.props.full || this.props.agent,
                   silent: this.props.silent,
                   expanded: this.state.expanded === i,
                   expand: this.expand,
                   readonly: this.props.readonly,
                   dispatch: this.props.dispatch,
                   onChange: itemChangeHandler.bind(null, this.props.dispatch, this.props.claim.id, item.id),
                 });
               } else {
                 return null;
               }
              }, this)
            }
            </div>
            {this.props.readonly ? null : <NewItemButton key={"day-button-"+day} index={lastIndex} actions={this.props.actions} expand={this.expand} claim={this.props.claim} dispatch={this.props.dispatch} />}
          </div>
        )
      }, this));
    } else if (!this.props.readonly) {
      return <NewItemButton actions={this.props.actions} expand={this.expand} claim={this.props.claim} dispatch={this.props.dispatch} />;
    } else {
      return null;
    }
  }
});

