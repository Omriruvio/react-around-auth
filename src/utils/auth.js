const BASE_URL = 'https://register.nomoreparties.co';

const register = (user) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: user.password, email: user.email }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error);
      if (data.message) throw new Error(data.message);
      return data;
    });
};

const authenticate = (user) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: user.password, email: user.email }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.token) throw new Error(data.message);
      return data;
    });
};

const validateToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data) throw new Error(data.message);
      return data;
    });
};

export { authenticate, register, validateToken };
