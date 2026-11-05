rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
  
    // This rule allows anyone with your Firestore database reference to view, edit,
    // and delete all data in your Firestore database. It is useful for getting
    // started, but it is configured to expire after 30 days because it
    // leaves your app open to attackers. At that time, all client
    // requests to your Firestore database will be denied.
    //
    // Make sure to write security rules for your app before that time, or else
    // all client requests to your Firestore database will be denied until you Update
    // your rules
    
    // (request.auth != null) login needed
    
    //every one can fire API without login 
    //match /{document=**} {
    //  allow read, write: if true // request.time < timestamp.date(2026, 5, 20);
    //}
  
  
    // DEV (god mode)
    function isSignedIn() {
      return request.auth != null;
    }

    function isDev() {
      return isSignedIn()
        && (
          request.auth.token.email == "castermatt1@gmail.com" ||
          request.auth.token.email == "kaybaancentro@gmail.com"
        );
    }

    // USERS (strict)

    match /users/{userId} {
        
      function isOwner() {
        return isSignedIn() && request.auth.uid == userId;
      }
      
      allow read: if isDev() || isOwner();

      allow update: if isDev() || isOwner();
      
      allow create: if isDev() || isOwner();

      allow delete: if isDev() || isOwner();
      
    }

    // SHOPS
    match /shops/{shopId} {
      allow read: if true;

      // create
      allow create: if
        isDev()
        || (
          request.auth != null
          && request.resource.data.user_id == request.auth.uid
        );

      // update
      allow update: if
        isDev()
        || (
          request.auth != null
          && resource.data.user_id == request.auth.uid
          && request.resource.data.user_id == resource.data.user_id
        );

      // delete
      allow delete: if
        isDev()
        || (
          request.auth != null
          && resource.data.user_id == request.auth.uid
        );
    }

    // SELECT_PRODUCTS
    match /select_products/{userId} {

      function isOwner() {
        return isSignedIn() && request.auth.uid == userId;
      }

      allow read: if isDev() || isOwner();

      allow create: if isDev() || isOwner();

      allow update: if isDev() || isOwner();

      allow delete: if isDev() || isOwner();
    }

    // PRODUCTS
    match /products/{productId} {

      allow read: if true;

      allow create: if isDev()
        || (
          request.auth != null
          && request.resource.data.user_id == request.auth.uid
          && exists(
            /databases/$(database)/documents/shops/$(request.resource.data.shop_id)
          )
          && get(
            /databases/$(database)/documents/shops/$(request.resource.data.shop_id)
          ).data.user_id == request.auth.uid
        );

      allow update, delete: if isDev()
        || (
          request.auth != null
          && resource.data.user_id == request.auth.uid
        );
    }
    
    // ORDER
    match /orders/{orderId} {
      allow read: if isDev()
        || (
          isSignedIn() 
          && (
            resource.data.user_id == request.auth.uid
            || get(/databases/$(database)/documents/shops/$(resource.data.shop_id)).data.user_id == request.auth.uid
          )
        );

      allow create: if isDev()
        || (
          isSignedIn()
          && request.resource.data.user_id == request.auth.uid
        );

      allow update: if isDev()
        || (
          isSignedIn()
          && get(/databases/$(database)/documents/shops/$(resource.data.shop_id)).data.user_id == request.auth.uid
        );

      allow delete: if isDev();
    }
    
  }
}
