import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import '../css/Header.css';

class Header extends Component {
  state = {
    userImage: '',
  }

  componentDidMount() {
    const convertEmailToHash = this.convertEmailToHash();
    const userImage = (`https://www.gravatar.com/avatar/${convertEmailToHash}`);
    this.setState({ userImage });
  }

  convertEmailToHash = () => {
    const { userEmail } = this.props;
    const hashEmail = md5(userEmail).toString();
    return hashEmail;
  }

  render() {
    const { userImage } = this.state;
    const { userName, score } = this.props;
    return (
      <header className="header_component">
        {userImage.length && (
          <img
            src={ userImage }
            alt="logo"
            data-testid="header-profile-picture"
          />
        )}
        <h3>
          {userName}
        </h3>
        <h3>
          Score: {score}
        </h3>
      </header>
    );
  }
}

Header.propTypes = {
  score: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  userEmail: state.player.gravatarEmail,
  userName: state.player.name,
  score: state.player.score,
});

export default connect(mapStateToProps)(Header);
