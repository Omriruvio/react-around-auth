import PopupWithForm from './PopupWithForm';
import React from 'react';

export default function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar, buttonText, onPopupClick } = props;
  const [imageInput, setImageInput] = React.useState('');
  const [validation, setValidation] = React.useState({});
  const [isValid, setIsValid] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdateAvatar(imageInput.current.value);
  };

  const handleInput = (event) => {
    setImageInput(event.target.value);
    setValidation({
      [event.target.name]: event.target.validationMessage,
    });
    if (imageInput || imageInput === '') {
      const isFormValid = Object.values(validation).some((validity) => Boolean(validity) === false);
      // console.log(`form is ${!isFormValid ? 'not ' : ''}valid`);
      // console.log(`form value is ${imageInput}`);
      setIsValid(isFormValid);
    }
    if (!isValid) setTimeout(() => setShowError(true), 2000);
  };

  React.useEffect(() => {
    setImageInput('');
    setShowError(false);
  }, [isOpen]);

  return (
    <div onMouseDown={onPopupClick}>
      <PopupWithForm
        isValid={isValid}
        onSubmit={handleSubmit}
        name="profile-image"
        title="Change profile picture"
        isOpen={isOpen}
        onClose={onClose}
        buttonText={buttonText}
      >
        <input
          onInput={handleInput}
          value={imageInput}
          id="profile-image-input"
          type="url"
          className={`form__input ${showError && 'form__input_type_error'}`}
          placeholder="Link to new profile image"
          name="profileImageUrlInput"
          required
          minLength="1"
        />
        <span id="profile-image-input-error" className={`form__input-error ${showError && 'form__input-error_active'}`}>
          {showError && validation['profileImageUrlInput']}
        </span>
      </PopupWithForm>
    </div>
  );
}
