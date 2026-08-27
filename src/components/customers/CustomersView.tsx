import React, { useState } from 'react';
import { Customer } from '../../types';
import { useApp } from '../../context/AppContext';
import { storage } from '../../services/storage';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Building, 
  Edit3, 
  Trash2, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CustomersViewProps {
  onOpenNewCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onOpenNewCustomer,
  onEditCustomer,
}) => {
  const { language, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const customers = storage.getCustomers();

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.taxId && c.taxId.includes(searchTerm)) ||
    (c.phone && c.phone.includes(searchTerm))
  );

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Supprimer le client "${name}" ?`)) {
      storage.deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            <span>Répertoire Clients & CRM</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gérez vos clients, coordonnées de facturation et N° IFU
          </p>
        </div>

        <button
          onClick={onOpenNewCustomer}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-950/40 hover:from-blue-500 hover:to-indigo-500 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, IFU, téléphone..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800/90 pl-10 pr-4 py-2 text-xs text-white outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-800 bg-slate-900/90 p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-bold text-slate-300">Aucun client trouvé</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Ajoutez vos clients pour simplifier la création automatique de factures et devis.
            </p>
            <button
              onClick={onOpenNewCustomer}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Ajouter un Client
            </button>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div
              key={customer.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 font-bold text-sm border border-blue-500/30">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white leading-tight">
                        {customer.name}
                      </h3>
                      {customer.companyName && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{customer.companyName}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                      title="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.name)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-400">
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      <span className="font-mono text-slate-300">{customer.phone}</span>
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.taxId && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase rounded bg-slate-800 px-1 py-0.5 text-slate-300">
                        IFU : {customer.taxId}
                      </span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-400 line-clamp-1">{customer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Balance Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Facturé</span>
                  <span className="font-mono font-bold text-slate-200">
                    {formatCurrency(customer.totalInvoiced, 'XOF', language)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Solde Restant Dû</span>
                  <span className={`font-mono font-bold ${customer.outstandingBalance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {formatCurrency(customer.outstandingBalance, 'XOF', language)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
