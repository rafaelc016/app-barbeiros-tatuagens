"use client"

import { useState } from "react"
import { Calendar, Scissors, Palette, Clock, User, Phone, Mail, MapPin, TrendingUp, Award, Gift, ChevronRight, Bell, Settings } from "lucide-react"

type ServiceType = "corte" | "tatuagem"

interface Agendamento {
  id: number
  nome: string
  servico: string
  data: string
  horario: string
  status: "confirmado" | "pendente" | "concluido"
}

interface Profissional {
  id: number
  nome: string
  especialidade: string
  foto: string
  avaliacao: number
  atendimentos: number
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"agendamento" | "cortes" | "tatuagens" | "perfil" | "promocoes">("agendamento")
  const [serviceType, setServiceType] = useState<ServiceType>("corte")
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<number | null>(null)
  const [backgroundColor, setBackgroundColor] = useState("#0A0A0A")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    data: "",
    horario: "",
    servico: ""
  })

  // Profissionais disponíveis
  const profissionais: Profissional[] = [
    {
      id: 1,
      nome: "Carlos Silva",
      especialidade: "Barbeiro Master",
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      avaliacao: 4.9,
      atendimentos: 1250
    },
    {
      id: 2,
      nome: "Rafael Costa",
      especialidade: "Especialista em Degradê",
      foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      avaliacao: 4.8,
      atendimentos: 980
    },
    {
      id: 3,
      nome: "Marcos Oliveira",
      especialidade: "Tatuador Profissional",
      foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
      avaliacao: 5.0,
      atendimentos: 650
    }
  ]

  // Histórico de agendamentos (simulado)
  const meusAgendamentos: Agendamento[] = [
    {
      id: 1,
      nome: "João Silva",
      servico: "Corte + Barba",
      data: "2024-01-20",
      horario: "14:00",
      status: "confirmado"
    },
    {
      id: 2,
      nome: "João Silva",
      servico: "Degradê",
      data: "2024-01-05",
      horario: "15:00",
      status: "concluido"
    }
  ]

  // Promoções ativas
  const promocoes = [
    {
      id: 1,
      titulo: "Combo Especial",
      descricao: "Corte + Barba + Sobrancelha",
      precoOriginal: "R$ 75",
      precoPromocao: "R$ 55",
      validade: "Válido até 31/01",
      icone: Gift
    },
    {
      id: 2,
      titulo: "Primeira Tatuagem",
      descricao: "20% OFF na sua primeira tattoo",
      precoOriginal: "R$ 150",
      precoPromocao: "R$ 120",
      validade: "Válido até 28/02",
      icone: TrendingUp
    },
    {
      id: 3,
      titulo: "Cliente Fidelidade",
      descricao: "A cada 5 cortes, ganhe 1 grátis",
      precoOriginal: "",
      precoPromocao: "Programa de Pontos",
      validade: "Permanente",
      icone: Award
    }
  ]

  // Galeria de cortes
  const cortesGaleria = [
    {
      id: 1,
      titulo: "Degradê Clássico",
      imagem: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=500&fit=crop",
      descricao: "Corte moderno com degradê suave",
      profissional: "Carlos Silva"
    },
    {
      id: 2,
      titulo: "Pompadour",
      imagem: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=500&fit=crop",
      descricao: "Estilo clássico volumoso",
      profissional: "Rafael Costa"
    },
    {
      id: 3,
      titulo: "Undercut",
      imagem: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=500&fit=crop",
      descricao: "Lateral raspada com volume no topo",
      profissional: "Carlos Silva"
    },
    {
      id: 4,
      titulo: "Buzz Cut",
      imagem: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop",
      descricao: "Corte militar moderno",
      profissional: "Rafael Costa"
    },
    {
      id: 5,
      titulo: "Fade Americano",
      imagem: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=500&fit=crop",
      descricao: "Degradê alto com textura",
      profissional: "Carlos Silva"
    },
    {
      id: 6,
      titulo: "Slick Back",
      imagem: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=400&h=500&fit=crop",
      descricao: "Cabelo penteado para trás",
      profissional: "Rafael Costa"
    }
  ]

  // Galeria de tatuagens
  const tatuagensGaleria = [
    {
      id: 1,
      titulo: "Tribal Braço",
      imagem: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&h=500&fit=crop",
      descricao: "Design tribal moderno",
      profissional: "Marcos Oliveira"
    },
    {
      id: 2,
      titulo: "Realismo",
      imagem: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop",
      descricao: "Tatuagem realista detalhada",
      profissional: "Marcos Oliveira"
    },
    {
      id: 3,
      titulo: "Geométrica",
      imagem: "https://images.unsplash.com/photo-1590246814883-57c511a8c4a6?w=400&h=500&fit=crop",
      descricao: "Padrões geométricos precisos",
      profissional: "Marcos Oliveira"
    },
    {
      id: 4,
      titulo: "Old School",
      imagem: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=500&fit=crop",
      descricao: "Estilo tradicional americano",
      profissional: "Marcos Oliveira"
    },
    {
      id: 5,
      titulo: "Minimalista",
      imagem: "https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400&h=500&fit=crop",
      descricao: "Design clean e minimalista",
      profissional: "Marcos Oliveira"
    },
    {
      id: 6,
      titulo: "Blackwork",
      imagem: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop",
      descricao: "Tatuagem em preto sólido",
      profissional: "Marcos Oliveira"
    }
  ]

  const horarios = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ]

  const servicosCorte = [
    "Corte Simples - R$ 40",
    "Corte + Barba - R$ 60",
    "Degradê - R$ 50",
    "Corte + Sobrancelha - R$ 55"
  ]

  const servicosTatuagem = [
    "Tatuagem Pequena - R$ 150",
    "Tatuagem Média - R$ 300",
    "Tatuagem Grande - R$ 500+",
    "Orçamento Personalizado"
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const profissional = profissionais.find(p => p.id === profissionalSelecionado)
    alert(`✅ Agendamento confirmado!\n\nNome: ${formData.nome}\nTelefone: ${formData.telefone}\nData: ${formData.data}\nHorário: ${formData.horario}\nServiço: ${formData.servico}\nProfissional: ${profissional?.nome || "A definir"}\n\n🔔 Você receberá uma notificação 1 dia antes do seu horário!`)
  }

  const coresPreDefinidas = [
    { nome: "Preto", cor: "#0A0A0A" },
    { nome: "Cinza Escuro", cor: "#1A1A1A" },
    { nome: "Azul Escuro", cor: "#0F1419" },
    { nome: "Roxo Escuro", cor: "#1A0F2E" },
    { nome: "Verde Escuro", cor: "#0A1F1F" },
    { nome: "Marrom Escuro", cor: "#1F1410" }
  ]

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor }}>
      {/* Botão de Personalização Flutuante */}
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#D4AF37]/50"
        title="Personalizar Fundo"
      >
        <Settings className="w-6 h-6 text-black" />
      </button>

      {/* Painel de Personalização */}
      {showColorPicker && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl w-80 animate-in slide-in-from-bottom-5">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#D4AF37]" />
            Personalizar Fundo
          </h3>
          
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Cores Pré-definidas</label>
            <div className="grid grid-cols-3 gap-2">
              {coresPreDefinidas.map((item) => (
                <button
                  key={item.cor}
                  onClick={() => setBackgroundColor(item.cor)}
                  className="h-12 rounded-lg border-2 transition-all hover:scale-105"
                  style={{ 
                    backgroundColor: item.cor,
                    borderColor: backgroundColor === item.cor ? "#D4AF37" : "transparent"
                  }}
                  title={item.nome}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Cor Personalizada</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-12 rounded-lg cursor-pointer border-2 border-gray-700"
            />
          </div>

          <button
            onClick={() => setShowColorPicker(false)}
            className="w-full bg-[#D4AF37] text-black font-semibold py-2 rounded-lg hover:bg-[#B8941F] transition-all"
          >
            Fechar
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] border-b border-[#D4AF37]/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8941F] p-3 rounded-xl">
                <Scissors className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">BarberShop Pro</h1>
                <p className="text-[#D4AF37] text-sm">Estilo & Atitude</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                <span>(11) 98765-4321</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Rua da Barbearia, 123</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#1A1A1A] border-b border-[#D4AF37]/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("agendamento")}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "agendamento"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Calendar className="w-5 h-5" />
              Agendamento
            </button>
            <button
              onClick={() => setActiveTab("cortes")}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "cortes"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Scissors className="w-5 h-5" />
              Cortes
            </button>
            <button
              onClick={() => setActiveTab("tatuagens")}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "tatuagens"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Palette className="w-5 h-5" />
              Tatuagens
            </button>
            <button
              onClick={() => setActiveTab("perfil")}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "perfil"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <User className="w-5 h-5" />
              Meu Perfil
            </button>
            <button
              onClick={() => setActiveTab("promocoes")}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "promocoes"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Gift className="w-5 h-5" />
              Promoções
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Agendamento Tab */}
        {activeTab === "agendamento" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#D4AF37]" />
                Agendar Horário
              </h2>

              {/* Service Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-semibold">Tipo de Serviço</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setServiceType("corte")
                      setFormData({ ...formData, servico: "" })
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      serviceType === "corte"
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-gray-700 bg-[#0A0A0A] text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <Scissors className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-semibold">Corte</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setServiceType("tatuagem")
                      setFormData({ ...formData, servico: "" })
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      serviceType === "tatuagem"
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-gray-700 bg-[#0A0A0A] text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <Palette className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-semibold">Tatuagem</span>
                  </button>
                </div>
              </div>

              {/* Seleção de Profissional */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-semibold">Escolha seu Profissional</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profissionais
                    .filter(p => serviceType === "corte" ? p.especialidade.includes("Barbeiro") || p.especialidade.includes("Degradê") : p.especialidade.includes("Tatuador"))
                    .map((prof) => (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => setProfissionalSelecionado(prof.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          profissionalSelecionado === prof.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-gray-700 bg-[#0A0A0A] hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img src={prof.foto} alt={prof.nome} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <h4 className="text-white font-semibold">{prof.nome}</h4>
                            <p className="text-xs text-gray-400">{prof.especialidade}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-[#D4AF37]">
                            <span>⭐</span>
                            <span>{prof.avaliacao}</span>
                          </div>
                          <span className="text-gray-400">{prof.atendimentos} atendimentos</span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                      Telefone
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">Serviço</label>
                  <select
                    required
                    value={formData.servico}
                    onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                  >
                    <option value="">Selecione o serviço</option>
                    {(serviceType === "corte" ? servicosCorte : servicosTatuagem).map((servico, index) => (
                      <option key={index} value={servico}>
                        {servico}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold">Data</label>
                    <input
                      type="date"
                      required
                      value={formData.data}
                      onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#D4AF37]" />
                      Horário
                    </label>
                    <select
                      required
                      value={formData.horario}
                      onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                    >
                      <option value="">Selecione o horário</option>
                      {horarios.map((horario) => (
                        <option key={horario} value={horario}>
                          {horario}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4 flex items-start gap-3">
                  <Bell className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#D4AF37] font-semibold mb-1">Notificações Automáticas</p>
                    <p className="text-gray-400">Você receberá lembretes por WhatsApp 1 dia antes e 2 horas antes do seu horário.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  Confirmar Agendamento
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cortes Tab */}
        {activeTab === "cortes" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">Nossos Cortes</h2>
              <p className="text-gray-400 text-lg">Confira os estilos mais procurados</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cortesGaleria.map((corte) => (
                <div
                  key={corte.id}
                  className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02]"
                >
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={corte.imagem}
                      alt={corte.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{corte.titulo}</h3>
                    <p className="text-gray-400 mb-2">{corte.descricao}</p>
                    <p className="text-[#D4AF37] text-sm mb-3">Por {corte.profissional}</p>
                    <button
                      onClick={() => setActiveTab("agendamento")}
                      className="w-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37] py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      Agendar Este Corte
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tatuagens Tab */}
        {activeTab === "tatuagens" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">Nossas Tatuagens</h2>
              <p className="text-gray-400 text-lg">Arte na pele com qualidade profissional</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tatuagensGaleria.map((tatuagem) => (
                <div
                  key={tatuagem.id}
                  className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02]"
                >
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={tatuagem.imagem}
                      alt={tatuagem.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{tatuagem.titulo}</h3>
                    <p className="text-gray-400 mb-2">{tatuagem.descricao}</p>
                    <p className="text-[#D4AF37] text-sm mb-3">Por {tatuagem.profissional}</p>
                    <button
                      onClick={() => {
                        setServiceType("tatuagem")
                        setActiveTab("agendamento")
                      }}
                      className="w-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37] py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      Agendar Tatuagem
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Perfil Tab */}
        {activeTab === "perfil" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 shadow-2xl mb-6">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-8 h-8 text-[#D4AF37]" />
                Meu Perfil
              </h2>

              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-800">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center text-black text-3xl font-bold">
                  JS
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">João Silva</h3>
                  <p className="text-gray-400">joao.silva@email.com</p>
                  <p className="text-[#D4AF37] text-sm mt-1">Cliente desde 2023</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">12</div>
                  <div className="text-gray-400 text-sm">Agendamentos</div>
                </div>
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">3</div>
                  <div className="text-gray-400 text-sm">Pontos Fidelidade</div>
                </div>
                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">R$ 120</div>
                  <div className="text-gray-400 text-sm">Economia Total</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Histórico de Agendamentos</h3>
              <div className="space-y-3">
                {meusAgendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-semibold mb-1">{agendamento.servico}</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.horario}
                      </p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        agendamento.status === "confirmado" 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : agendamento.status === "concluido"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {agendamento.status === "confirmado" ? "Confirmado" : agendamento.status === "concluido" ? "Concluído" : "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Promoções Tab */}
        {activeTab === "promocoes" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">Promoções Especiais</h2>
              <p className="text-gray-400 text-lg">Aproveite nossas ofertas exclusivas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promocoes.map((promo) => {
                const IconComponent = promo.icone
                return (
                  <div
                    key={promo.id}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02]"
                  >
                    <div className="bg-[#D4AF37]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-7 h-7 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{promo.titulo}</h3>
                    <p className="text-gray-400 mb-4">{promo.descricao}</p>
                    
                    {promo.precoOriginal && (
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-gray-500 line-through text-sm">{promo.precoOriginal}</span>
                          <span className="text-[#D4AF37] text-2xl font-bold">{promo.precoPromocao}</span>
                        </div>
                      </div>
                    )}
                    
                    {!promo.precoOriginal && (
                      <div className="mb-4">
                        <span className="text-[#D4AF37] text-xl font-bold">{promo.precoPromocao}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-500 text-sm mb-4">{promo.validade}</p>
                    
                    <button
                      onClick={() => setActiveTab("agendamento")}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black font-bold py-3 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Aproveitar Oferta
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Programa de Fidelidade */}
            <div className="mt-12 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-8 border border-[#D4AF37]/20">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-[#D4AF37]" />
                <h3 className="text-3xl font-bold text-white">Programa de Fidelidade</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Como Funciona</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>A cada corte realizado, você ganha 1 ponto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Acumule 5 pontos e ganhe 1 corte grátis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Tatuagens também acumulam pontos em dobro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>Sem validade - seus pontos nunca expiram</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#0A0A0A] rounded-xl p-6 border border-gray-800">
                  <h4 className="text-xl font-semibold text-white mb-4">Seus Pontos</h4>
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-6xl font-bold text-[#D4AF37]">3</div>
                    <div className="text-gray-400 ml-2">/5</div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] h-3 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-center text-gray-400 text-sm">Faltam apenas 2 pontos para seu corte grátis!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] border-t border-[#D4AF37]/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-3">Horário de Funcionamento</h3>
              <p className="text-gray-400">Segunda a Sexta: 9h às 20h</p>
              <p className="text-gray-400">Sábado: 9h às 18h</p>
              <p className="text-gray-400">Domingo: Fechado</p>
            </div>
            <div>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-3">Contato</h3>
              <p className="text-gray-400">Telefone: (11) 98765-4321</p>
              <p className="text-gray-400">Email: contato@barbershoppro.com</p>
              <p className="text-gray-400">WhatsApp: (11) 98765-4321</p>
            </div>
            <div>
              <h3 className="text-[#D4AF37] font-bold text-lg mb-3">Localização</h3>
              <p className="text-gray-400">Rua da Barbearia, 123</p>
              <p className="text-gray-400">Centro - São Paulo/SP</p>
              <p className="text-gray-400">CEP: 01234-567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
            <p>&copy; 2024 BarberShop Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
