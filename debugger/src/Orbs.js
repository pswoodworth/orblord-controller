import React, { Component } from 'react';

export default class Orbs extends Component {
  render() {
    return (
      <div className="orbs">
        {
          this.props.orbs.map( (row, rowId) => (
            <div key={`row-${rowId}`} className="orbs-row">
              {
                row.map( (orb, columnId) => (
                  <div
                    key={`orb-${rowId}-${columnId}`}
                    className="orbs-item"
                    style={{backgroundColor: `rgb(${orb.join(', ')})`}}
                  />
                ))
              }
            </div>
          ))
        }
      </div>
    )
  }
};
