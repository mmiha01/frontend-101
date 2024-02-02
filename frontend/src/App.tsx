import { FormEvent, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState<"login" | "list">("login");

  return (
    <>
      {currentView === "login" ? (
        <LoginForm onLogin={() => setCurrentView("list")} />
      ) : (
        <List page={1} />
      )}
      <br />
      <br />
      <br />
      <button
        onClick={() =>
          setCurrentView(currentView === "list" ? "login" : "list")
        }
      >
        Toggle view
      </button>
    </>
  );
}

function sleep(time = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

function List({ page }: { page: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string[] | null>(null);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);

      await sleep();

      const response = await fetch(`http://localhost:3000/list/${page}`);
      if (!response.ok) {
        setError(response.statusText);
        setIsLoading(false);
        return;
      }

      const json = await response.json();

      setData(json.data);
      setIsLoading(false);
    })();
  }, [page]);

  if (isLoading) {
    return "Loading in progress...";
  }

  if (error) {
    return `Error happened: ${error}`;
  }

  return data?.map((item) => <p key={item}>{item}</p>);
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/login2", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    console.log(response);
    onLogin();
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="username-input">Username</label>
      <input
        className="standard-input"
        name="username"
        id="username-input"
        type="text"
        placeholder="Your username here..."
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="password-input">Password</label>
      <input
        className="standard-input"
        name="password"
        id="password-input"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <input type="submit" value="Log in" disabled={!username || !password} />
    </form>
  );
}

export default App;
