import { Package, Wrench } from 'lucide-react';

export default function SubTabsProdutos({ subTab, setSubTab }) {
  return (
    <div className="products-subtabs">
      <button
        type="button"
        className={`products-subtab ${subTab === 'produtos' ? 'active' : ''}`}
        onClick={() => setSubTab('produtos')}
      >
        <Package size={14} />
        <span>Produtos</span>
      </button>

      <button
        type="button"
        className={`products-subtab ${subTab === 'insumos' ? 'active' : ''}`}
        onClick={() => setSubTab('insumos')}
      >
        <Wrench size={14} />
        <span>Insumos</span>
      </button>
    </div>
  );
}
