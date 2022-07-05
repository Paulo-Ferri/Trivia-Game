import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Header from '../components/Header';
import '../css/Ranking.css';

export class Ranking extends Component {
  componentDidMount() {
    this.getLocalStorage();
  }

  getLocalStorage = () => {
    const users = JSON.parse(localStorage.getItem('ranking'));
    console.log(users)
    return (users !== null ? users
      .sort((userA, userB) => userB.score - userA.score)
      .map(({ name, score, picture }, index) => (
        <section className="card-user" key={ index }>
          <img src={ picture } alt="profile avatar" />
          <p>{name ? name: 'Anonymous'}</p>
          <p>{`Score: ${score}`}</p>
        </section>
      )) : <h3 className="no-Ranking">No players have played so far.</h3>);
  }

  render() {
    const { history } = this.props;
    return (
      <>
        <Header />
        <div className="ranking_component">
          <h1 className="title">Ranking</h1>
          <button
              type="button"
              className="btn-play-ranking"
              onClick={ () => history.push('/') }
            >
              Play Again
            </button>
          <main className="main_ranking_container">
            {this.getLocalStorage()}
          </main>
        </div>
      </>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Ranking;
