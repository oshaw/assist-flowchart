import Node from './Graph/Node';
import React from 'react';

export default class Graph extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <label>Required</label>
            {this.props.agreement.required.map((pair) => 
              pair.course && <Node name={pair.course.id} />
            )}
          </div>
          <div className="col-md-6">
            <label>Recommended</label>
            {this.props.agreement.recommended.map((pair) => 
              pair.course && <Node name={pair.course.id} />
            )}
          </div>
        </div>
      </div>
    );
  }
};