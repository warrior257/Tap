setInterval(function() {
    getData();
  }, 1000);

  var container = document.getElementById('container');
  var nickform = document.getElementById('nickform');
  var nickinput = document.getElementById('username');
  var messages = document.getElementById('messages');
  var form = document.getElementById('form');
  var input = document.getElementById('submit');
  var clear = document.getElementById('clear');
  var usertext = document.getElementById('usertext');
  var scroll = true;
  var syncronous = true;
  var inChat = false;
  var ran = false;
  var username = '';
  var allmessages = '';
  var data = {
    "messages": [],
    "users": "0"
  };

  nickform.addEventListener('submit', function(e) {
    e.preventDefault();
    if (nickinput.value !== '' && nickinput.maxLength === 17) {
      username = nickinput.value;
      nickinput.value = '';
      userInto('entered');
      switchVisisbility();
      startChat();
    }
  });

  submit.addEventListener('keyup', function() {
    submitForm();
  });

  submit.addEventListener('change', function() {
    submitForm();
  });

  function submitForm() {
    var e = e || event;
    if (submit.value !== '' && e.keyCode === 13 && !e.shiftKey) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      var message = submit.value;
      submit.value = '';
      var newData = formatData(message);
      putData(newData);
      if (e.returnValue) {
        e.returnValue = false;
      } else {
        return;
      }
    } else if (e.shiftKey && e.keyCode === 13 && submit.value !== '') {
      allmessages += submit.value + '/n';
    }
  }

  messages.addEventListener('scroll', function() {
    if (messages.scrollTop === (messages.scrollHeight - messages.offsetHeight + 2)) {
      scroll = true;
    } else {
      scroll = false;
    }
  });

  function getData(sync) {
    if (sync === '' || sync === null || sync === undefined) {
      syncronous = false;
    } else {
      syncronous = sync;
    }
    var xhr = new XMLHttpRequest();
    var url = 'https://api.myjson.com/bins/1uns4';
    xhr.open('GET', url, syncronous);
    xhr.addEventListener('load', function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        populateChat();
        userNumber();
        scrollBottom();
      }
    });
    xhr.send();
  }

  function putData(info, sync) {
    if (sync === '' || sync === null || sync === undefined) {
      syncronous = false;
    } else {
      syncronous = sync;
    }

    var xhr = new XMLHttpRequest();
    var url = 'https://api.myjson.com/bins/1uns4';
    xhr.open('PUT', url, syncronous);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('load', function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = JSON.parse(xhr.responseText);
        populateChat();
      }
    });
    xhr.send(info);
  }

  function populateChat() {
    removeOld();
    for (var i in data.messages) {
      var newline = document.createElement('br');
      var paragraph = document.createElement('p');
      if (data.messages[i].user !== undefined) {
        var text = data.messages[i].message;
        paragraph.className = 'chatmessage';
        paragraph.innerText = text;
        var user = document.createElement('span');
        var usertext = document.createTextNode(data.messages[i].user + ': ');
        user.className = 'user';
        user.appendChild(usertext);
        messages.appendChild(user);
        messages.appendChild(paragraph);
      } else {
        var text = data.messages[i].message;
        paragraph.className = 'into';
        messages.appendChild(paragraph);
      }
      paragraph.innerText = text;
      messages.appendChild(newline);
    }
  }

  function formatData(message) {
    var message = {
      "message": message,
      "user": username
    };
    data.messages.push(message);
    var info = JSON.stringify(data);
    return info;
  }

  function removeOld() {
    var messages = document.getElementById('messages');
    while (messages.firstChild) {
      messages.removeChild(messages.firstChild);
    }
  }

  function clearChat() {
    data.messages = [];
    var emptyData = JSON.stringify(data);
    putData(emptyData);
  }

  function userInto(into) {
    var message = {
      "message": username + ' ' + into + ' chat.'
    };
    data.messages.push(message);
    var newData = JSON.stringify(data);
    putData(newData, false);
  }

  function switchVisisbility() {
    container.style.display = 'none';
    nickform.style.display = 'none';
    messages.style.display = 'block';
    form.style.display = 'block';
    outline.style.display = 'block';
    number.style.display = 'block';
  }

  function userNumber() {
    var usernumber = data.users;
    usertext.innerHTML = usernumber + ' user(s)';
  }

  function scrollBottom() {
    if (scroll === true) {
      messages.scrollTop = messages.scrollHeight;
    }
  }

  function startChat() {
    var usernumber = parseInt(data.users) + 1;
    data.users = usernumber;
    var newUserNumber = JSON.stringify(data);
    putData(newUserNumber);
    inChat = true;
  }

  var works = false;
  window.addEventListener('pagehide', function() {
    unload();
    works = true;
  });

  if (works === false) {
    window.addEventListener('beforeunload', unload);
  }

  function unload() {
    if (inChat === true) {
      var usernumber = JSON.parse(data.users - 1);
      data.users = usernumber;
      var newUserNumber = JSON.stringify(data);
      putData(newUserNumber, false);
      if (usernumber === 0) {
        clearChat();
      } else if (usernumber < 0 || usernumber === null || usernumber === undefined) {
        data.users = '0';
        var empty = JSON.stringify(data);
        putData(empty, false);
      } else if (ran !== true) {
        userInto('left');
        ran = true;
      }
    }
  }

