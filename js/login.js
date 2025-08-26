const users = [
  { email: "demo@test.de", passwort: "Demo2025" },
  { email: "b@test.de", passwort: "5678" },
  { email: "c@test.de", passwort: "1111" },
  { email: "d@test.de", passwort: "2222" },
  { email: "e@test.de", passwort: "3333" },
];

const userPasswortInput = document.getElementById("passwordInput");
const userEmailInput = document.getElementById("emailInput");
const form = document.querySelector(".login__form");

function handleLogin(e) {
  e.preventDefault();

  const email = userEmailInput.value;
  const passwort = userPasswortInput.value;

  const validLogin = users.some(
    (user) => user.email === email && user.passwort === passwort
  );
  if (validLogin) {
    window.location.href = "app.html";
  }
}
form.addEventListener("submit", handleLogin);
