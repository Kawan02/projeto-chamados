import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./dashboard.css";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { database } from "../../services/firebaseConnection";

const listRef = collection(database, "chamados");

export default function DashBoard() {
  const { logout } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [load, setLoad] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy("created", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      await updateState(querySnapshot);

      setLoad(false);
    }
    loadChamados();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      setChamados((chamados) => [...chamados, ...lista]);
      return;
    }
    setIsEmpty(true);
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title nome="Chamados">
          <FiMessageSquare size={25} />
        </Title>
        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#fff" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#fff" size={25} />
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Cliente">Mercado esquina</td>
                    <td data-label="Assunto">Suporte</td>
                    <td data-label="Status">
                      <span className="badge" style={{ backgroundColor: "#999" }}>
                        Em Aberto
                      </span>
                    </td>
                    <td data-label="Cadastrado">12/05/2022</td>
                    <td data-label="#">
                      <button className="action" style={{ backgroundColor: "#3583f3" }}>
                        <FiSearch color="#fff" size={17} />
                      </button>
                      <button className="action" style={{ backgroundColor: "#f6a935" }}>
                        <FiEdit2 color="#fff" size={17} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </>
      </div>
    </div>
  );
}
