import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { X, Package, Check } from 'lucide-react';

interface ProductModalProps {
  productToEdit?: Product | null;
  onClose: () => void;
  onSaved: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  productToEdit,
  onClose,
  onSaved,
}) => {
  const { organization } = useApp();
  const isEditing = !!productToEdit;

  const [name, setName] = useState(productToEdit?.name || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [category, setCategory] = useState<ProductCategory>(productToEdit?.category || 'service');
  const [unitPrice, setUnitPrice] = useState<number>(productToEdit?.unitPrice || 50000);
  const [unit, setUnit] = useState(productToEdit?.unit || 'prestation');
  const [taxRate, setTaxRate] = useState<number>(
    productToEdit?.taxRate !== undefined ? productToEdit.taxRate : (organization.settings.defaultTaxRate || 18)
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez renseigner le nom de l\'article ou du service.');
      return;
    }

    const newProduct: Product = {
      id: productToEdit?.id || `prod_${Date.now()}`,
      orgId: organization.id,
      name,
      description,
      category,
      unitPrice,
      taxRate,
      unit,
      active: true,
      createdAt: productToEdit?.createdAt || new Date().toISOString(),
    };

    const saved = storage.saveProduct(newProduct);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {isEditing ? 'Modifier le Produit / Service' : 'Ajouter au Catalogue'}
            </h3>
            <p className="text-xs text-slate-400">
              Enregistrez vos prestations habituelles pour les insérer en 1 clic
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Nom de la prestation ou du produit * :
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Conception Site Web Professionnel"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Type :
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('service')}
                className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                  category === 'service'
                    ? 'border-teal-500 bg-teal-950/40 text-teal-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400'
                }`}
              >
                Service / Prestation
              </button>
              <button
                type="button"
                onClick={() => setCategory('product')}
                className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                  category === 'product'
                    ? 'border-teal-500 bg-teal-950/40 text-teal-300'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400'
                }`}
              >
                Produit / Marchandise
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Prix Unitaire (XOF) :
              </label>
              <input
                type="number"
                min="0"
                value={unitPrice}
                onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Unité :
              </label>
              <input
                type="text"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="prestation, jour, pièce..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Taux TVA par défaut (%) :
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white font-mono outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Description détaillée (optionnelle) :
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Détail des livrables inclus..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:bg-teal-500 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
