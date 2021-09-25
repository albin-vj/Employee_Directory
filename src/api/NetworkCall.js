import React from 'react';
const headers = {
  'content-type': 'application/json',
  accept: 'application/json',
  charset: 'UTF-8',
};
const NetworkCall = {
  async post(url) {
    return fetch(url, headers)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        return {error};
      });
  },
};

export default NetworkCall;
