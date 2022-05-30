import logo from '../images/logo.svg';
import HeaderNav from './HeaderNav';
import { Link } from 'react-router-dom';

export default function Header(props) {
  const { isLoggedIn, handleLogout, handleHamburgerClick, isDropDownOpen, isMobileSized } = props;
  return (
    <header className="header">
      <Link to="/">
        <img src={logo} alt="text logo around the us" className="header__logo" />
      </Link>
      <HeaderNav
        isMobileSized={isMobileSized}
        isDropDownOpen={isDropDownOpen}
        handleHamburgerClick={handleHamburgerClick}
        handleLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
    </header>
  );
}
