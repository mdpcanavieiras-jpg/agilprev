
import React from 'react';
import { TrendingUp, Award, Clock, MessageCircle } from 'lucide-react';

const Stats: React.FC = () => {
  const items = [
    { icon: <TrendingUp />, value: "1000+", label: "Casos Resolvidos" },
    { icon: <Award />, value: "98%", label: "Taxa de Sucesso" },
    { icon: <Clock />, value: "30 dias", label: "Prazo Médio" },
    { icon: <MessageCircle />, value: "24/7", label: "Atendimento" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-agil-blue mb-4">
              {React.cloneElement(item.icon as React.ReactElement<{ size: number }>, { size: 24 })}
            </div>
            <span className="text-2xl font-black text-gray-900">{item.value}</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
