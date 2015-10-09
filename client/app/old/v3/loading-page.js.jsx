var LoadingPage = React.createClass({
  render: function() {
    return (
      <div className="body">
        <StandardHeader/>
        <div className="content-body container">
          <h1><i className="fa fa-cog fa-spin" /> Loading...</h1>
        </div>
      </div>
    );
  }
});

