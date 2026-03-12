import {
  Heart, ArrowLeft, User, Mail, Calendar,
  CheckCircle, XCircle, MessageSquare, PawPrint
} from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { approveAdoption, rejectAdoption, getUserById, type Adoption, type UserProfile } from '../../services/ApiService';
import type { PetAdoptionGroup } from './AdoptionRequestsScreen';

interface AdoptionRequestDetailsScreenProps {
  group: PetAdoptionGroup;
  onBack: () => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  type: 'accept' | 'reject';
  adoption: Adoption | null;
  adopterName: string;
  adopterEmail: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, type, adoption, adopterName, adopterEmail, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen || !adoption) return null;

  const isAccept = type === 'accept';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isAccept ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isAccept
              ? <CheckCircle className="w-8 h-8 text-green-600" />
              : <XCircle className="w-8 h-8 text-red-600" />
            }
          </div>

          <h2 className="text-2xl text-gray-900 text-center mb-2">
            {isAccept ? 'Aceitar Solicitação' : 'Recusar Solicitação'}
          </h2>

          <p className="text-gray-600 text-center mb-6">
            {isAccept
              ? `Você está prestes a aceitar a solicitação de adoção de ${adopterName}.`
              : `Você está prestes a recusar a solicitação de adoção de ${adopterName}.`
            }
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Solicitante</p>
                <p className="text-gray-900">{adopterName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="text-gray-900">{adopterEmail}</p>
              </div>
            </div>
          </div>

          {isAccept ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Próximos passos:</strong> Entre em contato com o adotante para agendar uma entrevista e visita domiciliar antes de finalizar o processo de adoção.
              </p>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita. O solicitante será notificado sobre a recusa.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 py-3 text-white ${
                isAccept ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isAccept ? 'Confirmar Aceite' : 'Confirmar Recusa'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdoptionRequestDetailsScreen({
  group,
  onBack,
}: AdoptionRequestDetailsScreenProps) {
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(null);
  const [modalType, setModalType] = useState<'accept' | 'reject'>('accept');
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Local status overrides so the UI updates immediately after API call
  const [localStatuses, setLocalStatuses] = useState<Record<number, Adoption['status']>>({});

  // Mapa userId → UserProfile, carregado ao montar
  const [usersMap, setUsersMap] = useState<Record<number, UserProfile>>({});
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    if (!group?.adoptions?.length) {
      setUsersLoading(false);
      return;
    }
    const uniqueIds = [...new Set(group.adoptions.map(a => a.userId))];
    Promise.allSettled(uniqueIds.map(id => getUserById(id)))
      .then(results => {
        const map: Record<number, UserProfile> = {};
        results.forEach((res, i) => {
          if (res.status === 'fulfilled') map[uniqueIds[i]] = res.value;
        });
        setUsersMap(map);
      })
      .finally(() => setUsersLoading(false));
  }, [group]);

  const adoptions = (group?.adoptions ?? []).map(a => ({
    ...a,
    status: localStatuses[a.id] ?? a.status,
  }));

  const pendingAdoptions  = adoptions.filter(a => a.status === 'PENDING');
  const approvedAdoptions = adoptions.filter(a => a.status === 'APPROVED');
  const rejectedAdoptions = adoptions.filter(a => a.status === 'REJECTED');

  const handleAcceptClick = (adoption: Adoption) => {
    setSelectedAdoption(adoption);
    setModalType('accept');
    setActionError(null);
    setShowModal(true);
  };

  const handleRejectClick = (adoption: Adoption) => {
    setSelectedAdoption(adoption);
    setModalType('reject');
    setActionError(null);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedAdoption) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (modalType === 'accept') {
        await approveAdoption(selectedAdoption.id);
        setLocalStatuses(prev => ({ ...prev, [selectedAdoption.id]: 'APPROVED' }));
      } else {
        await rejectAdoption(selectedAdoption.id);
        setLocalStatuses(prev => ({ ...prev, [selectedAdoption.id]: 'REJECTED' }));
      }
      setShowModal(false);
      setSelectedAdoption(null);
    } catch {
      setActionError('Não foi possível processar a solicitação. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedAdoption(null);
    setActionError(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <div className="flex-1 flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" fill="currentColor" />
              <h1 className="text-xl text-purple-600">PetConnect</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">
            Solicitações para{' '}
            <span className="text-purple-600">{group?.animalName}</span>
          </h2>
          <p className="text-gray-600">
            {adoptions.length}{' '}
            {adoptions.length === 1 ? 'solicitação recebida' : 'solicitações recebidas'}
          </p>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
            {actionError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-2xl text-yellow-800 mb-1">{pendingAdoptions.length}</p>
            <p className="text-sm text-yellow-700">Pendentes</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-2xl text-green-800 mb-1">{approvedAdoptions.length}</p>
            <p className="text-sm text-green-700">Aceitas</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-2xl text-red-800 mb-1">{rejectedAdoptions.length}</p>
            <p className="text-sm text-red-700">Recusadas</p>
          </div>
        </div>

        {/* Loading usuários */}
        {usersLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Pending */}
        {!usersLoading && pendingAdoptions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl text-gray-900 mb-4">Solicitações Pendentes</h3>
            <div className="space-y-4">
              {pendingAdoptions.map((adoption) => {
                const name  = usersMap[adoption.userId]?.name  ?? `Usuário #${adoption.userId}`;
                const email = usersMap[adoption.userId]?.email ?? '—';
                return (
                  <div key={adoption.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-lg text-gray-900">{name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(adoption.date)}</span>
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Pendente
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{email}</span>
                      </div>

                      {/* Animal info */}
                      {adoption.animal && (
                        <div className="flex items-center gap-2 text-sm mb-4 bg-purple-50 rounded-lg px-3 py-2">
                          <PawPrint className="w-4 h-4 text-purple-500" />
                          <span className="text-purple-800">
                            {adoption.animal.name}
                            {adoption.animal.breed ? ` · ${adoption.animal.breed}` : ''}
                          </span>
                        </div>
                      )}

                      {/* Fallback message slot */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-500">Solicitação #{adoption.id}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {name} demonstrou interesse em adotar este animal. Entre em contato pelo e-mail para dar continuidade ao processo.
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleRejectClick(adoption)}
                          variant="outline"
                          disabled={actionLoading}
                          className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Recusar
                        </Button>
                        <Button
                          onClick={() => handleAcceptClick(adoption)}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Approved */}
        {!usersLoading && approvedAdoptions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl text-gray-900 mb-4">Solicitações Aceitas</h3>
            <div className="space-y-4">
              {approvedAdoptions.map((adoption) => {
                const name  = usersMap[adoption.userId]?.name  ?? `Usuário #${adoption.userId}`;
                const email = usersMap[adoption.userId]?.email ?? '—';
                return (
                  <div key={adoption.id} className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-lg text-gray-900">{name}</h4>
                            <p className="text-sm text-gray-600">{email}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                          Aceita
                        </span>
                      </div>
                      <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          ✅ Entre em contato com {name} em <strong>{email}</strong> para dar continuidade ao processo.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rejected */}
        {!usersLoading && rejectedAdoptions.length > 0 && (
          <div>
            <h3 className="text-xl text-gray-900 mb-4">Solicitações Recusadas</h3>
            <div className="space-y-4">
              {rejectedAdoptions.map((adoption) => {
                const name  = usersMap[adoption.userId]?.name  ?? `Usuário #${adoption.userId}`;
                const email = usersMap[adoption.userId]?.email ?? '—';
                return (
                  <div key={adoption.id} className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-lg text-gray-900">{name}</h4>
                            <p className="text-sm text-gray-600">{email}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                          Recusada
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty */}
        {!usersLoading && adoptions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma solicitação encontrada</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ConfirmModal
        isOpen={showModal}
        type={modalType}
        adoption={selectedAdoption}
        adopterName={selectedAdoption ? (usersMap[selectedAdoption.userId]?.name ?? `Usuário #${selectedAdoption.userId}`) : ''}
        adopterEmail={selectedAdoption ? (usersMap[selectedAdoption.userId]?.email ?? '—') : ''}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}