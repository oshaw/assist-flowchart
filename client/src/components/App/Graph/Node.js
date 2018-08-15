import React from 'react';

export default class Node extends React.Component {
  render() {
    return (
      <p>{this.props.name}</p>
    );
  }
}