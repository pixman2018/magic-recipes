import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
// import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
// firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

import { firebaseConfig } from '../config/firebaseConfig';
import { environment } from '../environments/environment.development';
import { connectAuthEmulator } from '@firebase/auth';
import { connectFirestoreEmulator } from '@firebase/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        ...firebaseConfig,
      })
    ),
    provideAuth(() => {
      const auth = getAuth();

      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099');
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      console.log('GO');
      return firestore;
    }),
  ],
};

console.log(environment.useEmulators);
