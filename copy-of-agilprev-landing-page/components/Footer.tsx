
import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Lock, ShoppingCart, CheckCircle2, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  const LOGO_URL = "https://horizons-cdn.hostinger.com/195324a5-5ad8-4c91-83fb-8e15c14e8dfe/94ac8ec0e4dff84bff0c6eccb37a8b58.png";

  return (
    <footer className="bg-[#0B1120] text-gray-400 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-8">
              <img 
                src={LOGO_URL} 
                alt="Agilprev Logo" 
                className="h-[84px] w-auto brightness-0 invert opacity-100 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-base leading-relaxed max-w-sm mb-10 opacity-70 font-medium">
              A <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span> utiliza inteligência artificial de última geração para democratizar o acesso aos direitos previdenciários de milhões de brasileiros.
            </p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-all p-3 bg-white/5 rounded-2xl hover:bg-agil-blue/20"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-all p-3 bg-white/5 rounded-2xl hover:bg-agil-blue/20"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-all p-3 bg-white/5 rounded-2xl hover:bg-agil-blue/20"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-all p-3 bg-white/5 rounded-2xl hover:bg-agil-blue/20"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-2 inline-block">Soluções</h4>
            <ul className="space-y-4 text-[13px] font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Aposentadorias</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auxílio-Doença</a></li>
              <li><a href="#" className="hover:text-white transition-colors">BPC / LOAS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Revisão de Benefício</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-2 inline-block">Empresa</h4>
            <ul className="space-y-4 text-[13px] font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Perguntas Frequentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cases de Sucesso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span></a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-2 inline-block">Suporte</h4>
            <ul className="space-y-4 text-[13px] font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Fale Conosco</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Políticas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
            </ul>
          </div>
        </div>

        {/* Security Badges - Reduced Size by 30% */}
        <div className="py-10 px-4 md:px-0 grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-10 border-y border-white/5 mb-16">
          <div className="flex items-center justify-center w-full group cursor-default">
            <div className="relative shrink-0">
               <svg width="42" height="49" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105">
                 <path d="M30 0L5 10V35C5 50.4 15.6 64.6 30 70C44.4 64.6 55 50.4 55 35V10L30 0Z" fill="#D9F99D" fillOpacity="0.2" />
                 <path d="M30 4L8 12.8V35C8 48.6 17.3 61.2 30 66C42.7 61.2 52 48.6 52 35V12.8L30 4Z" fill="#BEF264" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center -mt-0.5">
                 <Lock size={16} className="text-[#0B1120]" fill="currentColor" />
               </div>
            </div>
            <div className="bg-[#84CC16] h-[36px] px-6 flex flex-col justify-center rounded-r-lg ml-0 border-y border-r border-[#BEF264]/20 shadow-lg min-w-[100px]">
               <span className="text-[#0B1120] text-[10px] font-black tracking-[0.2em] leading-none mb-0.5">— SSL —</span>
               <span className="text-[#0B1120] text-[7px] font-bold tracking-[0.1em] opacity-80 uppercase">Certificate</span>
            </div>
          </div>

          <div className="flex items-center justify-center w-full max-w-[190px] px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 group cursor-default transition-all hover:bg-white/10 hover:border-white/20">
            <div className="bg-[#1E40AF] p-1.5 rounded-lg shadow-lg mr-3 group-hover:scale-110 transition-transform shrink-0">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400 leading-none mb-0.5 text-center uppercase">Verificada por</span>
              <span className="text-[14px] font-black text-white tracking-tighter flex items-center justify-center">
                Reclame<span className="text-agil-blue ml-0.5 uppercase">Aqui</span>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center w-full group cursor-default">
            <div className="relative shrink-0 overflow-hidden">
               <svg width="42" height="49" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105">
                 <path d="M30 0L5 10V35C5 50.4 15.6 64.6 30 70C44.4 64.6 55 50.4 55 35V10L30 0Z" fill="#84CC16" />
                 <path d="M30 4L8 12.8V35C8 48.6 17.3 61.2 30 66C42.7 61.2 52 48.6 52 35V12.8L30 4Z" fill="#65A30D" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center -mt-0.5">
                 <ShoppingCart size={16} className="text-white" />
               </div>
               <div className="absolute top-1/2 right-1 -translate-y-1/2 w-4 h-4 bg-white rounded-full flex items-center justify-center border-2 border-[#84CC16] shadow-sm">
                  <CheckCircle2 size={9} className="text-[#84CC16]" />
               </div>
            </div>
            <div className="ml-4 flex flex-col justify-center">
               <span className="text-[#84CC16] text-[14px] font-black tracking-tight leading-none uppercase">Compra</span>
               <span className="text-[#84CC16] text-[14px] font-black tracking-tight leading-none uppercase text-white">Segura</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-semibold opacity-50">
          <p>© 2024 <span className="text-logo-green">Agil</span><span className="text-logo-blue">prev</span> Tecnologia Previdenciária. Todos os direitos reservados.</p>
          <div className="flex gap-6 items-center">
            <a href="mailto:contato@agilprev.com.br" className="hover:text-white transition-colors">contato@agilprev.com.br</a>
            <span className="h-3 w-[1px] bg-white/20"></span>
            <a href="tel:+5511972430392" className="hover:text-white transition-colors">(11) 97243-0392</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
