import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class LoginForm extends Component {
  state = {isError: false, errorMsg: '', username: '', password: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({isError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok) {
      console.log(data)
      this.onSubmitSuccess(data.jwt_token)
    } else {
      console.log(data)
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {isError, errorMsg} = this.state
    return (
      <div className="bg-container">
        <form className="login-form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <input
            id="username"
            className="input"
            type="text"
            placeholder="Username"
            onChange={this.onChangeUsername}
          />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            className="input"
            type="password"
            placeholder="Password"
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-btn">
            Login
          </button>
          {isError ? <p className="error-msg">*{errorMsg}</p> : ''}
        </form>
      </div>
    )
  }
}

export default LoginForm
