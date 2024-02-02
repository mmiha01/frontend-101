const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login1", (req, res) => {
  console.log(req.body);

  res.redirect("/");
});

app.post("/login2", (req, res) => {
  console.log(req.body);

  res.json({ ok: true });
});

app.get("/list/:page", (req, res) => {
  function startCase(input) {
    return input[0].toUpperCase() + input.slice(1).toLowerCase();
  }

  const randomItems = new Array(20)
    .fill(1)
    .map((_, index) =>
      startCase(`${Math.random().toString(32).split(".")[1]}${index}`),
    );

  res.json({ data: randomItems });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
