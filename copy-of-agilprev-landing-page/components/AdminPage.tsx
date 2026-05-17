import React, { useEffect, useState } from 'react';

const API_URL = 'https://agilprev-production.up.railway.app';

export default function AdminPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/dashboard`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div className="p-10">Carregando painel...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Painel Agilprev
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500">Leads</h2>
          <p className="text-3xl font-bold">{data.totalSessions}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500">Pagamentos</h2>
          <p className="text-3xl font-bold">{data.totalPayments}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500">Conversões</h2>
          <p className="text-3xl font-bold">{data.totalPaid}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="text-gray-500">Faturamento</h2>
          <p className="text-3xl font-bold">
            {data.revenueFormatted}
          </p>
        </div>

      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          Últimos Leads
        </h2>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th>Produto</th>
              <th>Benefício</th>
              <th>Status</th>
              <th>Pagamento</th>
            </tr>
          </thead>

          <tbody>
            {data.leads.map((lead: any) => (
              <tr key={lead.id} className="border-b">
                <td className="py-3">{lead.produto}</td>
                <td>{lead.tipo_beneficio || '-'}</td>
                <td>{lead.status_funil}</td>
                <td>{lead.status_pagamento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}