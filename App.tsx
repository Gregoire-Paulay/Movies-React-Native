import Nav from "./components/Nav";
import AuthContextProvider from "./contexts/auth-context";

export default function App() {
  return (
    <AuthContextProvider>
      <Nav />
    </AuthContextProvider>
  );
}
