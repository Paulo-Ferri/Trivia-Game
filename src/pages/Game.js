import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fetchQuestions from '../service/fetchQuestions';
import fetchToken from '../service/fetchToken';
import Header from '../components/Header';
import { addScore } from '../redux/actions';
import md5 from 'crypto-js/md5';
import '../css/Game.css'

const oneSecond = 1000;
const errorApi = 3;

class Game extends Component {
  state = {
    questions: {},
    isButtonVisible: false,
    indexQuestion: 0,
    answers: [],
    timming: 20,
    isDisabled: false,
    idInterval: '',
  };

  async componentDidMount() {
    await this.getQuestions();
    this.mapQuestions();
    this.setState({ idInterval: setInterval(this.timeToAwsers, oneSecond) });

    this.answersRandom();
  }

  async getQuestions() {
    const { token } = this.props;
    let questions = await fetchQuestions(token);
    const { response_code: responseCode } = questions;

    if (responseCode === errorApi) {
      const newToken = await fetchToken();
      questions = await fetchQuestions(newToken);
    }
    this.setState({ questions });
  }

  checkAnswer = (correctAnswer) => {
    const answerButtons = document.querySelectorAll('.answer-buttons');
    answerButtons.forEach((button) => {
      if (button.innerText === correctAnswer) {
        button.classList.add('correct_answer');
      } else {
        button.classList.add('wrong_answers');
      }
    });
    this.setState({ isDisabled: true, isButtonVisible: true });
  };

  buttonNextQuestion = () => {
    const { indexQuestion, idInterval } = this.state;
    this.setState({
      indexQuestion: indexQuestion + 1,
      isButtonVisible: false,
      isDisabled: false,
      timming: 30,
      idInterval: setInterval(this.timeToAwsers, oneSecond),
    });
    const { history, name, score, picture } = this.props;
    const convertImage = md5(picture).toString();
    const newImage = `https://www.gravatar.com/avatar/${convertImage}`
    const QUATRO = 4;
    clearInterval(idInterval);
    if (indexQuestion === QUATRO) {
      this.saveToLocalStorage(name, score, newImage);
      history.push('/feedback');
    }
  };

  answersRandom = () => {
    const { questions } = this.state;
    const { results } = questions;
    const answers = results.map(
      ({
        correct_answer: correctAnswer,
        incorrect_answers: incorrectAnswers,
      }) => [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 1 / 2),
    );
    this.setState({ answers });
  };

  timeToAwsers = () => {
    const { timming, isDisabled, idInterval } = this.state;
    if (timming > 0 && !isDisabled) {
      return this.setState({ timming: timming - 1 });
    }
    clearInterval(idInterval);
    return this.isDisabled();
  };

  mapQuestions = () => {
    const { questions, answers, isDisabled, indexQuestion, isButtonVisible } = this.state;
    const { results } = questions;
    if (results && answers.length > 0) {
      return results.map(
        ({ category, correct_answer: correctAnswer, question, difficulty }, index) => (
          <section className="question-container" key={ index }>
            <div
              className="questions-text-container"
              dangerouslySetInnerHTML={ { __html: `<h4>${question}</h4>` } }
            />
            <section className="specifications-container">
              <p>{category}</p>
              <p>{`Difficulty: ${difficulty}`}</p>
            </section>
            <div className="answer-buttons-container">
              {answers[indexQuestion].map(
                (questionsClick, indexQuestions) => (
                  <button
                    key={ indexQuestions }
                    onClick={ (e) => {
                      this.checkAnswer(correctAnswer);
                      this.setPointsOnGlobal(e);
                    } }
                    className="answer-buttons"
                    disabled={ isDisabled }
                    type="button"
                    dangerouslySetInnerHTML={ { __html: `${questionsClick}` } }
                  />
                ),
              )}
            </div>
            {isButtonVisible && (
              <button
                type="button"
                onClick={ this.buttonNextQuestion }
                className="btn-next"
              >
                Next
              </button>
            )}
          </section>
        ),
      )[indexQuestion];
    }
  };

  isDisabled = () => {
    const { timming, idInterval } = this.state;
    if (timming === 0) {
      this.setState({ isDisabled: true, isButtonVisible: true });
      clearInterval(idInterval);
    }
  };

  saveToLocalStorage = (name, score, picture) => {
    const ranking = { name, score, picture };
    if (localStorage.getItem('ranking') === null) {
      localStorage.setItem('ranking', JSON.stringify([ranking]));
    } else {
      localStorage.setItem(
        'ranking',
        JSON.stringify([
          ...JSON.parse(localStorage.getItem('ranking')),
          ranking,
        ]),
      );
    }
  }

  setPointsOnGlobal = (event) => {
    if (event.target.className.includes('correct_answer')) {
      const { dispatch } = this.props;
      dispatch(addScore(this.sumPoints(this.getDifficult())));
    }
  };

  getDifficult = () => {
    const currentQuestion = document.getElementsByTagName('h4');
    const questionActual = currentQuestion[0].innerHTML;
    const { questions } = this.state;
    const { results } = questions;
    const find = results.find(
      ({ question }) => question === questionActual,
    );
    if (results && find) return find.difficulty;
    return 'medium';
  };

  sumPoints = (difficulty) => {
    const TRES = 3;
    let difficultyValue = 0;
    if (difficulty === 'easy') {
      difficultyValue = 1;
    } else if (difficulty === 'medium') {
      difficultyValue = 2;
    } else if (difficulty === 'hard') {
      difficultyValue = TRES;
    }
    const DEZ = 10;
    const { timming } = this.state;
    const calc = DEZ + timming * difficultyValue;
    return calc;
  };

  render() {
    const { timming } = this.state;
    return (
      <>
        <Header />
        <main className="game-container">
          <h2 className="timing">{`Remaining time: ${timming} seconds`}</h2>

          {this.mapQuestions()}
        </main>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  token: state.token,
  name: state.player.name,
  score: state.player.score,
  picture: state.player.gravatarEmail,
});

Game.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  picture: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Game);
