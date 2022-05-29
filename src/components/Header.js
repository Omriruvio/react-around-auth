import logo from '../images/logo.svg';
import HeaderNav from './HeaderNav';

export default function Header(props) {
  const { isLoggedIn } = props;
  return (
    <header className="header">
      <img src={logo} alt="text logo around the us" className="header__logo" />
      <HeaderNav isLoggedIn={isLoggedIn} />
    </header>
  );
}
