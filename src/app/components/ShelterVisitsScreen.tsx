import { Heart, ArrowLeft, User, LogOut, Calendar, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export interface ShelterVisit {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitorAddress: string;
  visitDate: string;
  visitTime: string;
  requestDate: string;
  status: 'confirmed' | 'cancelled';
}

// Mock data - visitas agendadas no abrigo
const mockShelterVisits: ShelterVisit[] = [
  {
    id: '1',
    visitorName: 'Maria Santos',
    visitorEmail: 'maria.santos@email.com',
    visitorPhone: '(11) 99876-5432',
    visitorAddress: 'Rua das Palmeiras, 456 - São Paulo, SP',
    visitDate: '2026-03-05',
    visitTime: '14:00',
    requestDate: '2026-02-28',
    status: 'confirmed'
  },
  {
    id: '2',
    visitorName: 'Carlos Oliveira',
    visitorEmail: 'carlos.oliveira@email.com',
    visitorPhone: '(11) 98765-1234',
    visitorAddress: 'Avenida Paulista, 1000 - São Paulo, SP',
    visitDate: '2026-03-06',
    visitTime: '10:00',
    requestDate: '2026-02-27',
    status: 'confirmed'
  },
  {
    id: '3',
    visitorName: 'Ana Costa',
    visitorEmail: 'ana.costa@email.com',
    visitorPhone: '(11) 97654-3210',
    visitorAddress: 'Rua dos Gatos, 789 - São Paulo, SP',
    visitDate: '2026-03-07',
    visitTime: '15:30',
    requestDate: '2026-02-26',
    status: 'confirmed'
  },
  {
    id: '4',
    visitorName: 'Roberto Lima',
    visitorEmail: 'roberto.lima@email.com',
    visitorPhone: '(11) 96543-2109',
    visitorAddress: 'Rua do Campo, 321 - São Paulo, SP',
    visitDate: '2026-03-08',
    visitTime: '11:00',
    requestDate: '2026-02-25',
    status: 'confirmed'
  },
  {
    id: '5',
    visitorName: 'Família Ferreira',
    visitorEmail: 'familia.ferreira@email.com',
    visitorPhone: '(11) 95432-1098',
    visitorAddress: 'Rua da Alegria, 654 - São Paulo, SP',
    visitDate: '2026-03-09',
    visitTime: '16:00',
    requestDate: '2026-02-24',
    status: 'confirmed'
  },
  {
    id: '6',
    visitorName: 'João Silva',
    visitorEmail: 'joao.silva@email.com',
    visitorPhone: '(11) 94321-0987',
    visitorAddress: 'Rua das Flores, 123 - São Paulo, SP',
    visitDate: '2026-03-03',
    visitTime: '14:00',
    requestDate: '2026-02-20',
    status: 'cancelled'
  }
];

interface ShelterVisitsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function ShelterVisitsScreen({ onBack, onLogout }: ShelterVisitsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const confirmedVisits = mockShelterVisits.filter(v => v.status === 'confirmed');
  const cancelledVisits = mockShelterVisits.filter(v => v.status === 'cancelled');

  const upcomingVisits = confirmedVisits.filter(v => new Date(v.visitDate) >= today);
  const pastVisits = confirmedVisits.filter(v => new Date(v.visitDate) < today);

  // Sort visits by date
  const sortedUpcomingVisits = upcomingVisits.sort((a, b) => 
    new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  const sortedPastVisits = pastVisits.sort((a, b) => 
    new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  const visitsToShow = selectedFilter === 'upcoming' 
    ? sortedUpcomingVisits 
    : selectedFilter === 'past'
    ? sortedPastVisits
    : confirmedVisits;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>

            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" fill="currentColor" />
              <h1 className="text-xl text-purple-600">PetConnect</h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <User className="w-6 h-6 text-gray-600" />
              </button>
              
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-2">Visitas Agendadas</h2>
          <p className="text-xl opacity-90">
            Gerencie as visitas dos interessados ao seu abrigo
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl text-gray-900">{upcomingVisits.length}</p>
                <p className="text-sm text-gray-600">Próximas Visitas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl text-gray-900">{pastVisits.length}</p>
                <p className="text-sm text-gray-600">Realizadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✕</span>
              </div>
              <div>
                <p className="text-3xl text-gray-900">{cancelledVisits.length}</p>
                <p className="text-sm text-gray-600">Canceladas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-2 flex gap-2">
          <button
            onClick={() => setSelectedFilter('upcoming')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              selectedFilter === 'upcoming'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Próximas ({upcomingVisits.length})
          </button>
          <button
            onClick={() => setSelectedFilter('past')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              selectedFilter === 'past'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Realizadas ({pastVisits.length})
          </button>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
              selectedFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todas ({confirmedVisits.length})
          </button>
        </div>

        {/* Visits List */}
        {visitsToShow.length > 0 ? (
          <div className="space-y-4">
            {visitsToShow.map((visit) => {
              const isPast = new Date(visit.visitDate) < today;
              
              return (
                <div 
                  key={visit.id} 
                  className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                    isPast ? 'opacity-75' : ''
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg text-gray-900">{visit.visitorName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Agendado em {new Date(visit.requestDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {isPast ? (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          Realizada
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Confirmada
                        </span>
                      )}
                    </div>

                    {/* Visit Date/Time */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-xs text-purple-600">Data da Visita</p>
                            <p className="text-gray-900">
                              {new Date(visit.visitDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-xs text-purple-600">Horário</p>
                            <p className="text-gray-900">{visit.visitTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{visit.visitorEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{visit.visitorPhone}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{visit.visitorAddress}</span>
                    </div>

                    {/* Action Buttons */}
                    {!isPast && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex gap-3">
                          <Button
                            onClick={() => window.open(`mailto:${visit.visitorEmail}`, '_blank')}
                            variant="outline"
                            className="flex-1"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Enviar E-mail
                          </Button>
                          <Button
                            onClick={() => window.open(`tel:${visit.visitorPhone}`, '_blank')}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Ligar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {selectedFilter === 'upcoming' 
                ? 'Nenhuma visita agendada para os próximos dias'
                : selectedFilter === 'past'
                ? 'Nenhuma visita realizada ainda'
                : 'Nenhuma visita registrada'
              }
            </p>
          </div>
        )}

        {/* Cancelled Visits */}
        {cancelledVisits.length > 0 && selectedFilter === 'all' && (
          <div className="mt-8">
            <h3 className="text-xl text-gray-900 mb-4">Visitas Canceladas</h3>
            <div className="space-y-4">
              {cancelledVisits.map((visit) => (
                <div key={visit.id} className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <User className="w-6 h-6 text-gray-500" />
                      <div className="flex-1">
                        <h4 className="text-lg text-gray-900">{visit.visitorName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(visit.visitDate).toLocaleDateString('pt-BR')} às {visit.visitTime}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                        Cancelada
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
