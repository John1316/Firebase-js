var config = {
    apiKey: "AIzaSyAQxs4XBWz6deWsm1kp06a3tktXOS78cEc",
    authDomain: "hovo-c.firebaseapp.com",
    databaseURL: "https://hovo-c.firebaseio.com",
    projectId: "hovo-c",
    storageBucket: "hovo-c.appspot.com",
    messagingSenderId: "803688364502",
    appId: "1:803688364502:web:f05746102e8c1bdee10c77",
    measurementId: "G-KKXKQC8HV7",
};

firebase.initializeApp(config);
var db = firebase.database();

// CREATE REWIEW

var reviewForm = document.getElementById('reviewForm');
var username   = document.getElementById('username');
var email    = document.getElementById('email');
var idNumber    = document.getElementById('idNumber');
var password    = document.getElementById('password');
var hiddenId   = document.getElementById('hiddenId');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!username.value || !email.value || !idNumber.value || !password.value) return null;

  var id = hiddenId.value || Date.now()

  db.ref("User/" + id).set({
		username: username.value,
		email: email.value,
		idNumber: idNumber.value,
		password: password.value,
  });

  username.value = '';
  email.value  = '';
  idNumber.value  = '';
  password.value  = '';
  hiddenId.value = '';
});

// READ REVEIWS

var reviews = document.getElementById('reviews');
var reviewsRef = db.ref('/User');

reviewsRef.on('child_added', (data) => {
  var tr = document.createElement('tr')
  tr.id = data.key;
  tr.innerHTML = reviewTemplate(data.val())
  reviews.appendChild(tr);
});

reviewsRef.on('child_changed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(data.val());
});

reviewsRef.on('child_removed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.parentNode.removeChild(reviewNode);
});

reviews.addEventListener('click', (e) => {
  var reviewNode = e.target.parentNode

  // UPDATE REVEIW
  if (e.target.classList.contains('edit')) {
    username.value = reviewNode.querySelector('.username').innerText;
    email.value  = reviewNode.querySelector('.email').innerText;
    idNumber.value  = reviewNode.querySelector('.idNumber').innerText;
    password.value  = reviewNode.querySelector('.password').innerText;
    hiddenId.value = reviewNode.id;
  }

  // DELETE REVEIW
  if (e.target.classList.contains('delete')) {
    if (confirm('Are you sure to delete this record ?')) {
      var id = reviewNode.id;
      db.ref('User/' + id).remove();
    }
  }
});

function reviewTemplate({username, email, password , idNumber}) {

  return `
    
    <td>1</td>
    <td class='username'>${username}</td>
    <td class='email'>${email}</td>
    <td class='idNumber'>${idNumber}</td>
    <td class='password'>${password}</td>
    <button class='edit btn btn-info mr-2 my-2' data-toggle='modal' data-target='#add'>Edit</button>
    <button class='delete btn btn-danger mr-2 my-2'>Delete</button>
  `;
};
