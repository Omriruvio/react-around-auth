import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PageForm = (props) => {
  const { isLoggedIn, redirectLink, name, buttonText, title, onSubmit, linkTextInfo, /*  isValid, */ buttonClassName } = props;
  const [inputs, setInputs] = React.useState({});
  const [validation, setValidation] = React.useState({});
  const [isValid, setIsValid] = React.useState(true);
  // const currentUser = React.useContext(CurrentUserContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ email: inputs.emailInput, password: inputs.passwordInput });
    // onUpdateUser({ name: inputs['emailInput'], about: inputs['passwordInput'] });
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

  useEffect(() => {
    // should trigger when user successfully registered/logged in
    // reset the form fields
    setInputs({});
  }, [isLoggedIn]);

  // React.useEffect(() => {
  //   if (isOpen) {
  //     const isFormValid = !Object.values(validation).some((validity) => Boolean(validity));
  //     setIsValid(isFormValid);
  //   }
  // }, [validation, isValid, isOpen]);
  return (
    <div className="form-page__container">
      <h2 className="form-page__title">{title}</h2>
      <form onSubmit={handleSubmit} className={`form-page__form form_${name}`} name={name}>
        <input
          onChange={handleInput}
          value={inputs.emailInput || ''}
          id="name-input"
          type="text"
          className={`form-page__input ${validation.emailInput ? 'form__input_type_error' : ''}`}
          name="emailInput"
          required
          minLength="2"
          maxLength="40"
          placeholder="Email"
        />
        <span id="form-page__input-error" className={`form-page__input-error ${isValid ? '' : 'form__input-error_active'}`}>
          {validation.emailInput}
        </span>
        <input
          onChange={handleInput}
          value={inputs.passwordInput || ''}
          id="title-input"
          type="password"
          className={`form-page__input ${validation.passwordInput ? 'form__input_type_error' : ''}`}
          name="passwordInput"
          required
          minLength="2"
          maxLength="200"
          placeholder="Password"
        />
        <span id="title-input-error" className={`form-page__input-error ${isValid ? '' : 'form__input-error_active'}`}>
          {validation.passwordInput}
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
