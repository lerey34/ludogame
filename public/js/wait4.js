document.addEventListener("DOMContentLoaded", () => {
  const roomId = document.getElementById("idRoom");
  const leave = document.getElementById("back");

  var socket = io();

  leave.addEventListener("click", () => {
    var room = roomId.innerText;
    socket.emit("leave", room);
  });

  setTimeout(function () {
    window.location.reload(1);
  }, 5000);
});
