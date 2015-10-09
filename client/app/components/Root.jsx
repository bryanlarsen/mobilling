import React from 'react';
import { connect } from 'react-redux';

@connect((state) => { console.log('selector', state); return state; })
  class Root extends React.Component {
    render() {
      console.log('Root', this.props);
      return (
        <div>
          <div>Root</div>
          {this.props.children}
        </div>
      );
    }
  }

export default Root;
