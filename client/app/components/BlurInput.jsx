// https://github.com/Khan/react-components/blob/master/js/blur-input.jsx

/* You know when you want to propagate input to a parent...
 * but then that parent does something with the input...
 * then changing the props of the input...
 * on every keystroke...
 * so if some input is invalid or incomplete...
 * the input gets reset or otherwise effed...
 *
 * This is the solution.
 *
 * Enough melodrama. Its an input that only sends changes
 * to its parent on blur.
 */
export default React.createClass({
/*    propTypes: {
        value: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.number
        ]).isRequired,
        onChange: React.PropTypes.func.isRequired
    }, */
    getInitialState: function() {
        return { value: this.props.value };
    },
    render: function() {
      if (this.props.type && this.props.type !== 'text') {
        return <input {...this.props} />;
      } else {
        return <input
            type="text"
            {...this.props}
            value={this.state.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur} />;
      }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({ value: nextProps.value });
    },
    handleChange: function(e) {
        this.setState({ value: e.target.value });
    },
    handleBlur: function(e) {
        this.props.onChange(e);
    }
});
