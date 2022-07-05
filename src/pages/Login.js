import PropTypes from 'prop-types';
import React, { Component } from 'react';
import '../css/Login.css';
import { connect } from 'react-redux';
import logo from '../trivia.png';
import fetchToken from '../service/fetchToken';
import { fetchApiTokenThunk, saveUser } from '../redux/actions';

class Login extends Component {
  state = {
    name: '',
    email: '',
    isDisabled: true,
  }

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, () => this.validateButton());
  }

  validateButton = () => {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      return this.setState({ isDisabled: false });
    }
    return this.setState({ isDisabled: true });
  }

  HandleClickButton = async (event) => {
    event.preventDefault();
    const { dispatch, history } = this.props;
    const { name, email } = this.state;
    const response = await fetchToken();
    await dispatch(fetchApiTokenThunk(response));
    dispatch(saveUser({ name, email }));
    history.push('/game');
  }

  render() {
    const { name, email, isDisabled } = this.state;
    const { history } = this.props;
    return (
      <div>
        <div className="login-container">
          <header>
            <img src={ logo } className="trivia-logo" alt="logo" />
          </header>
          <form className="form-login">
            <label htmlFor="name">
              <input
                type="text"
                name="name"
                id="name"
                data-testid="input-player-name"
                placeholder="Digite seu nome"
                onChange={ this.handleChange }
                value={ name }
              />
            </label>
            <label htmlFor="email">
              <input
                type="email"
                name="email"
                id="email"
                data-testid="input-gravatar-email"
                placeholder="Digite seu email"
                onChange={ this.handleChange }
                value={ email }
              />
            </label>
            <button
              type="submit"
              className="btn-play"
              data-testid="btn-play"
              disabled={ isDisabled }
              onClick={ (event) => this.HandleClickButton(event) }
            >
              Play
            </button>
            <button
              className="btn-config"
              type="button"
              data-testid="btn-settings"
              onClick={ () => history.push('/config') }
            >
              Configurações
            </button>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Login);
