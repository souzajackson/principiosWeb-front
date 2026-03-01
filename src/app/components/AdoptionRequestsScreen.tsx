import { Heart, ArrowLeft, Search, User, LogOut, PawPrint, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { useState } from 'react';

export interface AdoptionRequest {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  petBreed: string;
  petAge: string;
  adopterName: string;
  adopterEmail: string;
  adopterPhone: string;
  adopterAddress: string;
  adopterCity: string;
  adopterState: string;
  requestDate: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Mock data - pets com solicitações
const mockRequests: AdoptionRequest[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Max',
    petImage: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXQlMjBhZG9wdGlvbnxlbnwxfHx8fDE3NzIwMjg1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Vira-lata',
    petAge: '2 anos',
    adopterName: 'Maria Santos',
    adopterEmail: 'maria.santos@email.com',
    adopterPhone: '(11) 99876-5432',
    adopterAddress: 'Rua das Palmeiras, 456',
    adopterCity: 'São Paulo',
    adopterState: 'SP',
    requestDate: '2026-02-25',
    message: 'Olá! Tenho muito interesse em adotar o Max. Tenho experiência com cães e uma casa com quintal. Trabalho em home office e terei bastante tempo para dedicar a ele.',
    status: 'pending'
  },
  {
    id: '2',
    petId: '1',
    petName: 'Max',
    petImage: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXQlMjBhZG9wdGlvbnxlbnwxfHx8fDE3NzIwMjg1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Vira-lata',
    petAge: '2 anos',
    adopterName: 'Carlos Oliveira',
    adopterEmail: 'carlos.oliveira@email.com',
    adopterPhone: '(11) 98765-1234',
    adopterAddress: 'Avenida Paulista, 1000',
    adopterCity: 'São Paulo',
    adopterState: 'SP',
    requestDate: '2026-02-26',
    message: 'Gostaria muito de adotar o Max. Moro sozinho em apartamento e procuro um companheiro. Tenho condições de cuidar bem dele.',
    status: 'pending'
  },
  {
    id: '3',
    petId: '4',
    petName: 'Mel',
    petImage: 'https://images.unsplash.com/photo-1622641269217-954d3163a1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBwb3J0cmFpdCUyMGN1dGV8ZW58MXx8fHwxNzcyMDI4NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Persa',
    petAge: '6 meses',
    adopterName: 'Ana Costa',
    adopterEmail: 'ana.costa@email.com',
    adopterPhone: '(11) 97654-3210',
    adopterAddress: 'Rua dos Gatos, 789',
    adopterCity: 'São Paulo',
    adopterState: 'SP',
    requestDate: '2026-02-27',
    message: 'Apaixonada por gatos! Tenho outros 2 gatos em casa que são super sociáveis. Mel seria muito bem-vinda na nossa família.',
    status: 'pending'
  },
  {
    id: '4',
    petId: '9',
    petName: 'Zeus',
    petImage: 'https://images.unsplash.com/photo-1706941528529-e08c40ae7f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodXNreSUyMGRvZyUyMGJsdWUlMjBleWVzfGVufDF8fHx8MTc3MjAwODkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Husky Siberiano',
    petAge: '2 anos',
    adopterName: 'Roberto Lima',
    adopterEmail: 'roberto.lima@email.com',
    adopterPhone: '(11) 96543-2109',
    adopterAddress: 'Rua do Campo, 321',
    adopterCity: 'São Paulo',
    adopterState: 'SP',
    requestDate: '2026-02-28',
    message: 'Sou corredor e busco um companheiro ativo. Tenho experiência com raças de alta energia e faço trilhas todo fim de semana. Zeus seria o parceiro perfeito!',
    status: 'pending'
  },
  {
    id: '5',
    petId: '9',
    petName: 'Zeus',
    petImage: 'https://images.unsplash.com/photo-1706941528529-e08c40ae7f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodXNreSUyMGRvZyUyMGJsdWUlMjBleWVzfGVufDF8fHx8MTc3MjAwODkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    petBreed: 'Husky Siberiano',
    petAge: '2 anos',
    adopterName: 'Família Ferreira',
    adopterEmail: 'familia.ferreira@email.com',
    adopterPhone: '(11) 95432-1098',
    adopterAddress: 'Rua da Alegria, 654',
    adopterCity: 'São Paulo',
    adopterState: 'SP',
    requestDate: '2026-02-28',
    message: 'Somos uma família de 4 pessoas com crianças de 8 e 10 anos. Temos casa com quintal grande e queremos um cão para fazer parte da família.',
    status: 'pending'
  }
];

// Agrupar solicitações por pet
const groupRequestsByPet = (requests: AdoptionRequest[]) => {
  const grouped = requests.reduce((acc, request) => {
    if (!acc[request.petId]) {
      acc[request.petId] = {
        petId: request.petId,
        petName: request.petName,
        petImage: request.petImage,
        petBreed: request.petBreed,
        petAge: request.petAge,
        requests: []
      };
    }
    acc[request.petId].requests.push(request);
    return acc;
  }, {} as Record<string, { petId: string; petName: string; petImage: string; petBreed: string; petAge: string; requests: AdoptionRequest[] }>);

  return Object.values(grouped);
};

interface AdoptionRequestsScreenProps {
  onBack: () => void;
  onSelectPet: (petId: string, petName: string, requests: AdoptionRequest[]) => void;
  onLogout: () => void;
}

export function AdoptionRequestsScreen({ onBack, onSelectPet, onLogout }: AdoptionRequestsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const petsWithRequests = groupRequestsByPet(mockRequests);
  
  const filteredPets = petsWithRequests.filter(pet => 
    pet.petName.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-4xl mb-2">Solicitações de Adoção</h2>
          <p className="text-xl opacity-90">
            Gerencie as solicitações recebidas para seus animais
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nome do pet..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl text-gray-900">{filteredPets.length}</p>
                <p className="text-sm text-gray-600">Pets com solicitações</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl text-gray-900">{mockRequests.length}</p>
                <p className="text-sm text-gray-600">Total de solicitações</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-3xl text-gray-900">
                  {mockRequests.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pets List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl text-gray-900">Animais com Solicitações</h3>
          </div>

          {filteredPets.length === 0 ? (
            <div className="p-12 text-center">
              <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum pet encontrado com solicitações</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPets.map((pet) => {
                const pendingCount = pet.requests.filter(r => r.status === 'pending').length;
                
                return (
                  <button
                    key={pet.petId}
                    onClick={() => onSelectPet(pet.petId, pet.petName, pet.requests)}
                    className="w-full p-6 hover:bg-gray-50 transition-colors flex items-center gap-6 text-left"
                  >
                    {/* Pet Image */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <ImageWithFallback
                        src={pet.petImage}
                        alt={pet.petName}
                        className="w-full h-full object-cover"
                      />
                      {pendingCount > 0 && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">{pendingCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Pet Info */}
                    <div className="flex-1">
                      <h4 className="text-xl text-gray-900 mb-1">{pet.petName}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {pet.petBreed} • {pet.petAge}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-900">
                          <strong>{pet.requests.length}</strong> {pet.requests.length === 1 ? 'solicitação' : 'solicitações'}
                        </span>
                        {pendingCount > 0 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
