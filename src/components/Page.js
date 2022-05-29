import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import DeleteConfirmPopup from './DeleteConfirmPopup';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

const Page = (props) => {
  return (
    <div className="page">
      <EditProfilePopup
        onPopupClick={props.handlePopupClick}
        buttonText={props.editProfileButtonText}
        onUpdateUser={props.handleUpdateUser}
        isOpen={props.isEditProfilePopupOpen}
        onClose={props.closeAllPopups}
      />
      <AddPlacePopup
        onPopupClick={props.handlePopupClick}
        buttonText={props.addPlacebuttonText}
        onAddPlaceSubmit={props.handleAddPlaceSubmit}
        isOpen={props.isAddPlacePopupOpen}
        onClose={props.closeAllPopups}
      />
      <EditAvatarPopup
        onPopupClick={props.handlePopupClick}
        buttonText={props.editAvatarButtonText}
        onUpdateAvatar={props.handleUpdateAvatar}
        isOpen={props.isEditAvatarPopupOpen}
        onClose={props.closeAllPopups}
      />
      <DeleteConfirmPopup
        onPopupClick={props.handlePopupClick}
        onDeleteConfirm={props.handleConfirmDeleteClick}
        isOpen={props.isConfirmPopupOpen}
        onClose={props.closeAllPopups}
        buttonText={props.deleteConfirmButtonText}
      />
      <ImagePopup card={props.selectedCard} onClose={props.closeAllPopups} onPopupClick={props.handlePopupClick} />
      <Header />
      <Main
        onEditProfileClick={props.handleEditProfileClick}
        onAddPlaceClick={props.handleAddNewCardClick}
        onEditAvatarClick={props.handleEditAvatarClick}
        onCardClick={props.handleCardClick}
        cards={props.cards}
        onCardLike={props.handleCardLike}
        onCardDelete={props.handleCardDeleteClick}
      />
      <Footer />
    </div>
  );
};

export default Page;
