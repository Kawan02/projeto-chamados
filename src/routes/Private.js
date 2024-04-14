import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import Load from "../components/Load";

export default function Private({ children }) {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return <Load />;
  }
  if (!signed) {
    return <Navigate to="/" />;
  }
  return children;
}
