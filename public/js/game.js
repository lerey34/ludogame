document.addEventListener("DOMContentLoaded", () => {
  var currPos = 0;
  var step = 56.84;
  var currcolor = "";
  var NumOfPaw = "";
  var num = 0;
  var clicked = false;
  var currpawn = "";
  var allcolor = ["red", "blue"];
  var pawnOut = { red: 0, blue: 0 };
  let ready = false;
  let enemyReady = false;
  let isGameOver = false;
  let currentPlayer = "red";
  var positions = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    greenpawn1: 0,
    greenpawn2: 0,
    greenpawn3: 0,
    greenpawn4: 0,
  };
  var onboard = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    greenpawn1: 0,
    greenpawn2: 0,
    greenpawn3: 0,
    greenpawn4: 0,
  };

  const dice = document.getElementById("dice");
  const bad = document.getElementById("badtext");
  const startButton = document.getElementById("start");

  startMultiPlayer();

  function startMultiPlayer() {
    const socket = io();

    //get your player number
    socket.on("player-number", (num) => {
      if (num === -1) {
        console.log("server full");
      } else {
        playerNum = parseInt(num);
        console.log(playerNum);
        socket.emit("check-players");
      }
    });

    socket.on("player-connection", (num) => {
      console.log(`Player number ${num} has connected or disconnected`);
      playerConnectedOrDisconnected(num);
    });

    //On enemy ready
    socket.on("enemy-ready", (num) => {
      enemyReady = true;
      playerReady(num);
      if (ready) {
        startButton.style.display = "none";
        playGameMulti(socket);
      }
    });

    //check player status
    socket.on("check-players", (players) => {
      players.forEach((p, i) => {
        if (p.connected) playerConnectedOrDisconnected(i);
        if (p.ready) {
          playerReady(i);
          if (i !== playerReady) enemyReady = true;
        }
      });
    });

    socket.on("numberDice", (num) => {
      randomNum(num);
      playGameMulti(socket);
    });

    startButton.addEventListener("click", () => {
      playGameMulti(socket);
    });

    dice.addEventListener("click", () => {
      if (!clicked) {
        num = Math.floor(Math.random() * 6 + 1);
        dice.style.backgroundImage = "url(/img/" + num + ".jpg)";
        socket.emit("numberDice", num);
        clicked = true;
      }
      if (num != 6 && DontHaveOtherFree()) {
        var bad = document.getElementById("badtext");
        bad.innerText = "Unfortunatlly you stuck";
        window.setTimeout(changePlayer, 1000);
        clicked = false;
      }
    });

    function playerConnectedOrDisconnected(num) {
      let player = `.p${parseInt(num) + 1}`;
      document.querySelector(`${player} .connected`).classList.toggle("active");
      if (parseInt(num) === playerNum)
        document.querySelector(player).style.fontWeight = "bold";
    }

    function playGameMulti(socket) {
      startButton.style.display = "none";
      if (isGameOver) return;
      if (!ready) {
        socket.emit("player-ready");
        ready = true;
        playerReady(playerNum);
      }
      console.log(enemyReady);
      if (enemyReady) {
        if (playerTurn.innerText === "red") {
          playerTurn.innerHTML = playerTurn.style.color = "red";
        }
        if (currentPlayer === "green") {
          playerTurn.innerHTML = playerTurn.style.color = "green";
        }
      }
    }

    function playerReady(num) {
      let player = `.p${parseInt(num) + 1}`;
      document.querySelector(`${player} .ready`).classList.toggle("active");
    }

    function randomNum(num) {
      dice.style.backgroundImage = "url(/img/" + num + ".jpg)";
    }

    function DontHaveOtherFree() {
      var text = document.getElementById("player");
      for (var i = 1; i <= 4; i++) {
        if (
          onboard[text.innerText + "pawn" + i] == 1 ||
          positions[text.innerText + "pawn" + i] + num >= 43
        )
          return false;
      }
      return true;
    }

    function changePlayer() {
      if (num != 6) {
        var text = document.getElementById("player");
        if (text.innerText === "red") {
          text.innerText = text.style.color = "green";
        }
        if (text.innerText === "green") {
          text.innerText = text.style.color = "red";
        }
      }
      var badtext = document.getElementById("badtext");
      badtext.innerText = "";
      dice.style.backgroundImage = "url(/img/dice.gif)";
      playGameMulti(socket);
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  var currPos = 0;
  var step = 56.84;
  var currcolor = "";
  var NumOfPaw = "";
  var num = 0;
  var clicked = false;
  var currpawn = "";
  var allcolor = ["red", "blue", "green", "yellow"];
  var pawnOut = { red: 0, blue: 0, green: 0, yellow: 0 };

  let playerNum = 0;

  startMulti();

  function startMulti() {
    const socket = io();

    socket.on("player-number", (num) => {
      if (num === -1) {
        console.log("server full");
      } else {
        playerNum = parseInt(num);
        console.log(playerNum);
      }
    });

    function randomNum() {
      if (!clicked) {
        num = Math.floor(Math.random() * 6 + 1);
        var dice = document.getElementById("dice");
        dice.style.backgroundImage = "url(/img/" + num + ".jpg)";
        clicked = true;
      }
      if (num != 6 && DontHaveOtherFree()) {
        var bad = document.getElementById("badtext");
        bad.innerText = "Unfortunatlly you stuck";
        window.setTimeout(changePlayer, 1000);
        clicked = false;
      }
    }

    function HaveHover() {
      var count = 0;
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
            count++;
            toKill = allcolor[i] + "pawn" + n;
            return toKill;
          }
        }
      }
      return false;
    }
  }

  function Stuck() {
    var text = document.getElementById("player");
    if (onboard[currpawn] == 0 || currPos + num > 43) {
      if (DontHaveOtherFree() || currPos + num > 43) {
        var badtext = document.getElementById("badtext");
        badtext.innerText = "Unfortunatlly you stuck";
        clicked = false;
        var dice = document.getElementById("dice");
        dice.style.backgroundImage = "url(/img/dice.gif)";
        window.setTimeout(changePlayer, 1000);
      }
    }
  }
  function changePlayer() {
    if (num != 6) {
      var text = document.getElementById("player");
      switch (text.innerText) {
        case "red":
          text.innerText = text.style.color = "blue";
          break;
        case "blue":
          text.innerText = text.style.color = "yellow";
          break;
        case "yellow":
          text.innerText = text.style.color = "green";
          break;
        case "green":
          text.innerText = text.style.color = "red";
          break;
      }
    }
    var badtext = document.getElementById("badtext");
    badtext.innerText = "";
    var dice = document.getElementById("dice");
    dice.style.backgroundImage = "url(/img/dice.gif)";
  }
  var positions = {
    redpawn1: 0,
    redpawn2: 0,
    redpawn3: 0,
    redpawn4: 0,
    bluepawn1: 0,
    bluepawn2: 0,
    bluepawn3: 0,
    bluepawn4: 0,
    greenpawn1: 0,
    greenpawn2: 0,
    greenpawn3: 0,
    greenpawn4: 0,
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
    bluepawn1: 0,
    bluepawn2: 0,
    bluepawn3: 0,
    bluepawn4: 0,
    greenpawn1: 0,
    greenpawn2: 0,
    greenpawn3: 0,
    greenpawn4: 0,
    yellowpawn1: 0,
    yellowpawn2: 0,
    yellowpawn3: 0,
    yellowpawn4: 0,
  };
  function DontHaveOtherFree() {
    var text = document.getElementById("player");
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
      var dice = document.getElementById("dice");
      var player = document.getElementById("player");
      var uselesstext1 = document.getElementById("uselesstext1");
      var uselesstext2 = document.getElementById("uselesstext2");
      dice.innerText = "";
      dice.style.visibility = "hidden";
      uselesstext1.innerText = "";
      uselesstext2.innerText = "";
      player.innerText = "The Winner is the " + currcolor + " player";
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
  var stepsRed = [];
  var stepsYellow = [];
  var stepsBlue = [];
  var stepsGreen = [];
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

  //Blue pawns path
  pushSteps(stepLeft, stepsBlue, 3);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepLeft, stepsBlue, 2);
  pushSteps(stepUp, stepsBlue, 4, 2);
  pushSteps(stepLeft, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 2);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepUp, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 2);
  pushSteps(stepDown, stepsBlue, 4);
  pushSteps(stepRight, stepsBlue, 4);
  pushSteps(stepDown, stepsBlue, 1);
  pushSteps(stepLeft, stepsBlue, 5);

  //Green pawns path
  pushSteps(stepRight, stepsGreen, 3);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 2);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepRight, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 2);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepDown, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 2);
  pushSteps(stepUp, stepsGreen, 4);
  pushSteps(stepLeft, stepsGreen, 4);
  pushSteps(stepUp, stepsGreen, 1);
  pushSteps(stepRight, stepsGreen, 5);
  function ResetPawn(victim) {
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
        pawnToMove.style.top = 130.04 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "bluepawn1":
        pawnToMove.style.top = 479.08 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "bluepawn2":
        pawnToMove.style.top = 479.08 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "bluepawn3":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 535.92 + "px";
        break;
      case "bluepawn4":
        pawnToMove.style.top = 535.92 + "px";
        pawnToMove.style.left = 479.08 + "px";
        break;
      case "greenpawn1":
        pawnToMove.style.top = 81.02 + "px";
        pawnToMove.style.left = 138.04 + "px";
        break;
      case "greenpawn2":
        pawnToMove.style.top = 81.02 + "px";
        pawnToMove.style.left = 81.02 + "px";
        break;
      case "greenpawn3":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 81.02 + "px";
        break;
      case "greenpawn4":
        pawnToMove.style.top = 138.04 + "px";
        pawnToMove.style.left = 138.04 + "px";
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
  function randomMove(Color, paw) {
    var text = document.getElementById("player");
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
            //if pown home
            if (onboard[currpawn] === 0) {
              var doc = document.getElementById(currpawn);
              var curr = Number(doc.style.left.replace(/[a-z]/g, ""));
              //out pawn
              switch (Color) {
                case "red":
                  doc.style.left = 365.4 + "px";
                  doc.style.top = 81.2 + "px";
                  break;

                case "yellow":
                  doc.style.left = 251.72 + "px";
                  doc.style.top = 535.92 + "px";
                  break;

                case "blue":
                  doc.style.left = 535.92 + "px";
                  doc.style.top = 365.4 + "px";
                  break;

                case "green":
                  doc.style.left = 81.2 + "px";
                  doc.style.top = 251.72 + "px";
                  break;
              }
              onboard[currpawn] = 1; //pawn out
            } else {
              console.log(currPos);
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

                case "blue":
                  for (i = currPos; i < position + num; i++) {
                    stepsBlue[i]();
                  }
                  break;

                case "green":
                  for (i = currPos; i < position + num; i++) {
                    stepsGreen[i]();
                  }
                  break;
              }
              positions[currpawn] = currPos;
              var victim = HaveHover();
              if (victim != false) {
                ResetPawn(victim);
              }
              if (currPos == 43) {
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
            var dice = document.getElementById("dice");
            dice.style.backgroundImage = "url(/img/dice.gif)";
          } else Stuck();
        }
      }
    }
  }
});
