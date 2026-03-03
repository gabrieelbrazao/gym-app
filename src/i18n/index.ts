import { ptBR } from './pt-BR'

const translations = ptBR

export function t(key: string): string {
  return translations[key] ?? key
}
