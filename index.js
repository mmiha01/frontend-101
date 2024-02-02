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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
