import {
  Heart,
  ArrowLeft,
  User,
  LogOut,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useMemo, useState } from 'react';
import { getMyShelterVisits, type ShelterVisitResponse } from '../../services/VisitService';

export interface ShelterVisit {
  id: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  visitorAddress: string;
  visitDate: string;
  visitTime: string;
  requestDate: string;
}

interface ShelterVisitsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

function mapVisitToUi(visit: ShelterVisitResponse): ShelterVisit {
  return {
    id: String(visit.id),
    visitorName: visit.visitor?.name ?? 'Visitante',
    visitorEmail: visit.visitor?.email ?? '',
    visitorPhone: visit.visitor?.phone ?? '',
    visitorAddress: visit.visitor?.address ?? '',
    visitDate: visit.visitDate,
    visitTime: visit.visitTime,
    requestDate: visit.requestDate,
  };
}

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function ShelterVisitsScreen({ onBack, onLogout }: ShelterVisitsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [visits, setVisits] = useState<ShelterVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVisits = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getMyShelterVisits();
      setVisits(response.map(mapVisitToUi));
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar as visitas do abrigo.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const today = useMemo(() => getStartOfToday(), []);

  const upcomingVisits = useMemo(
    () => visits.filter((v) => new Date(v.visitDate) >= today),
    [visits, today]
  );

  const pastVisits = useMemo(
    () => visits.filter((v) => new Date(v.visitDate) < today),
    [visits, today]
  );

  const sortedUpcomingVisits = useMemo(
    () =>
      [...upcomingVisits].sort(
        (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
      ),
    [upcomingVisits]
  );

  const sortedPastVisits = useMemo(
    () =>
      [...pastVisits].sort(
        (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
      ),
    [pastVisits]
  );

  const visitsToShow = selectedFilter === 'upcoming' ? sortedUpcomingVisits : sortedPastVisits;

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
                  />
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
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
            <p>Carregando visitas...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={loadVisits} className="bg-purple-600 hover:bg-purple-700">
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                                  Agendado em{' '}
                                  {new Date(visit.requestDate).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
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
                                    year: 'numeric',
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {visit.visitorEmail || 'Não informado'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {visit.visitorPhone || 'Não informado'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">
                            {visit.visitorAddress || 'Não informado'}
                          </span>
                        </div>

                        {!isPast && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex gap-3">
                              <Button
                                onClick={() =>
                                  visit.visitorEmail &&
                                  window.open(`mailto:${visit.visitorEmail}`, '_blank')
                                }
                                variant="outline"
                                className="flex-1"
                                disabled={!visit.visitorEmail}
                              >
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar E-mail
                              </Button>
                              <Button
                                onClick={() =>
                                  visit.visitorPhone &&
                                  window.open(`tel:${visit.visitorPhone}`, '_blank')
                                }
                                className="flex-1 bg-purple-600 hover:bg-purple-700"
                                disabled={!visit.visitorPhone}
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
                    : 'Nenhuma visita realizada ainda'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}