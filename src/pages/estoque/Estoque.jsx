import { useMemo, useState, useEffect } from "react";
import { getStock, addMovement, transferStock } from "../../services/stockService";
import HeaderEstoque from "./HeaderEstoque";
import "./estoque.css"
import {
  Boxes,
  Package,
  Wrench,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  AlertTriangle,
  X,
} from "lucide-react";


export default function Estoque() {
  const [abaAtiva, setAbaAtiva] = useState("produtos");
  const [modalMovimentacao, setModalMovimentacao] = useState(false);
  const [modalTransferencia, setModalTransferencia] = useState(false);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function fetchData() {
      try {
        const tipo = abaAtiva === "produtos" ? "PRODUCT" : "INSUMO";

        const { data } = await getStock(tipo);

        const formatado = data.map((item) => ({
          id: item.item_id,
          nome: item.name,
          sku: item.sku || "-",
          estoque: item.quantity,
          minimo: item.min_stock || 0,
          loja: item.store_name || "Minha loja",
          tipo: item.item_type === "PRODUCT" ? "produto" : "insumo",
        }));

        setItens(formatado);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(true);
      }
    }

    fetchData();
  }, [abaAtiva]);

  const [movimentacao, setMovimentacao] = useState({
    item_id: "",
    tipo_item: "produto",
    tipo_movimento: "entrada",
    quantidade: "",
    motivo: "",
    observacao: "",
  });

  const [transferencia, setTransferencia] = useState({
    item_id: "",
    tipo_item: "produto",
    loja_origem_id: "",
    loja_destino_id: "",
    quantidade: "",
    observacao: "",
  });

  function formatarItens(data) {
    return data.map((item) => ({
      id: item.item_id,
      nome: item.name,
      sku: item.sku || "-",
      estoque: item.quantity,
      minimo: item.min_stock || 0,
      loja: item.store_name || "Minha loja",
      tipo: item.item_type === "PRODUCT" ? "produto" : "insumo",
    }));
  }



  const itensAtivos = itens.filter(item =>
    abaAtiva === "produtos"
      ? item.tipo === "produto"
      : item.tipo === "insumo"
  );

  const totais = useMemo(() => {
    const totalItens = itensAtivos.length;
    const totalEstoque = itensAtivos.reduce((acc, item) => acc + Number(item.estoque || 0), 0);
    const abaixoMinimo = itensAtivos.filter((item) => Number(item.estoque) < Number(item.minimo)).length;

    return { totalItens, totalEstoque, abaixoMinimo };
  }, [itensAtivos]);

  const motivosEntrada = [
    { value: "compra", label: "Compra / reposição" },
    { value: "ajuste_positivo", label: "Ajuste positivo" },
    { value: "devolucao", label: "Devolução" },
    { value: "producao", label: "Entrada de produção" },
  ];

  const motivosSaida = [
    { value: "venda", label: "Venda" },
    { value: "perda", label: "Perda" },
    { value: "consumo_interno", label: "Consumo interno" },
    { value: "ajuste_negativo", label: "Ajuste negativo" },
  ];

  const motivosMovimento =
    movimentacao.tipo_movimento === "entrada" ? motivosEntrada : motivosSaida;

  function abrirMovimentacao(tipoItem) {
    setMovimentacao({
      item_id: "",
      tipo_item: tipoItem,
      tipo_movimento: "entrada",
      quantidade: "",
      motivo: "",
      observacao: "",
    });
    setModalMovimentacao(true);
  }

  function abrirTransferencia(tipoItem) {
    setTransferencia({
      item_id: "",
      tipo_item: tipoItem,
      loja_origem_id: "",
      loja_destino_id: "",
      quantidade: "",
      observacao: "",
    });
    setModalTransferencia(true);
  }

  async function handleSalvarMovimentacao(e) {
    e.preventDefault();

    try {
      await addMovement({
        item_id: movimentacao.item_id,
        item_type: movimentacao.tipo_item === "produto" ? "PRODUCT" : "INSUMO",
        quantity: Number(movimentacao.quantidade),
        type: movimentacao.tipo_movimento === "entrada" ? "IN" : "OUT",
        reason: movimentacao.motivo,
        notes: movimentacao.observacao,
      });

      setModalMovimentacao(false);

      // 🔥 atualiza estoque
      const tipo = abaAtiva === "produtos" ? "PRODUCT" : "INSUMO";
      const { data } = await getStock(tipo);
      setItens(formatarItens(data));

    } catch (err) {
      console.error(err);
    }
  }

  async function handleSalvarTransferencia(e) {
    e.preventDefault();

    try {
      await transferStock({
        to_store_id: transferencia.loja_destino_id,
        items: [
          {
            item_id: transferencia.item_id,
            quantity: Number(transferencia.quantidade),
          },
        ],
        item_type: transferencia.tipo_item === "produto" ? "PRODUCT" : "INSUMO",
        notes: transferencia.observacao,
      });

      setModalTransferencia(false);

      // 🔥 atualiza estoque
      const tipo = abaAtiva === "produtos" ? "PRODUCT" : "INSUMO";
      const { data } = await getStock(tipo);
      setItens(formatarItens(data));

    } catch (err) {
      console.error(err);
    }
  }

  const opcoesItens = itens.map((item) => ({
    id: item.id,
    nome: item.nome,
  }));


  return (
    <>
      

      <div className="products-page">
    
      <HeaderEstoque />
     

        <div className="products-tabs">
          <button
            className={abaAtiva === "produtos" ? "active products-tab" : "products-tab"}
            onClick={() => setAbaAtiva("produtos")}
          >
            <Package size={16} />
            Produtos
          </button>

          <button
            className={abaAtiva === "insumos" ? "active products-tab" : "products-tab"}
            onClick={() => setAbaAtiva("insumos")}
          >
            <Wrench size={16} />
            Insumos
          </button>
        </div>

        <div className="estoque-cards">
          <div className="estoque-card">
            <span>Total de itens</span>
            <strong>{totais.totalItens}</strong>
          </div>


          <div className="estoque-card alerta">
            <span>Abaixo do mínimo</span>
            <strong>{totais.abaixoMinimo}</strong>
          </div>
        </div>

        <div className="stocks-actions">
          <button
            className="products-subtab"
            onClick={() => abrirMovimentacao(abaAtiva === "produtos" ? "produto" : "insumo")}
          >
            <ArrowUpCircle size={18} />
            Entradas e Saídas
          </button>

          <button
            className="products-subtab"
            onClick={() => abrirTransferencia(abaAtiva === "produtos" ? "produto" : "insumo")}
          >
            <ArrowRightLeft size={18} />
            Transferência entre lojas
          </button>
        </div>

        <div className="products-content">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                {/* <th>SKU</th> */}
                <th>Loja</th>
                <th>Atual</th>
                <th>Mín.</th>
                {/* <th>Status</th> */}
              </tr>
            </thead>

            <tbody>
              {itensAtivos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "24px" }}>
                    Nenhum item encontrado.
                  </td>
                </tr>
              ) : (
                itensAtivos.map((item) => {
                  const abaixoMinimo = Number(item.estoque) < Number(item.minimo);

                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td><strong>{item.nome}</strong></td>
                      {/* <td>{item.sku}</td> */}
                      <td>{item.loja}</td>
                      <td><strong>{item.estoque}</strong></td>
                      <td>{item.minimo}</td>
                      {/* <td>
                        <span className={abaixoMinimo ? "status-badge danger" : "status-badge success"}>
                          {abaixoMinimo ? "Baixo" : "OK"}
                        </span>
                      </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalMovimentacao && (
        <div className="modal-overlay" onClick={() => setModalMovimentacao(false)}>
          <div className="modal-box glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nova movimentação</h3>
              <button className="icon-btn" onClick={() => setModalMovimentacao(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSalvarMovimentacao}>
              <div className="form-group">
                <label>Tipo de item</label>
                <select
                  value={abaAtiva === "produtos" ? "produto" : "insumo"}
                  onChange={(e) =>
                    setMovimentacao({ ...movimentacao, tipo_item: e.target.value, item_id: "" })
                  }
                >
                  <option value="produto">Produto</option>
                  <option value="insumo">Insumo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Item</label>
                <select
                  value={movimentacao.item_id}
                  onChange={(e) =>
                    setMovimentacao({ ...movimentacao, item_id: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione</option>
                  {itensAtivos.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Movimento</label>
                  <select
                    value={movimentacao.tipo_movimento}
                    onChange={(e) =>
                      setMovimentacao({
                        ...movimentacao,
                        tipo_movimento: e.target.value,
                        motivo: "",
                      })
                    }
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={movimentacao.quantidade}
                    onChange={(e) =>
                      setMovimentacao({ ...movimentacao, quantidade: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Motivo</label>
                <select
                  value={movimentacao.motivo}
                  onChange={(e) =>
                    setMovimentacao({ ...movimentacao, motivo: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione o motivo</option>
                  {motivosMovimento.map((motivo) => (
                    <option key={motivo.value} value={motivo.value}>
                      {motivo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group textarea-group">
                <label>Observação / explicação</label>
                <textarea
                  rows="4"
                  placeholder="Descreva o motivo da movimentação..."
                  value={movimentacao.observacao}
                  onChange={(e) =>
                    setMovimentacao({ ...movimentacao, observacao: e.target.value })
                  }
                />
              </div>

              {movimentacao.tipo_movimento === "saida" && movimentacao.motivo === "perda" && (
                <div className="alert-box">
                  <AlertTriangle size={18} />
                  <span>Essa saída será registrada como perda no estoque.</span>
                </div>
              )}

              <div className="modal-actions">
                
                <button type="submit" className="btn-primary">
                  Salvar movimentação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalTransferencia && (
        <div className="modal-overlay" onClick={() => setModalTransferencia(false)}>
          <div className="modal-box glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transferência entre lojas</h3>
              <button className="icon-btn" onClick={() => setModalTransferencia(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSalvarTransferencia}>
              <div className="form-group">
                <label>Tipo de item</label>
                <select
                  value={transferencia.tipo_item}
                  onChange={(e) =>
                    setTransferencia({ ...transferencia, tipo_item: e.target.value, item_id: "" })
                  }
                >
                  <option value="produto">Produto</option>
                  <option value="insumo">Insumo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Item</label>
                <select
                  value={transferencia.item_id}
                  onChange={(e) =>
                    setTransferencia({ ...transferencia, item_id: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione</option>
                  {itensAtivos.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loja origem</label>
                  <select
                    value={transferencia.loja_origem_id}
                    onChange={(e) =>
                      setTransferencia({ ...transferencia, loja_origem_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="1">Minha loja</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Loja destino</label>
                  <select
                    value={transferencia.loja_destino_id}
                    onChange={(e) =>
                      setTransferencia({ ...transferencia, loja_destino_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="1">Minha loja</option>
                    <option value="2">Filial 1</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Quantidade</label>
                <input
                  type="number"
                  min="1"
                  placeholder="0"
                  value={transferencia.quantidade}
                  onChange={(e) =>
                    setTransferencia({ ...transferencia, quantidade: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group textarea-group">
                <label>Observação</label>
                <textarea
                  rows="4"
                  placeholder="Descreva a transferência..."
                  value={transferencia.observacao}
                  onChange={(e) =>
                    setTransferencia({ ...transferencia, observacao: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
              
                <button type="submit" className="btn-primary">
                  Salvar transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}