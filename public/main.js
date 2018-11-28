$(function() {
  const $window = $(window);
  const $nameInput = $('.nameInput');
  const $players = $('.players');
  const $allInButton = $('.all-in-button');
  const $locations = $('.locations');
  const $roleButton = $('.role-button');

  const $loginPage = $('.login.page');
  const $roomPage = $('.room.page');
  const $gamePage = $('.game.page');

  var spyfallData;
  const noOfRoles = 7;

  var name;
  var currentRole;
  var $currentInput = $nameInput.focus();

  var socket = io();

  const setName = () => {
    name = cleanInput($nameInput.val().trim());
    if (name) {
      $loginPage.fadeOut();
      $roomPage.show();
      $loginPage.off('click');
      $currentInput = $players.focus();

      socket.emit('add user', name);
    } 
  }

  const updatePlayersList = (users) => {
    $players.empty();
    users.forEach((name) => {
      $players.append('<li><h3>' + name + '</h3></li>');
    });
  }

  const cleanInput = (input) => {
    return $('<div />').text(input).html();
  }

  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  $window.keydown(event => {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }

    if (event.which === 13) { //ENTER
      if (!name) {
        setName();
      }
    }
  });

  $allInButton.click(() => {
    socket.emit('all in');
  });

  $roleButton.click(() => {
    alert(currentRole);
  });

  jQuery.getJSON("spyfall.json", (json) => {
    spyfallData = json.locations;
    json.locations.forEach((location) => {
      $locations.append('<li>' + location.name + '</li>');
    });
  });

  socket.on('user joined', (data) => {
    updatePlayersList(data.users);
  });

  socket.on('game start', (data) => {
    $roomPage.fadeOut();
    $gamePage.show();
    $currentInput = $gamePage.focus();

    console.log(data.spy);
    if (data.spy == name) {
      currentRole = "You are the Spy";
    } else {
      currentRole = "Location: " + spyfallData[data.location].name + "\nRole: " + spyfallData[data.location].roles[generateRandomNumber(0, noOfRoles)];
    }
  });
});