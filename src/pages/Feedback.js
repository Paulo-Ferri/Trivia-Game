import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from '../components/Header';
import "../css/Feedback.css";

export class Feedback extends Component {
  correctQuestions = () => {
    const { assertions } = this.props;
    if (assertions > 0) {
      if (assertions === 1) {
        return (<p>{`You got: ${assertions} questions right!`}</p>);
      }
      return (<p>{`You got: ${assertions} questions right!`}</p>);
    }
    return <p>You didn't get any questions right :(</p>;
  }

  render() {
    const { assertions, score, history } = this.props;
    const NUMBER_ASSERTIONS = 3;
    return (
      <>
        <Header />
        <main className="feedback_component">
          <section className="inform-section">
            {this.correctQuestions()}
            <p>
              {assertions < NUMBER_ASSERTIONS ? 'Could be better...' : 'Well Done!'}
            </p>
            <p>{`Your score: ${score}`}</p>
          </section>
          <div className="btn-container">
            <button
              type="button"
              className="btn-play-feedback"
              onClick={ () => history.push('/') }
            >
              Play Again
            </button>
            <button
              className="btn-ranking-feedback"
              type="button"
              onClick={ () => history.push('/ranking') }
            >
              Ranking
            </button>
          </div>
        </main>
      </>
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
