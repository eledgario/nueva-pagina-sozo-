'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Users, Lock } from 'lucide-react';

interface Lead {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
}

export default function LeadsPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchLeads(pwd: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        headers: { 'x-admin-password': pwd },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLeads(data.leads);
      setAuthed(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchLeads(password);
  }

  function downloadCSV() {
    const link = document.createElement('a');
    link.href = `/api/leads?format=csv`;
    // Necesitamos hacer fetch con el header de auth
    fetch('/api/leads?format=csv', { headers: { 'x-admin-password': password } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'leads-expo.csv';
        link.click();
        URL.revokeObjectURL(url);
      });
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#FF007F]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white text-center mb-6">Leads — Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 focus:border-[#FF007F] text-white outline-none"
              autoFocus
            />
            {error && <p className="text-red-400 font-mono text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF007F] text-white font-black uppercase tracking-wider hover:bg-[#e0006f] transition-colors"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs text-[#FF007F] uppercase tracking-widest">Expo</span>
            <h1 className="text-3xl font-black mt-1">Leads Registrados</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchLeads(password)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Actualizar
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF007F] hover:bg-[#e0006f] font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#FF007F]" />
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Total leads</span>
            </div>
            <p className="text-4xl font-black">{leads.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Empresas únicas</span>
            </div>
            <p className="text-4xl font-black">
              {new Set(leads.map((l) => l.empresa.toLowerCase())).size}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Último registro</span>
            </div>
            <p className="text-lg font-bold">
              {leads[0]
                ? new Date(leads[0].created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
                : '—'}
            </p>
          </div>
        </div>

        {/* Table */}
        {leads.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 font-mono">
            Aún no hay leads registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Fecha', 'Nombre', 'Empresa', 'Email', 'WhatsApp'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-xs text-zinc-500">
                      {new Date(lead.created_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{lead.nombre}</td>
                    <td className="py-3 px-4 text-zinc-300">{lead.empresa}</td>
                    <td className="py-3 px-4 text-zinc-400">
                      <a href={`mailto:${lead.email}`} className="hover:text-[#FF007F] transition-colors">
                        {lead.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      <a
                        href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF007F] transition-colors"
                      >
                        {lead.whatsapp}
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
