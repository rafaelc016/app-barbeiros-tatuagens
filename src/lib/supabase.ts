import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  pontos_fidelidade: number
  economia_total: number
  created_at: string
}

export interface Profissional {
  id: string
  nome: string
  especialidade: string
  foto_url: string
  avaliacao: number
  total_atendimentos: number
  ativo: boolean
  created_at: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  profissional_id: string
  tipo_servico: 'corte' | 'tatuagem'
  servico: string
  data_agendamento: string
  horario: string
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
  valor: number
  observacoes?: string
  created_at: string
  cliente?: Cliente
  profissional?: Profissional
}

export interface Promocao {
  id: string
  titulo: string
  descricao: string
  preco_original?: number
  preco_promocao: string
  validade: string
  tipo_icone: string
  ativo: boolean
  created_at: string
}

export interface GaleriaItem {
  id: string
  tipo: 'corte' | 'tatuagem'
  titulo: string
  descricao: string
  imagem_url: string
  profissional_id: string
  destaque: boolean
  created_at: string
  profissional?: Profissional
}
