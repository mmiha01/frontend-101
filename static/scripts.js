function setSubmitDisabledState() {
  const isDisabled = Array.from(
    document.querySelectorAll(".standard-input"),
  ).some((el) => el.value === "");

  const submitButton = document.querySelector('input[type="submit"]');

  if (isDisabled) {
    submitButton.setAttribute("disabled", "true");
  } else {
    submitButton.removeAttribute("disabled");
  }
}

document.querySelectorAll(".standard-input").forEach((el) => {
  el.addEventListener("input", () => {
    setSubmitDisabledState();
  });
});

setSubmitDisabledState();

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const response = await fetch("/login2", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: document.querySelector("#username-input").value,
      password: document.querySelector("#password-input").value,
    }),
  });

  const json = await response.json();

  console.log("Got response:", json);
});
