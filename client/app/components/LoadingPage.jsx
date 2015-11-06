const StandardHeader = require('./StandardHeader');

module.exports = (props) => {
  return (
    <div className="body">
      <StandardHeader {...props} />
      <div className="content-body container">
        <h1><i className="fa fa-cog fa-spin" /> Loading...</h1>
      </div>
    </div>
  );
};

