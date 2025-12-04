'use client'

import { useState } from 'react'
import { Download, Eye, Filter, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ReportTemplate {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  metrics: string[]
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'presenca',
    title: 'Relatório de Presença',
    description: 'Análise detalhada de presença em eventos por voluntário',
    icon: <Calendar className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    metrics: ['Total de eventos', 'Presenças registradas', 'Taxa de presença', 'Histórico mensal'],
  },
  {
    id: 'voluntarios',
    title: 'Relatório de Voluntários',
    description: 'Estatísticas e performance de voluntários',
    icon: <Users className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    metrics: ['Voluntários ativos', 'Por ministério', 'Horas contribuídas', 'Badges obtidas'],
  },
  {
    id: 'eventos',
    title: 'Relatório de Eventos',
    description: 'Análise de eventos realizados e participação',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    metrics: ['Total de eventos', 'Participantes por evento', 'Taxa ocupação', 'Ministérios envolvidos'],
  },
  {
    id: 'ministerios',
    title: 'Relatório de Ministérios',
    description: 'Performance e atividades por ministério',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    metrics: ['Ministérios ativos', 'Voluntários por ministério', 'Eventos realizados', 'Índice de engajamento'],
  },
]

export default function RelatoriosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes')
  const [selectedFormat, setSelectedFormat] = useState('pdf')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500 mt-2">Gere relatórios personalizados sobre eventos, voluntários e ministérios</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
              <option value="trimestre">Último trimestre</option>
              <option value="ano">Último ano</option>
              <option value="total">Total</option>
            </select>
          </div>

          {/* Format Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          {/* Search/Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por</label>
            <input
              type="text"
              placeholder="Ministério, voluntário..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Header com gradient */}
            <div className={`bg-gradient-to-r ${template.color} p-6 text-white`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">{template.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{template.title}</h3>
                    <p className="text-sm text-white/90 mt-1">{template.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Metrics */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Métricas incluídas:</p>
                <ul className="space-y-2">
                  {template.metrics.map((metric, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" variant="outline">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
                <Button className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  Gerar {selectedFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Relatórios Recentes</h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Nome do Relatório
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Tipo
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Período
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Data
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">Presença Dezembro 2025</td>
                <td className="px-4 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Presença
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">Dezembro 2025</td>
                <td className="px-4 py-4 text-sm text-gray-600">04/12/2025</td>
                <td className="px-4 py-4 text-sm">
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">Voluntários Novembro</td>
                <td className="px-4 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Voluntários
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">Novembro 2025</td>
                <td className="px-4 py-4 text-sm text-gray-600">01/12/2025</td>
                <td className="px-4 py-4 text-sm">
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">Eventos Trimestral Q4</td>
                <td className="px-4 py-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Eventos
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">Q4 2025</td>
                <td className="px-4 py-4 text-sm text-gray-600">28/11/2025</td>
                <td className="px-4 py-4 text-sm">
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Dica:</span> Você pode agendar a geração automática de relatórios
          recorrentes. Acesse as configurações para mais opções.
        </p>
      </div>
    </div>
  )
}
