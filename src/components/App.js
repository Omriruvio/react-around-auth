import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Main from './Main';
import Login from './Login';
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

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isAuthOkPopupOpen, setIsAuthOkPopupOpen] = React.useState(false);
  const [isAuthErrPopupOpen, setIsAuthErrPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({ email: 'temp@email.com' });
  const [cards, setCards] = React.useState([]);
  const [addPlacebuttonText, setAddPlaceButtonText] = React.useState('Create');
  const [editProfileButtonText, setEditProfileButtonText] = React.useState('Save');
  const [editAvatarButtonText, setEditAvatarButtonText] = React.useState('Save');
  const [deleteConfirmButtonText, setDeleteConfirmButtonText] = React.useState('Yes');
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);

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
    api
      .init()
      .then(([cards, user]) => {
        setCurrentUser({ ...currentUser, ...user });
        setCards(cards);
      })
      .catch((err) => console.log(err));

    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);
    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  const registerPageProps = {
    linkTextInfo: 'Already a member? Log in here!',
    redirectLink: '/signin',
    name: 'register',
    buttonText: 'Sign up',
    title: 'Sign up' /* onSubmit, isValid, buttonClassName  */,
  };

  const loginPageProps = {
    linkTextInfo: 'Not a member? Sign up here!',
    redirectLink: '/signup',
    name: 'login',
    buttonText: 'Log in',
    title: 'Log in' /* onSubmit, isValid, buttonClassName  */,
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
          onPopupClick={handlePopupClick}
          onDeleteConfirm={handleConfirmDeleteClick}
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          buttonText={deleteConfirmButtonText}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} onPopupClick={handlePopupClick} />
        <Header isLoggedIn={isLoggedIn} />
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
