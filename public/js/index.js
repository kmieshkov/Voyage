/* eslint-disable */

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM ELEMENTS
const sectionMap = document.querySelector('.section-map');
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (sectionMap && mapbox) {
  const canvas = document.createElement('canvas');

  // WebGL (graphics acceleration)
  const gl =
    canvas.getContext('webgl') ||
    canvas.getContext('webgl2') ||
    canvas.getContext('experimental-webgl');

  if (gl) {
    // If WebGL is enabled in browser - display map
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
  } else {
    // Otherwise - remove map to avoid errors
    sectionMap.parentElement.removeChild(sectionMap);
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
