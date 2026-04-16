/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker
// Ce fichier DOIT être à la racine de /public/ pour que FCM fonctionne

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAMSpMMw3ibEZdVJUvNvbkAn52G0YsK4_M',
  authDomain: 'denischurch-a73f9.firebaseapp.com',
  projectId: 'denischurch-a73f9',
  storageBucket: 'denischurch-a73f9.firebasestorage.app',
  messagingSenderId: '200748395645',
  appId: '1:200748395645:web:dad7700d08b05fb9535514',
});

const messaging = firebase.messaging();

// Handle background notifications (when app is not in focus)
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Background message:', payload);

  const title = payload.notification?.title || 'CIFM4';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'cifm4-notification',
    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      return clients.openWindow('/');
    })
  );
});
