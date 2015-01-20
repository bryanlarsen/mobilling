var Profile = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="container">
          <div className="page-header">
            <h1>Header</h1>
          </div>
          <pre>
            {JSON.stringify(current_user, null, '  ')}
          </pre>
        </div>
      </div>
    );
  }
});
