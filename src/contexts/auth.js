import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState, createContext, useEffect } from "react";
import { auth, database } from "../services/firebaseConnection";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadingUser() {
      const storageUser = localStorage.getItem("@user");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadingUser();
  }, []);

  async function signIn(email, password) {
    setLoadingAuth(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        const docRef = doc(database, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          nome: docSnap.data().name,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Bem vindo(a) de volta!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Erro" + err);
        setLoadingAuth(false);
        toast.error(err);
      });
  }

  // Cadastra um usuário
  async function signUp(email, password, name) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;
        await setDoc(doc(database, "users", uid), {
          nome: name,
          avatarUrl: null,
        }).then(() => {
          let data = {
            uid: uid,
            nome: name,
            email: value.user.email,
            avatarUrl: null,
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success("Seja bem-vindo ao sistema");
          navigate("/dashboard");
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem("@user", JSON.stringify(data));
  }
  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        loadingAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
