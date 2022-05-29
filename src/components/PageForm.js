import React from 'react';
import { Link } from 'react-router-dom';

const PageForm = (props) => {
  const { children, redirectLink, name, buttonText, title, onSubmit, linkTextInfo, /*  isValid, */ buttonClassName } = props;
  const [inputs, setInputs] = React.useState({});
  const [validation, setValidation] = React.useState({});
  const [isValid, setIsValid] = React.useState(true);
  // const currentUser = React.useContext(CurrentUserContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    // onUpdateUser({ name: inputs['profileFormNameInput'], about: inputs['profileFormTitleInput'] });
  };

  const handleInput = (event) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    });
    setValidation({
      ...validation,
      [event.target.name]: event.target.validationMessage,
    });
  };

  // React.useEffect(() => {
  //   if (isOpen) {
  //     const isFormValid = !Object.values(validation).some((validity) => Boolean(validity));
  //     setIsValid(isFormValid);
  //   }
  // }, [validation, isValid, isOpen]);
  return (
    <div className="form-page__container">
      <h2 className="form-page__title">{title}</h2>
      <form onSubmit={onSubmit} className={`form-page__form form_${name}`} name={name}>
        <input
          onChange={handleInput}
          value={inputs.profileFormNameInput || ''}
          id="name-input"
          type="text"
          className={`form-page__input ${validation.profileFormNameInput ? 'form__input_type_error' : ''}`}
          name="profileFormNameInput"
          required
          minLength="2"
          maxLength="40"
          placeholder="Email"
        />
        <span id="form-page__input-error" className={`form-page__input-error ${isValid ? '' : 'form__input-error_active'}`}>
          {validation.profileFormNameInput}
        </span>
        <input
          onChange={handleInput}
          value={inputs.profileFormTitleInput || ''}
          id="title-input"
          type="text"
          className={`form-page__input ${validation.profileFormTitleInput ? 'form__input_type_error' : ''}`}
          name="profileFormTitleInput"
          required
          minLength="2"
          maxLength="200"
          placeholder="Password"
        />
        <span id="title-input-error" className={`form-page__input-error ${isValid ? '' : 'form__input-error_active'}`}>
          {validation.profileFormTitleInput}
        </span>
        <button disabled={!isValid} type="submit" className="button form-page__submit-button">
          {buttonText}
        </button>
        <div className="form-page__text-info">
          <Link to={redirectLink} style={{ color: 'inherit', textDecoration: 'inherit' }}>
            {linkTextInfo}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default PageForm;
