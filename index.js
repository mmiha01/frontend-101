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

app.get("/foo", (_req, _res, next) => {
  console.log("Foo 1");

  return next();
});

app.get("/foo", (_req, res) => {
  console.log("Foo 2");

  res.json({ ok: true });
});

const ERRORS = {
  entityNotFound: {
    code: 414,
    httpCode: 400,
  },
};

app.get("/test", () => {
  throw Error(ERRORS.entityNotFound.code);
});

app.use((err, req, res, next) => {
  if (err) {
    const knownError = Object.values(ERRORS).find(
      (item) => item.code === Number(err.message),
    );

    if (knownError) {
      res.status(knownError.httpCode);
      return res.json({ code: knownError.code });
    }

    res.status(400);
    res.json({ ok: false });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
