/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Academic B.Sc. Computer Science Field Project: Library Management System
 * Client-Side Firebase SDK Initialization
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
