var firebase = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://mymap-1560372306869.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("server");

var usersRef = ref.child("users");
// usersRef.set({
//   {
//     username: "denis",
//     chat_id: "id1"
//   },
//   {
//     username: "nastia",
//     chat_id: "id2"
//   }
// });
// usersRef.on("value", function(snapshot) {
//     console.log(snapshot.val());
//   }, function (errorObject) {
//     console.log("The read failed: " + errorObject.code);
//   });

module.exports = usersRef;