import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

const Home = props => {
  const onClickFindJobsBtn = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <div className="home-container">
      <Header />
      <div className="banner-container">
        <h1 className="banner-heading">Find The Job That Fits Your Life</h1>
        <p className="banner-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button
            type="button"
            className="find-jobs-button"
            onClick={onClickFindJobsBtn}
          >
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
