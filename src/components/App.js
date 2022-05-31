import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Main from './Main';
import Footer from './Footer';
import PageForm from './PageForm';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import UserDetails from './UserDetails';
import { register, authenticate, validateToken } from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isAuthOkPopupOpen, setIsAuthOkPopupOpen] = React.useState(false);
  const [isAuthErrPopupOpen, setIsAuthErrPopupOpen] = React.useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [addPlacebuttonText, setAddPlaceButtonText] = React.useState('Create');
  const [editProfileButtonText, setEditProfileButtonText] = React.useState('Save');
  const [editAvatarButtonText, setEditAvatarButtonText] = React.useState('Save');
  const [deleteConfirmButtonText, setDeleteConfirmButtonText] = React.useState('Yes');
  const [signupButtonText, setSignupButtonText] = React.useState('Sign up');
  const [loginButtonText, setLoginButtonText] = React.useState('Log in');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMobileSized, setIsMobileSized] = React.useState(window.innerWidth <= 650);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const navigate = useNavigate();

  const handleResize = () => setWindowWidth(window.innerWidth);

  const handleCardClick = (card) => setSelectedCard(card);

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);

  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);

  const handleAddNewCardClick = () => setIsAddPlacePopupOpen(true);

  const handlePopupClick = (event) => event.target.classList.contains('popup_active') && closeAllPopups();

  const handleUpdateAvatar = (url) => {
    setEditAvatarButtonText('Updating...');
    api
      .updateUserImage(url)
      .then((user) => {
        setCurrentUser({ ...currentUser, ...user });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setEditAvatarButtonText('Save'));
  };

  const handleUpdateUser = ({ name, about }) => {
    setEditProfileButtonText('Updating...');
    api
      .updateUserInfo({ name, about })
      .then((user) => {
        setCurrentUser({ ...currentUser, ...user });
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setEditProfileButtonText('Save'));
  };

  const handleAddPlaceSubmit = ({ name, link }) => {
    setAddPlaceButtonText('Saving...');
    api
      .submitNewCard({ name, link })
      .then((card) => {
        setCards([card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setAddPlaceButtonText('Create'));
  };

  const handleCardLike = (card, isLiked) => {
    api
      .handleLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((currentCard) => (currentCard._id === card._id ? newCard : currentCard)));
      })
      .catch((err) => console.log(err));
  };

  const handleCardDeleteClick = (card) => {
    setCardToDelete(card);
    setIsConfirmPopupOpen(true);
  };

  const handleConfirmDeleteClick = () => {
    setDeleteConfirmButtonText('Deleting...');
    const { _id: id } = cardToDelete;
    api
      .deleteCard(id)
      .then(() => {
        const filteredCards = cards.filter((card) => card._id !== id);
        setCards(filteredCards);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setDeleteConfirmButtonText('Yes'));
  };

  const handleNewUserSubmit = ({ email, password }) => {
    setSignupButtonText('Signing you up!');
    register({ email, password })
      .then((user) => {
        // receives user.data._id user.data.email
        // optionally log user in here
        setIsAuthOkPopupOpen(true);
        navigate('/signin');
      })
      .catch((err) => {
        setIsAuthErrPopupOpen(true);
      })
      .finally(() => {
        setSignupButtonText('Sign up');
      });
  };

  const handleLogin = ({ email, password }) => {
    setLoginButtonText('Logging you in!');
    authenticate({ email, password })
      .then((user) => {
        // receives user.token
        localStorage.setItem('jwt', user.token);
        setIsLoggedIn(true);
        setCurrentUser({ ...currentUser, email });
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        setIsAuthErrPopupOpen(true);
      })
      .finally(() => {
        setLoginButtonText('Log in');
      });
  };

  const handleLogout = () => {
    // setCurrentUser({});
    setIsLoggedIn(false);
    setIsUserDetailsOpen(false);
    localStorage.removeItem('jwt');
  };

  const handleHamburgerClick = () => {
    setIsUserDetailsOpen(!isUserDetailsOpen);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
    setIsAuthOkPopupOpen(false);
    setIsAuthErrPopupOpen(false);
  };

  useEffect(() => {
    const getUserInfoFromAPI = () => {
      return api.init();
    };
    const getUserInfoFromToken = () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) return validateToken(jwt);
    };

    Promise.allSettled([getUserInfoFromAPI(), getUserInfoFromToken()])
      .then((values) => {
        const [cards, userFromAPI] = values[0].value; // handle API info
        const userFromToken = values[1].value ? values[1].value.data : null; // handle localstorage data
        setCards(cards);
        setCurrentUser({ ...userFromToken, ...userFromAPI });
        if (userFromToken) {
          setIsLoggedIn(true);
          navigate('/');
        }
      })
      .catch((err) => console.log(err));

    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', closeByEscape);
    return () => {
      document.removeEventListener('keydown', closeByEscape);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setIsMobileSized(windowWidth <= 650);
  }, [windowWidth]);

  const registerPageProps = {
    linkTextInfo: 'Already a member? Log in here!',
    redirectLink: '/signin',
    name: 'register',
    buttonText: signupButtonText,
    title: 'Sign up',
    onSubmit: handleNewUserSubmit,
    isLoggedIn,
  };

  const loginPageProps = {
    linkTextInfo: 'Not a member? Sign up here!',
    redirectLink: '/signup',
    name: 'login',
    buttonText: loginButtonText,
    title: 'Log in',
    onSubmit: handleLogin,
    isLoggedIn,
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <InfoTooltip
          title="Success! You have now been registered."
          isOpen={isAuthOkPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={true}
          onPopupClick={handlePopupClick}
        />
        <InfoTooltip
          title="Oops, something went wrong! Please try again."
          isOpen={isAuthErrPopupOpen}
          onClose={closeAllPopups}
          isSuccessful={false}
          onPopupClick={handlePopupClick}
        />
        <EditProfilePopup
          onPopupClick={handlePopupClick}
          buttonText={editProfileButtonText}
          onUpdateUser={handleUpdateUser}
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          onPopupClick={handlePopupClick}
          buttonText={addPlacebuttonText}
          onAddPlaceSubmit={handleAddPlaceSubmit}
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
        />
        <EditAvatarPopup
          onPopupClick={handlePopupClick}
          buttonText={editAvatarButtonText}
          onUpdateAvatar={handleUpdateAvatar}
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
        />
        <DeleteConfirmPopup
          handlePopupClick={handlePopupClick}
          handleDeleteConfirm={handleConfirmDeleteClick}
          isOpen={isConfirmPopupOpen}
          handleCloseClick={closeAllPopups}
          buttonText={deleteConfirmButtonText}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} onPopupClick={handlePopupClick} />
        {isUserDetailsOpen && isMobileSized && <UserDetails handleLogout={handleLogout} />}
        <Header
          isMobileSized={isMobileSized}
          isDropDownOpen={isUserDetailsOpen}
          handleHamburgerClick={handleHamburgerClick}
          handleLogout={handleLogout}
          isLoggedIn={isLoggedIn}
        />
        <Routes>
          <Route path="/signin" element={<PageForm {...loginPageProps} />} />
          <Route path="/signup" element={<PageForm {...registerPageProps} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectPath="/signin" isLoggedIn={isLoggedIn}>
                <Main
                  onEditProfileClick={handleEditProfileClick}
                  onAddPlaceClick={handleAddNewCardClick}
                  onEditAvatarClick={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDeleteClick}
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
