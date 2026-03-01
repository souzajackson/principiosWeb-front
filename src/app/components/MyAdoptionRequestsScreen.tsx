import { Heart, ArrowLeft, User, LogOut, Calendar, Trash2, PawPrint, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { useState } from 'react';

export interface UserAdoptionRequest {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  petBreed: string;
  petAge: string;
  petGender: string;
  shelterName: string;
  requestDate: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
}

// Mock data - solicitações de adoção feitas pelo usuário
const mockUserRequests: UserAdoptionRequest[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Max',
    petImage: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXQlMjBhZG9wdGlvbnxlbnwxfHx8fDE3NzIwMjg1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Vira-lata',
    petAge: '2 anos',
    petGender: 'Macho',
    shelterName: 'Patinhas Felizes',
    requestDate: '2026-02-20',
    message: 'Olá! Tenho muito interesse em adotar o Max. Tenho experiência com cães e uma casa com quintal.',
    status: 'pending'
  },
  {
    id: '2',
    petId: '4',
    petName: 'Mel',
    petImage: 'https://images.unsplash.com/photo-1622641269217-954d3163a1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBwb3J0cmFpdCUyMGN1dGV8ZW58MXx8fHwxNzcyMDI4NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Persa',
    petAge: '6 meses',
    petGender: 'Fêmea',
    shelterName: 'Lar dos Bichos',
    requestDate: '2026-02-15',
    message: 'Apaixonada por gatos! Tenho experiência e um lar preparado para receber a Mel.',
    status: 'accepted'
  },
  {
    id: '3',
    petId: '7',
    petName: 'Thor',
    petImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzcyMDA4OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Golden Retriever',
    petAge: '3 anos',
    petGender: 'Macho',
    shelterName: 'Cão Amigo',
    requestDate: '2026-02-10',
    message: 'Procuro um companheiro para fazer parte da família. Temos espaço e muito amor para dar.',
    status: 'rejected'
  },
  {
    id: '4',
    petId: '2',
    petName: 'Luna',
    petImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjByZXNjdWUlMjBjZW50ZXJ8ZW58MXx8fHwxNzcyMDA4OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Labrador',
    petAge: '1 ano',
    petGender: 'Fêmea',
    shelterName: 'Patinhas Felizes',
    requestDate: '2026-02-25',
    message: 'Luna seria perfeita para nossa família! Temos dois filhos que adoram cachorros.',
    status: 'pending'
  }
];

interface MyAdoptionRequestsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function MyAdoptionRequestsScreen({ onBack, onLogout }: MyAdoptionRequestsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, 'pending' | 'accepted' | 'rejected' | 'cancelled'>>(
    mockUserRequests.reduce((acc, req) => ({ ...acc, [req.id]: req.status }), {})
  );
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const handleCancelRequest = (requestId: string) => {
    setRequestStatuses(prev => ({ ...prev, [requestId]: 'cancelled' }));
    setConfirmCancelId(null);
    alert('Solicitação cancelada com sucesso! ❌');
  };

  const pendingRequests = mockUserRequests.filter(r => requestStatuses[r.id] === 'pending');
  const acceptedRequests = mockUserRequests.filter(r => requestStatuses[r.id] === 'accepted');
  const rejectedRequests = mockUserRequests.filter(r => requestStatuses[r.id] === 'rejected');
  const cancelledRequests = mockUserRequests.filter(r => requestStatuses[r.id] === 'cancelled');

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
          <h2 className="text-4xl mb-2">Minhas Solicitações de Adoção</h2>
          <p className="text-xl opacity-90">
            Acompanhe o status das suas solicitações
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl text-gray-900">{pendingRequests.length}</p>
              <p className="text-xs text-gray-600 text-center">Pendentes</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl text-gray-900">{acceptedRequests.length}</p>
              <p className="text-xs text-gray-600 text-center">Aceitas</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-red-600 text-lg">✕</span>
              </div>
              <p className="text-2xl text-gray-900">{rejectedRequests.length}</p>
              <p className="text-xs text-gray-600 text-center">Recusadas</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Trash2 className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-2xl text-gray-900">{cancelledRequests.length}</p>
              <p className="text-xs text-gray-600 text-center">Canceladas</p>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl text-gray-900 mb-4">Aguardando Resposta</h3>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Pet Image */}
                      <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <ImageWithFallback
                          src={request.petImage}
                          alt={request.petName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Request Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-xl text-gray-900 mb-1">{request.petName}</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {request.petBreed} • {request.petAge} • {request.petGender}
                            </p>
                            <p className="text-sm text-purple-600">📍 {request.shelterName}</p>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            Pendente
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Solicitado em {new Date(request.requestDate).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                        </div>

                        <Button
                          onClick={() => setConfirmCancelId(request.id)}
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

        {/* Accepted Requests */}
        {acceptedRequests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl text-gray-900 mb-4">Solicitações Aceitas</h3>
            <div className="space-y-4">
              {acceptedRequests.map((request) => (
                <div key={request.id} className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                        <ImageWithFallback
                          src={request.petImage}
                          alt={request.petName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-gray-900 mb-1">{request.petName}</h4>
                        <p className="text-sm text-gray-600 mb-1">{request.shelterName}</p>
                        <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                          ✓ Aceita
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        🎉 <strong>Parabéns!</strong> Sua solicitação foi aceita! O abrigo entrará em contato em breve para os próximos passos.
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
          <div className="mb-8">
            <h3 className="text-2xl text-gray-900 mb-4">Solicitações Recusadas</h3>
            <div className="space-y-4">
              {rejectedRequests.map((request) => (
                <div key={request.id} className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <PawPrint className="w-6 h-6 text-gray-500" />
                      <div className="flex-1">
                        <h4 className="text-lg text-gray-900">{request.petName}</h4>
                        <p className="text-sm text-gray-600">{request.shelterName}</p>
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

        {/* Cancelled Requests */}
        {cancelledRequests.length > 0 && (
          <div>
            <h3 className="text-2xl text-gray-900 mb-4">Solicitações Canceladas</h3>
            <div className="space-y-4">
              {cancelledRequests.map((request) => (
                <div key={request.id} className="bg-gray-100 border border-gray-300 rounded-xl overflow-hidden opacity-60">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <Trash2 className="w-6 h-6 text-gray-500" />
                      <div className="flex-1">
                        <h4 className="text-lg text-gray-900">{request.petName}</h4>
                        <p className="text-sm text-gray-600">{request.shelterName}</p>
                      </div>
                      <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">
                        Cancelada
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {mockUserRequests.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Você ainda não fez nenhuma solicitação de adoção</p>
            <p className="text-sm text-gray-400">
              Explore os pets disponíveis e faça sua primeira solicitação
            </p>
          </div>
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
                Cancelar Solicitação
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Você tem certeza que deseja cancelar esta solicitação de adoção?
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Atenção:</strong> Esta ação não pode ser desfeita. Você poderá fazer uma nova solicitação posteriormente.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setConfirmCancelId(null)}
                  variant="outline"
                  className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Voltar
                </Button>
                <Button
                  onClick={() => handleCancelRequest(confirmCancelId)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmar Cancelamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
