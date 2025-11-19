"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Calendar, Scissors, Clock, User, Phone, Mail, MapPin, TrendingUp, Award, Gift, ChevronRight, Bell, Settings, History, Activity, CheckCircle2, XCircle, Loader2, Search, Filter, Star } from "lucide-react"
import { supabase, type Profissional, type Agendamento, type Promocao, type GaleriaItem } from "@/lib/supabase"

type ServiceType = "corte"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"agendamento" | "cortes" | "perfil" | "promocoes" | "historico">("agendamento")
  const [serviceType, setServiceType] = useState<ServiceType>("corte")
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<string | null>(null)
  const [backgroundColor, setBackgroundColor] = useState("#0A0A0A")
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"todos" | "confirmado" | "concluido" | "cancelado">("todos")
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    data: "",
    horario: "",
    servico: ""
  })

  // Estados para dados do Supabase
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [promocoes, setPromocoes] = useState<Promocao[]>([])
  const [cortesGaleria, setCortesGaleria] = useState<GaleriaItem[]>([])
  const [meusAgendamentos, setMeusAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Carregar dados do Supabase com otimização
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = useCallback(async () => {
    try {
      setLoading(true)

      // Carregar todos os dados em paralelo para melhor performance
      const [profsData, promosData, cortesData, agendamentosData] = await Promise.all([
        supabase.from('profissionais').select('*').eq('ativo', true).order('total_atendimentos', { ascending: false }),
        supabase.from('promocoes').select('*').eq('ativo', true).order('created_at', { ascending: false }),
        supabase.from('galeria').select('*, profissional:profissionais(nome)').eq('tipo', 'corte').order('created_at', { ascending: false }),
        supabase.from('agendamentos').select('*, cliente:clientes(nome, email), profissional:profissionais(nome)').order('data_agendamento', { ascending: false }).limit(20)
      ])

      if (profsData.data) setProfissionais(profsData.data)
      if (promosData.data) setPromocoes(promosData.data)
      if (cortesData.data) setCortesGaleria(cortesData.data as any)
      if (agendamentosData.data) setMeusAgendamentos(agendamentosData.data as any)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrar agendamentos com useMemo para otimização
  const agendamentosFiltrados = useMemo(() => {
    return meusAgendamentos.filter(agendamento => {
      const matchStatus = filterStatus === "todos" || agendamento.status === filterStatus
      const matchSearch = searchTerm === "" || 
        agendamento.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agendamento as any).profissional?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [meusAgendamentos, filterStatus, searchTerm])

  // Profissionais filtrados por tipo de serviço
  const profissionaisFiltrados = useMemo(() => {
    return profissionais.filter(p => 
      p.especialidade.includes("Barbeiro") || p.especialidade.includes("Degradê")
    )
  }, [profissionais])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)

      // Criar ou buscar cliente
      const { data: clienteExistente } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', formData.email)
        .single()

      let clienteId = clienteExistente?.id

      if (!clienteId) {
        const { data: novoCliente } = await supabase
          .from('clientes')
          .insert({
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone
          })
          .select('id')
          .single()

        clienteId = novoCliente?.id
      }

      // Extrair valor do serviço
      const valorMatch = formData.servico.match(/R\$\s*(\d+)/)
      const valor = valorMatch ? parseFloat(valorMatch[1]) : 0

      // Criar agendamento
      const { error } = await supabase
        .from('agendamentos')
        .insert({
          cliente_id: clienteId,
          profissional_id: profissionalSelecionado,
          tipo_servico: serviceType,
          servico: formData.servico,
          data_agendamento: formData.data,
          horario: formData.horario,
          valor: valor,
          status: 'confirmado'
        })

      if (error) throw error

      const profissional = profissionais.find(p => p.id === profissionalSelecionado)
      alert(`✅ Agendamento confirmado com sucesso!\n\nNome: ${formData.nome}\nTelefone: ${formData.telefone}\nData: ${formData.data}\nHorário: ${formData.horario}\nServiço: ${formData.servico}\nProfissional: ${profissional?.nome || "A definir"}\n\n🔔 Você receberá notificações 1 dia antes e 2 horas antes do seu horário!`)

      // Limpar formulário
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        data: "",
        horario: "",
        servico: ""
      })
      setProfissionalSelecionado(null)

      // Recarregar agendamentos
      await carregarDados()

    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      alert('❌ Erro ao criar agendamento. Por favor, tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const coresPreDefinidas = [
    { nome: "Preto", cor: "#0A0A0A" },
    { nome: "Cinza Escuro", cor: "#1A1A1A" },
    { nome: "Azul Escuro", cor: "#0F1419" },
    { nome: "Roxo Escuro", cor: "#1A0F2E" },
    { nome: "Verde Escuro", cor: "#0A1F1F" },
    { nome: "Marrom Escuro", cor: "#1F1410" }
  ]

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      'gift': Gift,
      'trending-up': TrendingUp,
      'award': Award
    }
    return icons[iconName] || Gift
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmado":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "concluido":
        return <CheckCircle2 className="w-5 h-5 text-blue-400" />
      case "cancelado":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "concluido":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "cancelado":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmado": return "Confirmado"
      case "concluido": return "Concluído"
      case "cancelado": return "Cancelado"
      default: return "Pendente"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor }}>
      {/* Botão de Personalização Flutuante */}
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#D4AF37]/50"
        title="Personalizar Fundo"
        aria-label="Personalizar cor de fundo"
      >
        <Settings className="w-6 h-6 text-black" />
      </button>

      {/* Painel de Personalização */}
      {showColorPicker && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#1A1A1A] border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl w-80 animate-in slide-in-from-bottom-5">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D4AF37]" />
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
                  aria-label={`Selecionar cor ${item.nome}`}
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
              aria-label="Seletor de cor personalizada"
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
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
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
              onClick={() => setActiveTab("historico")}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                activeTab === "historico"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <History className="w-5 h-5" />
              Histórico
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

              {/* Seleção de Profissional */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-3 font-semibold">Escolha seu Profissional</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profissionaisFiltrados.map((prof) => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => setProfissionalSelecionado(prof.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                        profissionalSelecionado === prof.id
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-gray-700 bg-[#0A0A0A] hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img src={prof.foto_url || ''} alt={prof.nome} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                          <h4 className="text-white font-semibold">{prof.nome}</h4>
                          <p className="text-xs text-gray-400">{prof.especialidade}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-[#D4AF37]">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{prof.avaliacao}</span>
                        </div>
                        <span className="text-gray-400">{prof.total_atendimentos} atendimentos</span>
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
                    {servicosCorte.map((servico, index) => (
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
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-black font-bold py-4 rounded-xl hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Confirmar Agendamento"
                  )}
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

            {cortesGaleria.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Nenhum corte cadastrado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cortesGaleria.map((corte) => (
                  <div
                    key={corte.id}
                    className="group bg-[#1A1A1A] rounded-2xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:scale-[1.02]"
                  >
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <img
                        src={corte.imagem_url}
                        alt={corte.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-white mb-2">{corte.titulo}</h3>
                      <p className="text-gray-400 mb-2">{corte.descricao}</p>
                      <p className="text-[#D4AF37] text-sm mb-3">Por {(corte as any).profissional?.nome || 'Profissional'}</p>
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
            )}
          </div>
        )}

        {/* Histórico Tab */}
        {activeTab === "historico" && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-6 md:p-8 border border-[#D4AF37]/20 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <History className="w-8 h-8 text-[#D4AF37]" />
                  Histórico de Atividades
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Activity className="w-4 h-4" />
                  <span>{agendamentosFiltrados.length} atividades</span>
                </div>
              </div>

              {/* Filtros e Busca */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por serviço ou profissional..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-gray-700 rounded-xl text-white focus:border-[#D4AF37] focus:outline-none transition-all appearance-none"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="confirmado">Confirmados</option>
                    <option value="concluido">Concluídos</option>
                    <option value="cancelado">Cancelados</option>
                  </select>
                </div>
              </div>

              {/* Lista de Atividades */}
              {agendamentosFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Nenhuma atividade encontrada.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agendamentosFiltrados.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="bg-[#0A0A0A] rounded-xl p-5 border border-gray-800 hover:border-[#D4AF37]/50 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            {getStatusIcon(agendamento.status)}
                            <div className="flex-1">
                              <h4 className="text-white font-semibold text-lg mb-1">{agendamento.servico}</h4>
                              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                                  <span>{new Date(agendamento.data_agendamento).toLocaleDateString('pt-BR', { 
                                    day: '2-digit', 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                                  <span>{agendamento.horario}</span>
                                </div>
                                {(agendamento as any).profissional && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4 text-[#D4AF37]" />
                                    <span>{(agendamento as any).profissional.nome}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {(agendamento as any).cliente && (
                            <div className="ml-8 text-sm text-gray-500">
                              Cliente: {(agendamento as any).cliente.nome} • {(agendamento as any).cliente.email}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(agendamento.status)}`}>
                            {getStatusText(agendamento.status)}
                          </span>
                          {agendamento.valor && (
                            <span className="text-[#D4AF37] font-bold text-lg">
                              R$ {agendamento.valor.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Estatísticas */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">Estatísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                    <div className="text-2xl font-bold text-[#D4AF37] mb-1">
                      {meusAgendamentos.filter(a => a.status === "confirmado").length}
                    </div>
                    <div className="text-gray-400 text-sm">Confirmados</div>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {meusAgendamentos.filter(a => a.status === "concluido").length}
                    </div>
                    <div className="text-gray-400 text-sm">Concluídos</div>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-1">
                      {meusAgendamentos.filter(a => a.status === "cancelado").length}
                    </div>
                    <div className="text-gray-400 text-sm">Cancelados</div>
                  </div>
                  <div className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 text-center">
                    <div className="text-2xl font-bold text-[#D4AF37] mb-1">
                      R$ {meusAgendamentos.reduce((acc, a) => acc + (a.valor || 0), 0).toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm">Total Gasto</div>
                  </div>
                </div>
              </div>
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
                  <div className="text-3xl font-bold text-[#D4AF37] mb-1">{meusAgendamentos.length}</div>
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

              <h3 className="text-xl font-bold text-white mb-4">Últimos Agendamentos</h3>
              {meusAgendamentos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Nenhum agendamento ainda.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {meusAgendamentos.slice(0, 5).map((agendamento) => (
                    <div key={agendamento.id} className="bg-[#0A0A0A] rounded-xl p-4 border border-gray-800 flex items-center justify-between hover:border-[#D4AF37]/50 transition-all">
                      <div>
                        <h4 className="text-white font-semibold mb-1">{agendamento.servico}</h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(agendamento.data_agendamento).toLocaleDateString('pt-BR')} às {agendamento.horario}
                        </p>
                        {(agendamento as any).profissional && (
                          <p className="text-[#D4AF37] text-xs mt-1">
                            Com {(agendamento as any).profissional.nome}
                          </p>
                        )}
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(agendamento.status)}`}>
                          {getStatusText(agendamento.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

            {promocoes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Nenhuma promoção ativa no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promocoes.map((promo) => {
                  const IconComponent = getIconComponent(promo.tipo_icone)
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
                      
                      {promo.preco_original && (
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-gray-500 line-through text-sm">R$ {promo.preco_original}</span>
                            <span className="text-[#D4AF37] text-2xl font-bold">{promo.preco_promocao}</span>
                          </div>
                        </div>
                      )}
                      
                      {!promo.preco_original && (
                        <div className="mb-4">
                          <span className="text-[#D4AF37] text-xl font-bold">{promo.preco_promocao}</span>
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
            )}

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
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] h-3 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
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
