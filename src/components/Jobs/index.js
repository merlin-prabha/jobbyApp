import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import './index.css'
import Header from '../Header'
import OverViewOfJob from '../OverViewOfJob'
import FiltersGroup from '../FiltersGroup'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const locationsList = [
  {
    locationId: 'HYDERABAD',
    label: 'Hyderabad',
  },
  {
    locationId: 'BANGALORE',
    label: 'Bangalore',
  },
  {
    locationId: 'CHENNAI',
    label: 'Chennai',
  },
  {
    locationId: 'DELHI',
    label: 'Delhi',
  },
  {
    locationId: 'MUMBAI',
    label: 'Mumbai',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    apiJobStatus: apiJobsStatusConstants.initial,
    typeOfEmployment: [],
    salaryRange: 0,
    jobsList: [],
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    profileData: [],
    selectedLocation: '',
  }

  componentDidMount() {
    this.getJobsList()
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickProfileRetryBtn = () => {
    this.getProfileData()
  }

  renderProfileFailureView = () => (
    <>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickProfileRetryBtn}
      >
        Retry
      </button>
    </>
  )

  renderProfileLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {profileImageUrl, name, shortBio} = profileData
    return (
      <div className="profile-bg-container">
        <img src={profileImageUrl} className="profile-img" alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  getProfile = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProfileLoaderView()
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  getJobsList = async () => {
    this.setState({apiJobStatus: apiJobsStatusConstants.inProgress})
    const {
      typeOfEmployment,
      salaryRange,
      searchInput,
      selectedLocation,
      apiStatus,
    } = this.state
    console.log(typeOfEmployment)
    console.log(selectedLocation)
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${typeOfEmployment.join()}&minimum_package=${salaryRange}&search=${searchInput}&location=${selectedLocation}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = fetchedData.jobs.map(each => ({
        id: each.id,
        title: each.title,
        rating: each.rating,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        jobDescription: each.job_description,
        employmentType: each.employment_type,
        companyLogoUrl: each.company_logo_url,
      }))
      this.setState({
        jobsList: updatedData,
        apiJobStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobsStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {jobsList} = this.state

    return (
      <div>
        {jobsList.length === 0 ? (
          <div className="failure-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1 className="failure-heading">No Jobs Found</h1>
            <p className="failure-para">
              We could not find any jobs. Try other filters
            </p>
          </div>
        ) : (
          <ul className="jobs-list-container">
            {jobsList.map(eachJob => (
              <OverViewOfJob key={eachJob.id} details={eachJob} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  onClickRetry = () => {
    this.getJobsList()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderResult = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobsStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiJobsStatusConstants.success:
        return this.renderSuccessView()
      case apiJobsStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsList()
    }
  }

  changeSalary = salary => {
    this.setState({salaryRange: salary}, this.getJobsList)
  }

  changeTypeOfEmployment = type => {
    this.setState(
      prevState => ({typeOfEmployment: [...prevState.typeOfEmployment, type]}),
      this.getJobsList,
    )
  }

  changeLocation = location => {
    this.setState({selectedLocation: location}, this.getJobsList)
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filters-container">
            <div className="profile-container">{this.getProfile()}</div>
            <hr />
            <FiltersGroup
              locationsList={locationsList}
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              searchInput={searchInput}
              onChangeSearchInput={this.onChangeSearchInput}
              onEnterSearchInput={this.onEnterSearchInput}
              changeSalary={this.changeSalary}
              changeEmployeeList={this.changeTypeOfEmployment}
              changeLocation={this.changeLocation}
            />
          </div>
          <div className="jobs-content-container">
            <div className="jobs-display-container">
              <div className="input-container">
                <input
                  className="search-input"
                  type="search"
                  placeholder="Search"
                  onChange={this.onChangeSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-icon-btn"
                  onClick={this.getJobsList}
                >
                  <BsSearch className="search-icon" aria-label="close" />
                </button>
              </div>
              <div className="result-container">{this.renderResult()}</div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
