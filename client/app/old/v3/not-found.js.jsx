var NotFound = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <h1><i className="fa fa-exclamation-circle" /> Not Found: {window.location.pathname}</h1>
        </div>
      </div>
    );
  }
});

