const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzNstXHfJIuo4ibbk8Clgn8YzDbubMaqO1CUT_Bw8ag56k5CGu1qZ8iOlXMIsU8sE-JUQ/exec";

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // OPEN INVITATION
  // =========================

  const openBtn = document.getElementById("openBtn");
  const invitation = document.getElementById("invitation");

  if (openBtn && invitation) {
    openBtn.addEventListener("click", () => {
      invitation.classList.remove("hidden");

      setTimeout(() => {
        invitation.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    });
  }


  // =========================
  // COUNTDOWN
  // =========================

  // 4 October 2026, 3:00 PM Malaysia Time (UTC+8)
  const EVENT_DATE = Date.UTC(2026, 9, 4, 7, 0, 0);

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
      return;
    }

    const now = Date.now();
    const distance = EVENT_DATE - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) /
      (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) /
      1000
    );

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // =========================
  // GUEST COUNTER
  // =========================

  const minusBtn = document.getElementById("minus");
  const plusBtn = document.getElementById("plus");
  const paxInput = document.getElementById("pax");

  if (minusBtn && plusBtn && paxInput) {

    minusBtn.addEventListener("click", () => {
      let value = Number(paxInput.value);

      if (value > 1) {
        value--;
        paxInput.value = value;
      }
    });

    plusBtn.addEventListener("click", () => {
      let value = Number(paxInput.value);

      if (value < 30) {
        value++;
        paxInput.value = value;
      }
    });
  }
  // =========================
  // EMAIL REMINDER OPTION
  // =========================

  const reminderCheckbox = document.getElementById("reminder");
  const emailField = document.getElementById("emailField");
  const emailInput = document.getElementById("email");

  if (reminderCheckbox && emailField && emailInput) {

    reminderCheckbox.addEventListener("change", () => {

      if (reminderCheckbox.checked) {

        emailField.classList.remove("hidden");
        emailInput.required = true;

      } else {

        emailField.classList.add("hidden");
        emailInput.required = false;
        emailInput.value = "";

      }

    });

  }
  // =========================
  // RSVP SUBMISSION
  // =========================

  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("success");

  if (form) {

    form.addEventListener("submit", async (event) => {

      event.preventDefault();

      const nameInput = document.getElementById("name");
      const guestsInput = document.getElementById("pax");
      const reminderCheckbox = document.getElementById("reminder");
      const emailInput = document.getElementById("email");
      const submitButton = form.querySelector(".submit-btn");

      const name = nameInput.value.trim();
      const guests = Number(guestsInput.value);

      const wantsReminder = reminderCheckbox.checked;
      const email = emailInput.value.trim();

      // Basic validation
      if (!name || guests < 1) {
        alert("Please enter your name and number of guests.");
        return;
      }

      // Email is required if reminder is selected
      if (wantsReminder && !email) {
        alert("Please enter your email address for the reminder.");
        emailInput.focus();
        return;
      }

      // Check email format
      if (
        wantsReminder &&
        email &&
        !emailInput.checkValidity()
      ) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return;
      }

      submitButton.disabled = true;
      submitButton.innerHTML = "SUBMITTING...";

      try {

        /*
         * Submit to Google Apps Script using
         * a hidden iframe to avoid CORS problems.
         */

        const iframe = document.createElement("iframe");

        iframe.name = "rsvpSubmitFrame";
        iframe.style.display = "none";

        document.body.appendChild(iframe);

        const submitForm = document.createElement("form");

        submitForm.method = "POST";
        submitForm.action = GOOGLE_SCRIPT_URL;
        submitForm.target = "rsvpSubmitFrame";
        submitForm.style.display = "none";

        // Name
        const nameField = document.createElement("input");
        nameField.type = "hidden";
        nameField.name = "name";
        nameField.value = name;

        // Number of guests
        const paxField = document.createElement("input");
        paxField.type = "hidden";
        paxField.name = "pax";
        paxField.value = guests;

        // Email
      const emailData = document.createElement("input");
      emailData.type = "hidden";
      emailData.name = "email";
      emailData.value = email;

        // Reminder
        const reminderField = document.createElement("input");
        reminderField.type = "hidden";
        reminderField.name = "reminder";
        reminderField.value = wantsReminder ? "Yes" : "No";

        submitForm.appendChild(nameField);
        submitForm.appendChild(paxField);
        submitForm.appendChild(emailData);
        submitForm.appendChild(reminderField);

        document.body.appendChild(submitForm);

        submitForm.submit();

        /*
         * Allow Google Apps Script time to
         * process the RSVP.
         */

        setTimeout(() => {

          form.classList.add("hidden");

          if (success) {
            success.classList.remove("hidden");

            success.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }

          submitForm.remove();
          iframe.remove();

        }, 1500);

      } catch (error) {

        console.error("RSVP error:", error);

        alert(
          "Something went wrong while submitting your RSVP. Please try again."
        );

        submitButton.disabled = false;
        submitButton.innerHTML =
          'CONFIRM ATTENDANCE <span>♡</span>';
      }

    });
  }

  // =========================
  // FALLING PETALS
  // =========================

  const petalsContainer = document.getElementById("petals");

  if (petalsContainer) {

    const symbols = ["♡", "✿", "❀"];

    for (let i = 0; i < 18; i++) {

      const petal = document.createElement("span");

      petal.className = "petal";
      petal.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      petal.style.left = Math.random() * 100 + "%";
      petal.style.animationDelay =
        Math.random() * 8 + "s";
      petal.style.animationDuration =
        6 + Math.random() * 6 + "s";

      petalsContainer.appendChild(petal);
    }
  }

});
