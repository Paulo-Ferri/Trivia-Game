import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';

export class Feedback extends Component {
  render() {
    const { assertions, score, history } = this.props;
    const NUMBER_ASSERTIONS = 3;
    return (
      <div>
        <Header />
        <main>
          <p data-testid="feedback-total-question">{assertions}</p>
          <p data-testid="feedback-text">
            {assertions < NUMBER_ASSERTIONS ? 'Could be better...' : 'Well Done!'}
          </p>
          <p data-testid="feedback-total-score">{score}</p>
          <button
            type="button"
            data-testid="btn-play-again"
            onClick={ () => history.push('/') }
          >
            Play Again
          </button>
          <button
            type="button"
            data-testid="btn-ranking"
            onClick={ () => history.push('/ranking') }
          >
            Ranking
          </button>
        </main>
      </div>
    );
  }
}

Feedback.propTypes = {
  assertions: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  assertions: state.player.assertions,
  score: state.player.score,
});

export default connect(mapStateToProps)(Feedback);
