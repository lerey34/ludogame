const yesno = document.getElementById("yesno");

yesno.addEventListener("click", () => {
  if (yesno.checked) {
    document.cookie = "sound=1;";
  } else {
    document.cookie = "sound=0;";
  }
});

console.log(document.cookie);

if (document.cookie == "sound=1") {
  yesno.checked = true;
} else {
  yesno.checked = false;
}
