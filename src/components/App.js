import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from '../utils/api';
import CurrentUserContext from '../contexts/CurrentUserContext';
import Page from './Page';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cardToDelete, setCardToDelete] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
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
        setCurrentUser(user);
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
        setCurrentUser(user);
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
  };

  useEffect(() => {
    api
      .init()
      .then(([cards, user]) => {
        setCurrentUser(user);
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

  const pageProps = {
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isEditAvatarPopupOpen,
    isConfirmPopupOpen,
    selectedCard,
    addPlacebuttonText,
    editProfileButtonText,
    editAvatarButtonText,
    deleteConfirmButtonText,
    isLoggedIn,
    handleCardClick,
    handleEditAvatarClick,
    handleEditProfileClick,
    handleAddNewCardClick,
    handlePopupClick,
    handleUpdateAvatar,
    handleUpdateUser,
    handleAddPlaceSubmit,
    handleCardLike,
    handleCardDeleteClick,
    handleConfirmDeleteClick,
    cards,
  };
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute redirectPath="/login" isLoggedIn={isLoggedIn}>
              <Page {...pageProps}></Page>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CurrentUserContext.Provider>
  );
}

export default App;
