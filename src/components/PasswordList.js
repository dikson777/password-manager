// src/components/PasswordList.js
import React from 'react';

const PasswordList = ({ passwords }) => (
  <div>
    <h2>Мои пароли</h2>
    <ul>
      {passwords.map((item, idx) => (
        <li key={idx}>
          <strong>{item.site}</strong>: {item.login} / {item.password}
        </li>
      ))}
    </ul>
  </div>
);

export default PasswordList;