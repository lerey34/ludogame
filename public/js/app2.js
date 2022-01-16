document.addEventListener("DOMContentLoaded", () => {
  var dice = document.getElementById("dice");
  var badtext = document.getElementById("badtext");
  var text = document.getElementById("player");
  var roomid = document.getElementById("roomId");
  const red1 = document.getElementById("redpawn1");
  const red2 = document.getElementById("redpawn2");
  const red3 = document.getElementById("redpawn3");
  const red4 = document.getElementById("redpawn4");
  const yellow1 = document.getElementById("yellowpawn1");
  const yellow2 = document.getElementById("yellowpawn2");
  const yellow3 = document.getElementById("yellowpawn3");
  const yellow4 = document.getElementById("yellowpawn4");
  const player1 = document.getElementById("player1");
  const player2 = document.getElementById("player2");
  const diceAudio = document.getElementById("dice_audio");
  const killAudio = document.getElementById("kill_audio");
  const outAudio = document.getElementById("out_audio");
  const moveAudio = document.getElementById("move_audio");
  const winAudio = document.getElementById("win_audio");
  const winnerAudio = document.getElementById("winner_audio");
  const leave = document.getElementById("back");
  const msg = document.getElementById("msg");
  const send = document.getElementById("send");
  const chatDiv = document.querySelector(".chat-messages");

  var connections = [null, null];
  var i = 0;

  var currPos = 0;
  var step = 56.84;
  var currcolor = "";
  var NumOfPaw = "";
  var num = 0;
  var clicked = false;
  var currpawn = "";
  var allcolor = ["red", "yellow"];
  var pawnOut = { red: 0, yellow: 0 };

  var positions = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    yellowpawn1: 0,
    yellowpawn2: 0,
    yellowpawn3: 0,
    yellowpawn4: 0,
  };

  var onboard = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    yellowpawn1: 0,
    yellowpawn2: 0,
    yellowpawn3: 0,
    yellowpawn4: 0,
  };

  var stepsRed = [];
  var stepsYellow = [];

  var socket = io();

  socket.on("connect", () => {
    var room = roomId.innerText;
    socket.emit("room2", room);

    socket.on("disconnect", () => {
      //eventFire(leave, "click");
      socket.emit("leave", roomid);
    });
  });

  socket.on("message", (message) => {
    chatDiv.scrollTop = chatDiv.scrollHeight;
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="text"> ${message} </p>`;
    chatDiv.appendChild(div);
  });

  socket.on("id2", (id) => {
    connections[0] = id[0];
    connections[1] = id[1];
    player1.innerHTML = "Joueur 1 : " + connections[0];
    player2.innerHTML = "Joueur 2 : " + connections[1];
  });

  socket.on("randomNum2", (nums, yesno) => {
    if (yesno == "1") {
      diceAudio.play();
    }
    num = nums;
    if (!clicked) {
      dice.style.backgroundImage = "url(/img/" + num + ".png)";
      clicked = true;
    }
    if (num != 6 && DontHaveOtherFree()) {
      badtext.innerText = "Unfortunatlly you stuck";
      window.setTimeout(changePlayer, 1000);
      clicked = false;
    }
  });

  socket.on("step", (Color, paw) => {
    randomMove(Color, paw);
  });

  socket.on("stuck", () => {});

  function HaveHover() {
    var toKill = "";
    for (var i = 0; i < allcolor.length; i++) {
      for (var n = 1; n <= 4; n++) {
        var firstPawn = document.getElementById(allcolor[i] + "pawn" + n);
        var secondPawn = document.getElementById(currpawn);
        if (
          firstPawn.style.top == secondPawn.style.top &&
          firstPawn.style.left == secondPawn.style.left &&
          currcolor != allcolor[i] &&
          currPos + num < 43
        ) {
          toKill = allcolor[i] + "pawn" + n;
          return toKill;
        }
      }
    }
    return false;
  }

  function Stuck() {
    if (onboard[currpawn] == 0 || DontHaveOtherFree() || currPos + num > 43) {
      badtext.innerText = "Unfortunatlly you stuck";
      clicked = false;
      dice.style.backgroundImage = "url(/img/dice.gif)";
      num = 0;
      changePlayer();
    }
  }

  function changePlayer() {
    if (num != 6) {
      switch (text.innerText) {
        case "red":
          text.innerText = "yellow";
          text.style.color = "gold";
          break;
        case "yellow":
          text.innerText = text.style.color = "red";
          break;
      }
    }
    badtext.innerText = "";
    dice.style.backgroundImage = "url(/img/dice.gif)";
  }

  function DontHaveOtherFree() {
    for (var i = 1; i <= 4; i++) {
      if (
        onboard[text.innerText + "pawn" + i] == 1 ||
        positions[text.innerText + "pawn" + i] + num >= 43
      )
        return false;
    }
    return true;
  }

  function CheckForWinner() {
    if (pawnOut[currcolor] == 4) {
      if (document.cookie == "sound=1") {
        winnerAudio.play();
      }
      var player = document.getElementById("player");
      var uselesstext1 = document.getElementById("uselesstext1");
      var uselesstext2 = document.getElementById("uselesstext2");
      dice.innerText = "";
      dice.style.visibility = "hidden";
      uselesstext1.innerText = "";
      uselesstext2.innerText = "";
      player.innerText = "The Winner is the " + currcolor + " player";
      leave.style.visibility = "visible";
      switch (currcolor) {
        case "red":
          player.style.color = "red";
          socket.emit("winner", "red", connections);
          break;
        case "yellow":
          player.style.color = "gold";
          socket.emit("winner", "yellow", connections);
          break;
      }
    }
  }

  function stepDown() {
    var doc = document.getElementById(currcolor + "pawn" + NumOfPaw);
    var curr = Number(doc.style.top.replace(/[a-z]/g, ""));
    doc.style.top = curr + step + "px";
    currPos++;
  }

  function stepUp() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.top.replace(/[a-z]/g, ""));
    doc.style.top = curr - step + "px";
    currPos++;
  }

  function stepLeft() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
    doc.style.left = curr - step + "px";
    currPos++;
  }

  function stepRight() {
    var doc = document.getElementById(currpawn);
    var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
    doc.style.left = curr + step + "px";
    currPos++;
  }

  function pushSteps(value, steps, count) {
    for (i = 0; i < count; i++) steps.push(value);
  }
  //Red pawns path
  pushSteps(stepDown, stepsRed, 3);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 2);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepDown, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 2);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepLeft, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 2);
  pushSteps(stepRight, stepsRed, 4);
  pushSteps(stepUp, stepsRed, 4);
  pushSteps(stepRight, stepsRed, 1);
  pushSteps(stepDown, stepsRed, 5);

  //Yellow pawns path
  pushSteps(stepUp, stepsYellow, 3);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 2);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepUp, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 2);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepRight, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 2);
  pushSteps(stepLeft, stepsYellow, 4);
  pushSteps(stepDown, stepsYellow, 4);
  pushSteps(stepLeft, stepsYellow, 1);
  pushSteps(stepUp, stepsYellow, 5);

  function ResetPawn(victim) {
    if (document.cookie == "sound=1") {
      killAudio.play();
    }
    onboard[victim] = 0;
    positions[victim] = 0;
    var pawnToMove = document.getElementById(victim);
    switch (victim) {
      case "redpawn1":
        pawnToMove.style.top = 81.2 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "redpawn2":
        pawnToMove.style.top = 81.2 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "redpawn3":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "redpawn4":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "yellowpawn1":
        pawnToMove.style.top = 479.8 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
      case "yellowpawn2":
        pawnToMove.style.top = 479.2 + "px";
        pawnToMove.style.left = 81.2 + "px";
        break;
      case "yellowpawn3":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 81.2 + "px";
        break;
      case "yellowpawn4":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
    }
  }

  function randomNum() {
    socket.emit("randomNum2", text.innerText, connections, roomid.innerHTML);
  }

  function randomMove(Color, paw) {
    NumOfPaw = paw;
    currcolor = Color;
    currpawn = currcolor + "pawn" + NumOfPaw;
    currPos = positions[currpawn];
    if (num + currPos > 43) {
      Stuck();
    } else {
      if (clicked) {
        var position = currPos;
        if (text.innerText == currcolor) {
          if (onboard[currpawn] === 1 || num === 6) {
            if (onboard[currpawn] === 0) {
              if (document.cookie == "sound=1") {
                outAudio.play();
              }
              var doc = document.getElementById(currpawn);
              var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
              switch (Color) {
                case "red":
                  doc.style.left = 365.4 + "px";
                  doc.style.top = 81.2 + "px";
                  break;

                case "yellow":
                  doc.style.left = 251.72 + "px";
                  doc.style.top = 535.92 + "px";
                  break;
              }
              onboard[currpawn] = 1;
              var victim = HaveHover();
              if (victim != false) {
                ResetPawn(victim);
              }
            } else {
              if (document.cookie == "sound=1") {
                moveAudio.play();
              }
              switch (Color) {
                case "red":
                  for (i = currPos; i < position + num; i++) {
                    stepsRed[i]();
                  }
                  break;

                case "yellow":
                  for (i = currPos; i < position + num; i++) {
                    stepsYellow[i]();
                  }
                  break;
              }
              positions[currpawn] = currPos;
              var victim = HaveHover();
              if (victim != false) {
                ResetPawn(victim);
              }
              if (currPos == 43) {
                if (document.cookie == "sound=1") {
                  winAudio.play();
                }
                pawnOut[currcolor]++;
                onboard[currpawn] = 0;
                positions[currpawn] = 0;
                document.getElementById(currpawn).style.visibility = "hidden";
              }
              CheckForWinner();
              changePlayer();
            }
            num = 0;
            clicked = false;
            dice.style.backgroundImage = "url(/img/dice.gif)";
          } else Stuck();
        }
      }
    }
  }

  dice.addEventListener("click", randomNum);

  red1.addEventListener("click", () => {
    socket.emit("step", "red", 1, roomid.innerHTML);
  });
  red2.addEventListener("click", () => {
    socket.emit("step", "red", 2, roomid.innerHTML);
  });
  red3.addEventListener("click", () => {
    socket.emit("step", "red", 3, roomid.innerHTML);
  });
  red4.addEventListener("click", () => {
    socket.emit("step", "red", 4, roomid.innerHTML);
  });

  yellow1.addEventListener("click", () => {
    socket.emit("step", "yellow", 1, roomid.innerHTML);
  });
  yellow2.addEventListener("click", () => {
    socket.emit("step", "yellow", 2, roomid.innerHTML);
  });
  yellow3.addEventListener("click", () => {
    socket.emit("step", "yellow", 3, roomid.innerHTML);
  });
  yellow4.addEventListener("click", () => {
    socket.emit("step", "yellow", 4, roomid.innerHTML);
  });

  send.addEventListener("click", () => {
    var message = msg.value;
    socket.emit("chatMessage", message, roomid.innerHTML);
    msg.value = "";
    msg.focus();
  });
});
