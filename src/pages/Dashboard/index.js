import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";

export default function DashBoard() {
  const { logout } = useContext(AuthContext);

  async function handleLogout() {
    await logout();
  }

  return (
    <div>
      <Header />
      <h1>DashBoard</h1>
      <button onClick={handleLogout}>Sair da conta</button>
    </div>
  );
}
