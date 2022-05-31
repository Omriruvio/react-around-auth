import PopupWithForm from './PopupWithForm';

const DeleteConfirmPopup = (props) => {
  const { isOpen, handleDeleteConfirm, handleCloseClick, handlePopupClick, buttonText } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    handleDeleteConfirm();
  };

  return (
    <div onMouseDown={handlePopupClick}>
      <PopupWithForm
        onClose={handleCloseClick}
        name="delete-confirm"
        title="Are you sure?"
        isOpen={isOpen}
        buttonText={buttonText}
        onSubmit={handleSubmit}
      ></PopupWithForm>
    </div>
  );
};

export default DeleteConfirmPopup;
