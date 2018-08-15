// import lodash from 'lodash';
import React from 'react';

export default class Graph extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <label>Required</label>
          </div>
          <div className="col-md-6">
            <label>Recommended</label>
          </div>
        </div>
      </div>
    );
  }
};