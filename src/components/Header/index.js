import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <ul className="home-jobs-list-container">
        <Link to="/" className="link-ele">
          <li className="home-jobs-list">Home</li>
        </Link>
        <Link to="/jobs" className="link-ele">
          <li className="home-jobs-list">Jobs</li>
        </Link>
      </ul>
      <li>
        <button
          type="button"
          className="logout-button home-jobs-list"
          onClick={onClickLogoutButton}
        >
          Logout
        </button>
      </li>
    </nav>
  )
}

export default withRouter(Header)
