
import React from 'react';

const WorkflowSteps: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "Descreva seu caso e clique na seta",
      description: "Aqui você recebe informação e escolhe qual estratégia de sua preferência.",
      image: (
        <div className="relative w-full max-w-[280px] aspect-[9/18] bg-[#0F172A] rounded-[3rem] border-[8px] border-[#1E293B] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1E293B] rounded-b-3xl z-20"></div>
          
          {/* Screen Content */}
          <div className="absolute inset-0 bg-agil-blue flex flex-col overflow-hidden">
            {/* White Header Bar */}
            <div className="bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-2">
                <img 
                  src="https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png" 
                  alt="Agilprev Logo" 
                  className="w-7 h-7 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-black tracking-tight"><span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span></span>
              </div>
              
              {/* Hamburger Menu Button */}
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm border border-slate-100">
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow pt-10 text-white">
              {/* Headline */}
              <div className="text-center space-y-4 mb-10">
                <h4 className="text-2xl font-black leading-tight tracking-tight">
                  A <span className="text-agil-yellow">Inteligência Artificial</span> que ajuda a resolver seu problema com o INSS!
                </h4>
                <p className="text-[12px] font-medium opacity-90 leading-relaxed px-2">
                  É rápido, prático e em minutos emitimos uma saída para seu caso!
                </p>
              </div>

            {/* Search Bar */}
            <div className="relative mb-4 px-1">
              <div className="w-full h-12 bg-white rounded-2xl flex items-center px-4 shadow-lg relative">
                <div className="text-[10px] text-slate-400">Descreva sua dúvida...</div>
                
                {/* Dashed Curved Arrow pointing to button */}
                <div className="absolute -top-10 left-1/4 w-20 h-12 pointer-events-none z-20">
                  <svg viewBox="0 0 100 60" fill="none" className="w-full h-full text-slate-800/40">
                    <path d="M10 10 Q50 5 85 45" stroke="currentColor" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" fill="none" />
                    <path d="M85 45 L75 42 M85 45 L82 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="ml-auto w-9 h-9 bg-agil-blue rounded-xl flex items-center justify-center relative">
                  {/* Blinking/Pulse effect on the button */}
                  <div className="absolute inset-0 bg-agil-blue rounded-xl animate-ping opacity-20"></div>
                  
                  <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="flex items-center justify-center gap-2 mb-12">
              <div className="w-4 h-4 bg-agil-yellow rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-agil-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider">Sem taxa de sucesso</span>
            </div>

            {/* Bottom Button */}
            <div className="mt-auto mb-8 relative px-1">
              <div className="bg-agil-green text-white text-[11px] font-black py-4 px-4 rounded-2xl text-center shadow-2xl flex items-center justify-center relative">
                Resolver Meu Caso AGORA
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
    {
      id: 2,
      title: "Escolha o plano ideal para você",
      description: "Escolha entre o plano de preferência para avançar no seu caso.",
      image: (
        <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-800 rounded-b-3xl z-20"></div>
          <div className="absolute inset-0 bg-agil-blue flex flex-col overflow-hidden">
            {/* White Header Bar */}
            <div className="bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-2">
                <img 
                  src="https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png" 
                  alt="Agilprev Logo" 
                  className="w-7 h-7 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-black tracking-tight"><span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span></span>
              </div>
              
              {/* Hamburger Menu Button */}
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm border border-slate-100">
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow pt-10">
              <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="border-2 border-agil-green rounded-2xl p-3 bg-white shadow-sm">
                <div className="h-3 w-2/3 bg-agil-green rounded-full mb-3"></div>
                <div className="space-y-2">
                  <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                  <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                  <div className="h-1 w-1/2 bg-slate-100 rounded-full"></div>
                </div>
                <div className="mt-4 h-6 w-full bg-agil-green rounded-lg flex items-center justify-center text-[8px] text-white font-bold">Selecionar</div>
              </div>
              <div className="border-2 border-agil-blue rounded-2xl p-3 bg-white shadow-sm">
                <div className="h-3 w-2/3 bg-agil-blue rounded-full mb-3"></div>
                <div className="space-y-2">
                  <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                  <div className="h-1 w-full bg-slate-100 rounded-full"></div>
                  <div className="h-1 w-1/2 bg-slate-100 rounded-full"></div>
                </div>
                <div className="mt-4 h-6 w-full bg-agil-blue rounded-lg flex items-center justify-center text-[8px] text-white font-bold">Selecionar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
    {
      id: 3,
      title: "Responda algumas perguntas no chat",
      description: "Nosso chat guiado faz perguntas para entender seu caso.",
      image: (
        <div className="relative w-full max-w-[280px] aspect-[9/18] bg-[#0F172A] rounded-[3rem] border-[8px] border-[#1E293B] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1E293B] rounded-b-3xl z-20"></div>
          <div className="absolute inset-0 bg-white flex flex-col pt-10">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              <div className="w-9 h-9 rounded-full border border-slate-100 p-1 flex items-center justify-center bg-white shadow-sm">
                <img 
                  src="https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png" 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-slate-800 leading-none">Agilprev Premium</span>
                <span className="text-[7px] font-bold text-agil-blue uppercase tracking-wider mt-1">Atendimento Previdenciário</span>
              </div>
            </div>

            {/* Blue Bar */}
            <div className="bg-agil-blue px-4 py-3.5 flex items-center gap-3">
              <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              </div>
              <span className="text-[11px] font-black text-white">Chat de Atendimento</span>
            </div>

            {/* Chat Content */}
            <div className="flex-grow p-4 space-y-4 bg-slate-50/30">
              <div className="flex gap-2">
                <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <img 
                    src="https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png" 
                    alt="AI" 
                    className="w-6 h-6 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="bg-white border border-slate-100 shadow-sm p-3.5 rounded-2xl rounded-tl-none text-[10px] font-medium text-slate-700 leading-relaxed max-w-[190px]">
                    Olá! 👋 Sou o assistente da <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span>, vou te ajudar a resolver seu caso do INSS através do serviço Premium. Para começar, qual é o seu nome completo?
                  </div>
                  <span className="text-[8px] text-slate-400 font-bold ml-1">10:32</span>
                </div>
              </div>
            </div>

            {/* Bottom Input */}
            <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
              <div className="flex-grow h-11 bg-slate-50 rounded-2xl border border-slate-100 px-4 flex items-center">
                <span className="text-[10px] text-slate-400 font-medium">Digite sua resposta aqui...</span>
              </div>
              <div className="w-11 h-11 bg-agil-blue rounded-2xl flex items-center justify-center shadow-lg shadow-agil-blue/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" transform="rotate(45)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Receba e baixe seu documento",
      description: "Seu documento é enviado diretamente por e-mail. Você também pode baixar, salvar e imprimir.",
      image: (
        <div className="relative w-full max-w-[280px] aspect-[9/18] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-800 rounded-b-3xl z-20"></div>
          <div className="absolute inset-0 bg-agil-blue flex flex-col overflow-hidden">
            {/* White Header Bar */}
            <div className="bg-white px-5 pt-12 pb-4 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-2">
                <img 
                  src="https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png" 
                  alt="Agilprev Logo" 
                  className="w-7 h-7 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-black tracking-tight"><span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span></span>
              </div>
              
              {/* Hamburger Menu Button */}
              <div className="w-9 h-9 bg-slate-50 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm border border-slate-100">
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
                <div className="w-4 h-0.5 bg-agil-blue rounded-full"></div>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow pt-10">
            {/* Document Preview Simulation */}
            <div className="flex-grow overflow-hidden relative mb-4">
              <div className="bg-white w-full h-full rounded-xl shadow-inner p-4 text-[5px] leading-[1.2] text-slate-800 flex flex-col border border-slate-100">
                <div className="font-bold uppercase opacity-30 mb-1">DOCUMENTO PREVIDENCIÁRIO</div>
                <div className="font-black text-agil-blue uppercase text-[6px] mb-2">REQUERIMENTO ADMINISTRATIVO DE CONCLUSÃO DE ANÁLISE</div>
                <div className="font-bold mb-2">AO INSTITUTO NACIONAL DO SEGURO SOCIAL – INSS</div>
                
                <div className="bg-slate-50 p-1.5 rounded-md border border-slate-100 mb-2">
                  <div className="font-bold uppercase mb-0.5 opacity-50">IDENTIFICAÇÃO</div>
                  <p>Nome: Daniel Felix Carvalho</p>
                  <p>CPF: 074.677.395-44</p>
                </div>

                <div className="space-y-1.5">
                  <div className="font-bold uppercase">DOS FATOS</div>
                  <p className="text-justify opacity-70">
                    O segurado protocolou requerimento administrativo de concessão de benefício previdenciário junto ao INSS...
                  </p>
                </div>

                {/* Gradient Fade Out */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
              </div>
            </div>

            <div className="mt-auto mb-8 p-4 bg-white border border-slate-100 rounded-3xl shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-agil-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-800">Baixar Documento</span>
                  <span className="text-[8px] text-slate-400">Documento Previdenciário.pdf</span>
                </div>
              </div>
              <div className="bg-agil-green text-white text-xs py-3 rounded-xl text-center font-black flex items-center justify-center gap-2 shadow-lg shadow-agil-green/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Baixar Agora
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Decorative Waves - More prominent like the image */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg viewBox="0 0 1440 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M0 300C400 150 800 450 1440 300V1000H0V300Z" fill="url(#workflow-wave-grad)" />
            <defs>
              <linearGradient id="workflow-wave-grad" x1="720" y1="300" x2="720" y2="1000" gradientUnits="userSpaceOnUse">
                <stop stopColor="#DBEAFE" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-24 reveal">
          <h2 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tighter">
            Passo a Passo
          </h2>
          <p className="text-black/70 text-xl font-medium max-w-2xl mx-auto">
            O passo a passo simples para você garantir seus direitos com a ajuda da nossa tecnologia.
          </p>
        </div>

        <div className="space-y-48">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32 reveal`}
            >
              {/* Image Column */}
              <div className="w-full md:w-1/2 flex justify-center relative group">
                {step.image}
                
                {/* Connecting Arrow for Desktop - More solid and green like the image */}
                {index < steps.length - 1 && (
                  <div className={`absolute ${index % 2 === 0 ? '-right-16 lg:-right-32' : '-left-16 lg:-left-32'} top-1/2 -translate-y-1/2 w-32 lg:w-64 h-32 hidden md:block pointer-events-none z-0`}>
                    <svg viewBox="0 0 200 100" fill="none" className={`w-full h-full text-agil-green/60 ${index % 2 !== 0 ? 'scale-x-[-1]' : ''}`}>
                      <path d="M10 20 Q100 -20 190 80" stroke="currentColor" strokeWidth="6" strokeDasharray="15 15" strokeLinecap="round" />
                      <path d="M190 80 L170 75 M190 80 L185 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Text Column */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <div className="flex flex-col items-center md:items-start gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-agil-green text-white flex items-center justify-center text-4xl font-black shadow-[0_20px_40px_-10px_rgba(34,197,94,0.4)] rotate-3">
                    {step.id}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-black tracking-tighter leading-none">
                    {step.title}
                  </h3>
                  <p className="text-black/70 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSteps;
