import { Heart, ArrowLeft, User, LogOut, Calendar, Trash2, PawPrint, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { getMyAdoptions, deleteAdoption, type Adoption } from '../../services/ApiService';

interface MyAdoptionRequestsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function MyAdoptionRequestsScreen({ onBack, onLogout }: MyAdoptionRequestsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchAdoptions() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMyAdoptions();
        setAdoptions(data);

      } catch {
        setError('Não foi possível carregar suas solicitações. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchAdoptions();
  }, []);

  const handleCancel = async (adoptionId: number) => {
    setActionLoading(true);
    try {
      await deleteAdoption(adoptionId);
      setAdoptions(prev => prev.filter(a => a.id !== adoptionId));
    } catch {
      alert('Erro ao cancelar solicitação. Tente novamente.');
    } finally {
      setActionLoading(false);
      setConfirmCancelId(null);
    }
  };

  const pendingAdoptions  = adoptions.filter(a => a.status === 'PENDING');
  const approvedAdoptions = adoptions.filter(a => a.status === 'APPROVED');
  const rejectedAdoptions = adoptions.filter(a => a.status === 'REJECTED');

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" fill="currentColor" />
              <h1 className="text-xl text-purple-600">PetConnect</h1>
            </div>
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User className="w-6 h-6 text-gray-600" />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button onClick={() => { setShowUserMenu(false); onLogout(); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2">
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

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-2">Minhas Solicitações de Adoção</h2>
          <p className="text-xl opacity-90">Acompanhe o status das suas solicitações</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl text-gray-900">{pendingAdoptions.length}</p>
                <p className="text-xs text-gray-600 text-center">Pendentes</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl text-gray-900">{approvedAdoptions.length}</p>
                <p className="text-xs text-gray-600 text-center">Aceitas</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-red-600 text-lg">✕</span>
                </div>
                <p className="text-2xl text-gray-900">{rejectedAdoptions.length}</p>
                <p className="text-xs text-gray-600 text-center">Recusadas</p>
              </div>
            </div>

            {/* Pending */}
            {pendingAdoptions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl text-gray-900 mb-4">Aguardando Resposta</h3>
                <div className="space-y-4">
                  {pendingAdoptions.map((adoption) => (
                    <div key={adoption.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {adoption.animal?.image ? (
                              <ImageWithFallback src={adoption.animal.image} alt={adoption.animal.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PawPrint className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="text-xl text-gray-900 mb-1">
                                  {adoption.animal?.name ?? `Animal #${adoption.animalId}`}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {[adoption.animal?.breed, adoption.animal?.age, adoption.animal?.gender].filter(Boolean).join(' • ')}
                                </p>
                              </div>
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pendente</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                              <Calendar className="w-4 h-4" />
                              <span>Solicitado em {formatDate(adoption.createdAt)}</span>
                            </div>
                            <Button
                              onClick={() => setConfirmCancelId(adoption.id)}
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Cancelar Solicitação
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved */}
            {approvedAdoptions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl text-gray-900 mb-4">Solicitações Aceitas</h3>
                <div className="space-y-4">
                  {approvedAdoptions.map((adoption) => (
                    <div key={adoption.id} className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {adoption.animal?.image ? (
                              <ImageWithFallback src={adoption.animal.image} alt={adoption.animal.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <PawPrint className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg text-gray-900 mb-1">{adoption.animal?.name ?? `Animal #${adoption.animalId}`}</h4>
                            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">✓ Aceita</span>
                          </div>
                        </div>
                        <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            🎉 <strong>Parabéns!</strong> Sua solicitação foi aceita! O abrigo entrará em contato em breve.
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected */}
            {rejectedAdoptions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl text-gray-900 mb-4">Solicitações Recusadas</h3>
                <div className="space-y-4">
                  {rejectedAdoptions.map((adoption) => (
                    <div key={adoption.id} className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60">
                      <div className="p-6 flex items-center gap-4">
                        <PawPrint className="w-6 h-6 text-gray-500" />
                        <div className="flex-1">
                          <h4 className="text-lg text-gray-900">{adoption.animal?.name ?? `Animal #${adoption.animalId}`}</h4>
                        </div>
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">Recusada</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {adoptions.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Você ainda não fez nenhuma solicitação de adoção</p>
                <p className="text-sm text-gray-400">Explore os pets disponíveis e faça sua primeira solicitação</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {confirmCancelId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl text-gray-900 text-center mb-2">Cancelar Solicitação</h2>
            <p className="text-gray-600 text-center mb-6">
              Você tem certeza que deseja cancelar esta solicitação de adoção?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita. Você poderá fazer uma nova solicitação posteriormente.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setConfirmCancelId(null)} variant="outline" className="flex-1 py-3 border-gray-300" disabled={actionLoading}>
                Voltar
              </Button>
              <Button onClick={() => handleCancel(confirmCancelId)} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white" disabled={actionLoading}>
                {actionLoading ? 'Aguarde...' : 'Confirmar Cancelamento'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}