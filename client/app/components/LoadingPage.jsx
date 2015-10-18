import { StandardHeader } from '../components';

export default (props) => {
  return (
    <div className="body">
      <StandardHeader {...props} />
      <div className="content-body container">
        <h1><i className="fa fa-cog fa-spin" /> Loading...</h1>
      </div>
    </div>
  );
};

