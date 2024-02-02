import logo from "./logo.png";
import "./index.css";

const root = document.getElementById("app");

const h1 = document.createElement("h1");
h1.textContent = "Hello there!";

const img = document.createElement("img");
img.src = logo;

root.appendChild(h1);
root.appendChild(img);
