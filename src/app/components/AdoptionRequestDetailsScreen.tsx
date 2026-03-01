import { Heart, ArrowLeft, User, Mail, Phone, MapPin, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import type { AdoptionRequest } from './AdoptionRequestsScreen';

interface AdoptionRequestDetailsScreenProps {
  petName: string;
  requests: AdoptionRequest[];
  onBack: () => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  type: 'accept' | 'reject';
  request: AdoptionRequest | null;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, type, request, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen || !request) return null;

  const isAccept = type === 'accept';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isAccept ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isAccept ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl text-gray-900 text-center mb-2">
            {isAccept ? 'Aceitar Solicitação' : 'Recusar Solicitação'}
          </h2>

          <p className="text-gray-600 text-center mb-6">
            {isAccept
              ? `Você está prestes a aceitar a solicitação de adoção de ${request.adopterName}.`
              : `Você está prestes a recusar a solicitação de adoção de ${request.adopterName}.`
            }
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Solicitante</p>
                <p className="text-gray-900">{request.adopterName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">E-mail</p>
                <p className="text-gray-900">{request.adopterEmail}</p>
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
                isAccept
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
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
  petName,
  requests,
  onBack,
  onAcceptRequest,
  onRejectRequest
}: AdoptionRequestDetailsScreenProps) {
  const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  const [modalType, setModalType] = useState<'accept' | 'reject'>('accept');
  const [showModal, setShowModal] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, 'pending' | 'accepted' | 'rejected'>>(
    requests.reduce((acc, req) => ({ ...acc, [req.id]: req.status }), {})
  );

  const handleAcceptClick = (request: AdoptionRequest) => {
    setSelectedRequest(request);
    setModalType('accept');
    setShowModal(true);
  };

  const handleRejectClick = (request: AdoptionRequest) => {
    setSelectedRequest(request);
    setModalType('reject');
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedRequest) {
      if (modalType === 'accept') {
        setRequestStatuses(prev => ({ ...prev, [selectedRequest.id]: 'accepted' }));
        onAcceptRequest(selectedRequest.id);
      } else {
        setRequestStatuses(prev => ({ ...prev, [selectedRequest.id]: 'rejected' }));
        onRejectRequest(selectedRequest.id);
      }
      setShowModal(false);
      setSelectedRequest(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const pendingRequests = requests.filter(r => requestStatuses[r.id] === 'pending');
  const acceptedRequests = requests.filter(r => requestStatuses[r.id] === 'accepted');
  const rejectedRequests = requests.filter(r => requestStatuses[r.id] === 'rejected');

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
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">
            Solicitações para <span className="text-purple-600">{petName}</span>
          </h2>
          <p className="text-gray-600">
            {requests.length} {requests.length === 1 ? 'solicitação recebida' : 'solicitações recebidas'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-2xl text-yellow-800 mb-1">{pendingRequests.length}</p>
            <p className="text-sm text-yellow-700">Pendentes</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-2xl text-green-800 mb-1">{acceptedRequests.length}</p>
            <p className="text-sm text-green-700">Aceitas</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-2xl text-red-800 mb-1">{rejectedRequests.length}</p>
            <p className="text-sm text-red-700">Recusadas</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl text-gray-900 mb-4">Solicitações Pendentes</h3>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-lg text-gray-900">{request.adopterName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(request.requestDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Pendente
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{request.adopterEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{request.adopterPhone}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">
                        {request.adopterAddress}, {request.adopterCity} - {request.adopterState}
                      </span>
                    </div>

                    {/* Message */}
                    {request.message && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-sm text-gray-600">Mensagem</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{request.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleRejectClick(request)}
                        variant="outline"
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Recusar
                      </Button>
                      <Button
                        onClick={() => handleAcceptClick(request)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aceitar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl text-gray-900 mb-4">Solicitações Aceitas</h3>
            <div className="space-y-4">
              {acceptedRequests.map((request) => (
                <div key={request.id} className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg text-gray-900">{request.adopterName}</h4>
                          <p className="text-sm text-gray-600">{request.adopterEmail}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                        Aceita
                      </span>
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        ✅ Entre em contato com {request.adopterName} em {request.adopterPhone} para dar continuidade ao processo.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <div>
            <h3 className="text-xl text-gray-900 mb-4">Solicitações Recusadas</h3>
            <div className="space-y-4">
              {rejectedRequests.map((request) => (
                <div key={request.id} className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-lg text-gray-900">{request.adopterName}</h4>
                          <p className="text-sm text-gray-600">{request.adopterEmail}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">
                        Recusada
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No requests */}
        {requests.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma solicitação encontrada</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        type={modalType}
        request={selectedRequest}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
