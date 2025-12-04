'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { User } from '@/types'
import { Plus, Search } from 'lucide-react'

export default function VolunteersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: volunteers, isLoading } = useQuery<User[]>({
    queryKey: ['volunteers'],
    queryFn: () => api.get('/volunteers').then((res) => res.data),
  })

  const filteredVolunteers = volunteers?.filter((vol) =>
    vol.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vol.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Voluntários</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus size={20} />
          <span>Novo Voluntário</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Volunteers Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredVolunteers && filteredVolunteers.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.map((volunteer) => (
                <tr
                  key={volunteer.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {volunteer.full_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {volunteer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {volunteer.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {volunteer.position || 'Não definida'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        volunteer.status === 'active'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {volunteer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-primary-800 hover:text-primary-700 text-sm font-semibold">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum voluntário encontrado</p>
        </div>
      )}
    </div>
  )
}
