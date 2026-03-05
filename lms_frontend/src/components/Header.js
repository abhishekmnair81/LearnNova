import { Link } from "react-router-dom";
import '../Header.css';
import { useState } from "react";
import ELearnIcon from './ELearnIcon';

function Header() {
  const [searchstring, setsearchstring] = useState({ search: '' });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
  const studentLoginStatus = localStorage.getItem('studentLoginStatus');

  const handleChange = (event) => {
    setsearchstring({
      ...searchstring,
      [event.target.name]: event.target.value
    });
  };

  const searchCourse = () => {
    window.location.href = `/search/${searchstring.search}`;
  }

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  }

  return (
    <nav className="header-navbar">
      <div className="header-navbar__container">
        <ELearnIcon size={35} color="#a435f0" style={{ marginRight: '5px' }}/>
        <span>
          <Link className="header-navbar__brand" to="/">Learnova</Link>
        </span>
        <button 
          className="header-navbar__toggler" 
          type="button" 
          onClick={toggleNav}
          aria-controls="navbarNav" 
          aria-expanded={isNavOpen} 
          aria-label="Toggle navigation"
        >
          <span className="header-navbar__toggler-icon"></span>
        </button>
        <form className="header-search__form" role="search">
          <input 
            type="search" 
            onChange={handleChange} 
            name="search" 
            placeholder="Search by course title..." 
            aria-label="Search" 
            className="header-search__input" 
          />
          <button onClick={searchCourse} type="button" className="header-search__btn">Search</button>
        </form>
        <div className={`header-navbar__collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="header-navbar__nav ms-auto">
            <li>
              <Link className="header-nav__link header-nav__link--active" aria-current="page" to="/">Home</Link>
            </li>
            <li>
              <Link className="header-nav__link" to="/category">Categories</Link>
            </li>
            <li>
              <Link className="header-nav__link" to="/all-courses">Courses</Link>
            </li>

            <li className="header-nav__item header-nav__item--dropdown">
              <Link 
                className="header-nav__link header-nav__link--dropdown-toggle" 
                to="#"
                id="navbarDropdownTeacher" 
                role="button"
                aria-expanded="false"
              >
                Teacher
              </Link>
              <ul className="header-dropdown__menu" aria-labelledby="navbarDropdownTeacher">
                {teacherLoginStatus !== 'true' &&
                  <>
                    <li>
                      <Link className="header-dropdown__item" to="/teacher-login">Login</Link>
                    </li>
                    <li>
                      <Link className="header-dropdown__item" to="/teacher-register">Register</Link>
                    </li>
                  </>
                }
                {teacherLoginStatus === 'true' &&
                  <>
                    <li>
                      <Link className="header-dropdown__item" to="/teacher-dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link className="header-dropdown__item header-dropdown__item--danger" to="/teacher-logout">Logout</Link>
                    </li>
                  </>
                }
              </ul>
            </li>

            <li className="header-nav__item header-nav__item--dropdown">
              <Link 
                className="header-nav__link header-nav__link--dropdown-toggle" 
                to="#"
                id="navbarDropdownUser" 
                role="button"
                aria-expanded="false"
              >
                User
              </Link>
              <ul className="header-dropdown__menu" aria-labelledby="navbarDropdownUser">
                {studentLoginStatus !== 'true' &&
                  <>
                    <li>
                      <Link className="header-dropdown__item" to="/user-login">Login</Link>
                    </li>
                    <li>
                      <Link className="header-dropdown__item" to="/user-register">Register</Link>
                    </li>
                  </>
                }
                {studentLoginStatus === 'true' &&
                  <>
                    <li>
                      <Link className="header-dropdown__item" to="/user-dashboard">Dashboard</Link>
                    </li>
                    <li>
                      <Link className="header-dropdown__item header-dropdown__item--danger" to="/user-logout">Logout</Link>
                    </li>
                  </>
                }
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;