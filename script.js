const opening = document.getElementById("opening");
const invitation = document.getElementById("invitation");
const openBtn = document.getElementById("openBtn");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const pax = document.getElementById("pax");
const form = document.getElementById("rsvpForm");
const success = document.getElementById("success");

openBtn.addEventListener("click", () => {
  opening.classList.add("hidden");
  invitation.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

minus.addEventListener("click", () => {
  pax.value = Math.max(1, Number(pax.value) - 1);
});

plus.addEventListener("click", () => {
  pax.value = Math.min(30, Number(pax.value) + 1);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const guests = Number(pax.value);

  if (!name || guests < 1) return;

  // Temporary front-end confirmation.
  // In the next step, this will be replaced with the Google Sheets submission.
  form.classList.add("hidden");
  success.classList.remove("hidden");
  success.scrollIntoView({ behavior: "smooth", block: "center" });

  // This is where we will send:
  // { name: name, pax: guests }
  // to Google Apps Script / Google Sheets.
});

function createPetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
  petal.style.animationDuration = (5 + Math.random() * 6) + "s";
  petal.style.transform = `rotate(${Math.random() * 180}deg)`;
  document.querySelector(".petals").appendChild(petal);

  setTimeout(() => petal.remove(), 12000);
}

setInterval(createPetal, 900);
