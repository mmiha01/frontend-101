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
