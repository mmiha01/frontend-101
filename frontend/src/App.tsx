import {createContext, FormEvent, useContext, useState} from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { createUseStyles } from "react-jss";
import { create } from "zustand";

const client = new QueryClient();

const useStyles = createUseStyles({
  button: {
    color: "green",
  },
  year: {
    fontStyle: "italic",
  },
});

type Store = {
  version: string;
  setVersion: (version: string) => void;
};

const useAppStore = create<Store>((set) => ({
  version: "1.0.0",
  setVersion: (version: string) => set({ version }),
}));

const AppContext = createContext<Store>({ version: "1.0.0", setVersion: () => {} });

function App() {
  const classes = useStyles();
  const [version, setVersion] = useState('1.0.0')
  const [currentView, setCurrentView] = useState<"login" | "list">("login");

  return (
    <AppContext.Provider value={{ version, setVersion }}>
      <QueryClientProvider client={client}>
        {currentView === "login" ? (
          <LoginForm onLogin={() => setCurrentView("list")} />
        ) : (
          <List page={1} />
        )}
        <br />
        <br />
        <br />
        <button
          className={classes.button}
          onClick={() =>
            setCurrentView(currentView === "list" ? "login" : "list")
          }
        >
          Toggle view
        </button>
        <span className={classes.year}>This was built in year 2024</span>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}

function sleep(time = 1000): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

function List({ page }: { page: number }) {
  // zustand
  const version1 = useAppStore(state => state.version)

  // context
  const version2 = useContext(AppContext).version


  const { data, isLoading, error } = useQuery({
    queryKey: ["list", page],
    queryFn: async () => {
      await sleep();

      const response = await fetch(`http://localhost:3000/list/${page}`);
      if (!response.ok) {
        throw Error(response.statusText);
      }

      const json = await response.json();
      return json.data as string[];
    },
  });

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

  const { mutate: onSubmit } = useMutation({
    mutationFn: async (event: FormEvent) => {
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
    },
    onSuccess: onLogin,
  });

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
