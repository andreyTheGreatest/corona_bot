var firebase = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://mymap-1560372306869.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("server");


module.exports = ref;