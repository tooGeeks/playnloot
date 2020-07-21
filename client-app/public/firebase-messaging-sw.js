// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// eslint-disable-next-line no-undef
firebase.initializeApp({
    'messagingSenderId': '651773897271'
});
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
    if('actions' in Notification.prototype){
      console.log("Supported ACt!")
    }
    const {title,body} = payload.data ;
    const clink = payload.fcmOptions.link || '/dashboard'
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = title;
    console.log('actions' in Notification.prototype)
    const actions = payload.fcmOptions.link ? [
      {
        action:'open-site',
        title:"Let's Loot",
      }
    ] : null
    const notificationOptions = {
      body: body,
      data:{clink:clink},
      icon: '/imgs/icon-192x192.png',
      badge:'/imgs/icon-192x192.png',
      //timestamp:'',
      actions
    };
    // eslint-disable-next-line no-restricted-globals
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

  // eslint-disable-next-line no-restricted-globals
  self.addEventListener('notificationclick',(e)=>{
    const nf = e.notification;
    nf.close();
    console.log("Clicked!",e);
    switch(e.action){
      case "open-site":
        let clnk = nf.data.clink;
        // eslint-disable-next-line no-undef
        console.log(clients)
        // eslint-disable-next-line no-undef
        clients.openWindow(clnk)
        break;
      default:
        // eslint-disable-next-line no-undef
        clients.openWindow("/dashboard")
        break;
    }
  })
