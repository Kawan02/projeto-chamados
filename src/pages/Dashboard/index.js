import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./dashboard.css";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { database } from "../../services/firebaseConnection";
import { format } from "date-fns";
import Load from "../../components/Load";
import Modal from "../../components/Modal";

const listRef = collection(database, "chamados");

export default function DashBoard() {
  const [chamados, setChamados] = useState([]);
  const [load, setLoad] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadChamados() {
      const q = query(listRef, orderBy("created", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);

      setLoad(false);
      console.log("TESTE");
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
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDocs = querySnapshot.docs[querySnapshot.docs.length - 1]; // Pegando o ultimo item
      setChamados((chamados) => [...chamados, ...lista]);
      setLastDocs(lastDocs);
      return;
    }
    setIsEmpty(true);
    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);

    const q = query(listRef, orderBy("created", "desc"), startAfter(lastDocs), limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
    setLoadingMore(false);
  }

  function toogleModal(item) {
    setShowModal(!showModal);
    setDetail(item);
  }

  if (load) {
    return <Load />;
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
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className="badge" style={{ backgroundColor: item.status === "Aberto" ? "#5cb85c" : "#999" }}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button className="action" style={{ backgroundColor: "#3583f3" }} onClick={() => toogleModal(item)}>
                            <FiSearch color="#fff" size={17} />
                          </button>
                          <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: "#f6a935" }}>
                            <FiEdit2 color="#fff" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* <h3></h3> */}
              <br />
              {loadingMore && <Load />}
              {!loadingMore && !isEmpty && (
                <button className="btn-more" onClick={handleMore}>
                  Buscar mais
                </button>
              )}
            </>
          )}
        </>
      </div>
      {showModal && <Modal conteudo={detail} close={() => setShowModal(!showModal)} />}
    </div>
  );
}
