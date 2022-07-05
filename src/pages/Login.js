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
      <div className="login_page">
        <div className="login_container">
          <img src={ logo } className="trivia-logo" alt="logo" />
          <form className="form-login">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your Email"
                onChange={ this.handleChange }
                value={ name }
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your password"
                onChange={ this.handleChange }
                value={ email }
              />
            <button
              type="submit"
              className="btn-play"
              disabled={ isDisabled }
              onClick={ (event) => this.HandleClickButton(event) }
            >
              Play
            </button>
            <button
              className="btn-config"
              type="button"
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
