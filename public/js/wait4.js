document.addEventListener("DOMContentLoaded", () => {
  const roomId = document.getElementById("idRoom");
  const leave = document.getElementById("back");
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  const player3 = document.getElementById("player3");
  const player4 = document.getElementById("player4");

  var socket = io();

  leave.addEventListener("click", () => {
    var room = roomId.innerText;
    socket.emit("leave", room);
  });

  setTimeout(function () {
    window.location.reload(1);
  }, 5000);
});
