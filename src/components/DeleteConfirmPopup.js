import PopupWithForm from './PopupWithForm';

const DeleteConfirmPopup = (props) => {
  const { isOpen, onDeleteConfirm, onClose, onPopupClick, buttonText } = props;

  const handleSubmit = (event) => {
    event.preventDefault();
    onDeleteConfirm();
  };

  return (
    <div onMouseDown={onPopupClick}>
      <PopupWithForm
        onClose={onClose}
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
