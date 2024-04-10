import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

export default function DashBoard() {
  const { logout } = useContext(AuthContext);

  async function handleLogout() {
    await logout();
  }

  return (
    <div>
      <h1>DashBoard</h1>
      <button onClick={handleLogout}>Sair da conta</button>
    </div>
  );
}
