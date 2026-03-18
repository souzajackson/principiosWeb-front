import {
  Heart,
  ArrowLeft,
  User,
  LogOut,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building2,
  Trash2,
  Clock,
  Loader2,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { useEffect, useMemo, useState } from 'react';
import { deleteVisit, getMyVisits, type Visit } from '../../services/VisitService';

interface MyVisitsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

type VisitStatus = 'scheduled' | 'cancelled';

interface ScheduledVisit {
  id: string;
  shelterId: string;
  shelterName: string;
  shelterImage: string;
  shelterAddress: string;
  shelterCity: string;
  shelterState: string;
  shelterPhone: string;
  shelterEmail: string;
  visitDate: string;
  visitTime: string;
  status: VisitStatus;
}

function mapVisitToScheduledVisit(visit: Visit): ScheduledVisit {
  const visitDateObj = new Date(visit.date);

  return {
    id: String(visit.id),
    shelterId: String(visit.shelterId),
    shelterName: visit.shelter?.name ?? 'Abrigo',
    shelterImage: '',
    shelterAddress: visit.shelter?.address ?? '',
    shelterCity: '',
    shelterState: '',
    shelterPhone: '',
    shelterEmail: '',
    visitDate: visit.date,
    visitTime:
      visit.time ??
      visitDateObj.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    status: visit.status === 'cancelled' ? 'cancelled' : 'scheduled',
  };
}

function formatVisitDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function MyVisitsScreen({ onBack, onLogout }: MyVisitsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const [visits, setVisits] = useState<ScheduledVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVisits = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiVisits = await getMyVisits();
      setVisits(apiVisits.map(mapVisitToScheduledVisit));
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar suas visitas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, []);

  const handleCancelVisit = async (visitId: string) => {
    try {
      setIsCancelling(true);

      await deleteVisit(Number(visitId));

      setVisits((prev) =>
        prev.map((visit) =>
          visit.id === visitId ? { ...visit, status: 'cancelled' } : visit
        )
      );

      setConfirmCancelId(null);
      alert('Visita cancelada com sucesso! ❌');
    } catch (err) {
      console.error(err);
      alert('Não foi possível cancelar a visita.');
    } finally {
      setIsCancelling(false);
    }
  };

  const scheduledVisits = useMemo(
    () => visits.filter((v) => v.status === 'scheduled'),
    [visits]
  );

  const cancelledVisits = useMemo(
    () => visits.filter((v) => v.status === 'cancelled'),
    [visits]
  );

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
          <h2 className="text-4xl mb-2">Minhas Visitas Agendadas</h2>
          <p className="text-xl opacity-90">Gerencie suas visitas aos abrigos</p>
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
          <div className="flex flex-col items-center justify-center py-24 text-red-500">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={loadVisits}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl text-gray-900">{scheduledVisits.length}</p>
                    <p className="text-sm text-gray-600">Visitas Agendadas</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-3xl text-gray-900">{cancelledVisits.length}</p>
                    <p className="text-sm text-gray-600">Visitas Canceladas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduled Visits */}
            {scheduledVisits.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl text-gray-900 mb-4">Próximas Visitas</h3>
                <div className="space-y-4">
                  {scheduledVisits.map((visit) => (
                    <div key={visit.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Shelter Image */}
                          <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {visit.shelterImage ? (
                              <ImageWithFallback
                                src={visit.shelterImage}
                                alt={visit.shelterName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-purple-50">
                                <Building2 className="w-12 h-12 text-purple-200" />
                              </div>
                            )}
                          </div>

                          {/* Visit Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Building2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                  <h4 className="text-xl text-gray-900">{visit.shelterName}</h4>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                  Confirmada
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-900">
                                  {formatVisitDate(visit.visitDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-900">{visit.visitTime}</span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              {visit.shelterAddress && (
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="text-gray-600">
                                    {visit.shelterAddress}
                                    {visit.shelterCity ? `, ${visit.shelterCity}` : ''}
                                    {visit.shelterState ? ` - ${visit.shelterState}` : ''}
                                  </span>
                                </div>
                              )}

                              {visit.shelterPhone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{visit.shelterPhone}</span>
                                </div>
                              )}

                              {visit.shelterEmail && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">{visit.shelterEmail}</span>
                                </div>
                              )}
                            </div>

                            <Button
                              onClick={() => setConfirmCancelId(visit.id)}
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancelar Visita
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Visits */}
            {cancelledVisits.length > 0 && (
              <div>
                <h3 className="text-2xl text-gray-900 mb-4">Visitas Canceladas</h3>
                <div className="space-y-4">
                  {cancelledVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-3">
                          <Building2 className="w-6 h-6 text-gray-500" />
                          <div>
                            <h4 className="text-lg text-gray-900">{visit.shelterName}</h4>
                            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm inline-block mt-1">
                              Cancelada
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(visit.visitDate).toLocaleDateString('pt-BR')} às {visit.visitTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {scheduledVisits.length === 0 && cancelledVisits.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Você ainda não agendou nenhuma visita</p>
                <p className="text-sm text-gray-400">
                  Explore os abrigos e agende uma visita para conhecer os pets
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-2xl text-gray-900 text-center mb-2">
                Cancelar Visita
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Você tem certeza que deseja cancelar esta visita?
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Atenção:</strong> O abrigo será notificado sobre o cancelamento.
                  Você pode agendar uma nova visita a qualquer momento.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setConfirmCancelId(null)}
                  variant="outline"
                  className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isCancelling}
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => handleCancelVisit(confirmCancelId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white"
                  disabled={isCancelling}
                >
                  {isCancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}