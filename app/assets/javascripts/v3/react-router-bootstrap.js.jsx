var Button = ReactBootstrap.Button;
var NavItem = ReactBootstrap.NavItem;
var Navigation = ReactRouter.Navigation;
var State = ReactRouter.State;

var exports = {};

// helpers.js

exports.isLeftClick = function(event) {
  return event.button === 0;
};

exports.isModifiedEvent = function(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

exports.withoutProperties = function(object, properties) {
  var property, result;
  result = {};
  for (property in object) {
    if (object.hasOwnProperty(property) && properties.indexOf(property) == -1) {
      result[property] = object[property];
    }
  }
  return result;
};

var helpers = exports;

// ButtonLink.js

ADDITIONAL_RESERVED_PROPS = ['key', 'ref'];

var ButtonLink = React.createClass({
  mixins: [State, Navigation],

  additionalReservedProps: ADDITIONAL_RESERVED_PROPS,

  getInitialState: function() {
    return {
      href: '#'
    }
  },

  componentDidMount: function() {
    var params = this.getCleanedParams();
    var href = this.makeHref(this.props.to, params, this.props.query || null);
    this.setState({
      href: href
    });
  },

  getCleanedParams: function() {
    var reserved = Object.keys(this.refs.button.constructor.propTypes)
      .concat(ADDITIONAL_RESERVED_PROPS);

    return helpers.withoutProperties(this.props, reserved || []);
  },

  handleRouteTo: function (e) {
    if (helpers.isModifiedEvent(e) || !helpers.isLeftClick(e)) {
      return;
    }
    e.preventDefault();
    var params = this.getCleanedParams();
    return this.transitionTo(this.props.to, params, this.props.query || null);
  },

  render: function () {
    return (
      <Button
        {...this.props}
        href={this.state.href}
        onClick={this.handleRouteTo}
        ref="button">
          {this.props.children}
      </Button>
    );
  }
});

// NavItemLink.js

ADDITIONAL_RESERVED_PROPS = [
  'to',
  'active',
  'activeHref',
  'activeKey',
  'key',
  'navItem',
  'onSelect',
  'ref',
  'children'
];

var NavItemLink = React.createClass({
  mixins: [State, Navigation],

  additionalReservedProps: ADDITIONAL_RESERVED_PROPS,

  getInitialState: function() {
    return {
      params: false
    }
  },

  componentDidMount: function() {
    this.setState({
      params: this.getCleanedParams(this.props)
    });
  },

  getCleanedParams: function(props) {
    var reserved = Object.keys(this.refs.navItem.constructor.propTypes)
      .concat(this.additionalReservedProps);

    return helpers.withoutProperties(props, reserved || []);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      params: this.getCleanedParams(nextProps)
    });
  },

  handleRouteTo: function (e) {
    if (helpers.isModifiedEvent(e) || !helpers.isLeftClick(e)) {
      return;
    }
    e.preventDefault();
    return this.transitionTo(this.props.to, this.state.params, this.props.query || null);
  },

  render: function() {
   if (this.state.params !== false) {
      var href = this.makeHref(this.props.to, this.state.params, this.props.query || null);
      var active = this.isActive(this.props.to, this.state.params, this.props.query || null);
    } else {
      var href = "#";
      var active = false;
    }

    return (
      <NavItem
        {...this.props}
        href={href}
        active={active}
        onClick={this.handleRouteTo}
        ref="navItem">
          {this.props.children}
      </NavItem>
    );
  }
});
