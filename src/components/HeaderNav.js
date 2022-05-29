import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import hamburgerIcon from '../images/hamburger.svg';
import CurrentUserContext from '../contexts/CurrentUserContext';

const HeaderNav = (props) => {
  const { isLoggedIn } = props;
  const currentPath = useLocation().pathname;
  const linkTo = currentPath === '/signin' ? '/signup' : '/signin';
  const linkText = linkTo === '/signin' ? 'Log in' : 'Sign up';
  const currentUser = React.useContext(CurrentUserContext);

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [isMobileSized, setIsMobileSized] = React.useState(checkIfMobileSized(window.innerWidth));

  const handleResize = () => setWindowWidth(window.innerWidth);

  function checkIfMobileSized(size) {
    return size <= 650;
  }

  useEffect(() => {
    setIsMobileSized(checkIfMobileSized(windowWidth));
  }, [windowWidth]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobileSized && isLoggedIn ? (
    <Link to={linkTo}>
      <img className="header__nav-link" src={hamburgerIcon}></img>
    </Link>
  ) : isLoggedIn ? (
    <div className="header__nav-wrapper">
      <span className="header__user-email">{currentUser.email}</span>
      <div className="header__nav-link">
        <Link to={linkTo} style={{ color: 'inherit', textDecoration: 'inherit' }}>
          {linkText}
        </Link>
      </div>
    </div>
  ) : (
    <Link to={linkTo} style={{ color: 'inherit', textDecoration: 'inherit' }}>
      {linkText}
    </Link>
  );
};

export default HeaderNav;
