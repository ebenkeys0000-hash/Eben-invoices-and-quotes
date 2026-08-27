import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  Package, 
  Plus, 
  Search, 
  Tag, 
  Edit3, 
  Trash2, 
  Layers 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface ProductsViewProps {
  onOpenNewProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  onOpenNewProduct,
  onEditProduct,
}) => {
  const { language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const products = storage.getProducts();

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    return p.category === filterType;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Supprimer l'article "${name}" du catalogue ?`)) {
      storage.deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-teal-400" />
            <span>Catalogue Produits & Services</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Pré-enregistrez vos prestations et tarifs pour une facturation instantanée
          </p>
        </div>

        <button
          onClick={onOpenNewProduct}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-teal-950/40 hover:from-teal-500 hover:to-emerald-500 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Ajouter au Catalogue</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher par libellé, description..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2 text-xs text-white outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              filterType === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterType('service')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              filterType === 'service' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setFilterType('product')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              filterType === 'product' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            Marchandises
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/90 p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-300">Catalogue vide</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ajoutez vos prestations types pour les insérer en 1 clic dans vos devis et factures.
            </p>
            <button
              onClick={onOpenNewProduct}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-teal-500"
            >
              <Plus className="h-4 w-4" />
              Créer un Article
            </button>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    product.category === 'service'
                      ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                      : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {product.category === 'service' ? 'Service / Prestation' : 'Marchandise'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white mt-3 leading-tight">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block">TVA applicable</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {product.taxRate}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Prix unitaire</span>
                  <p className="font-mono text-base font-black text-teal-300">
                    {formatCurrency(product.unitPrice, 'XOF', language)}
                    <span className="text-xs font-normal text-slate-400">/{product.unit || 'u'}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
