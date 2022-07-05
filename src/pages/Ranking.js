import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class Ranking extends Component {
  render() {
    const { history } = this.props;
    return (
      <div>
        <h2 data-testid="ranking-title">Ranking</h2>
        <main>
          Algo
          <button
            type="button"
            data-testid="btn-go-home"
            onClick={ () => history.push('/') }
          >
            Play Again
          </button>
        </main>
      </div>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Ranking;
