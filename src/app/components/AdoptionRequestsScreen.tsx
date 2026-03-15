import { Heart, ArrowLeft, Search, User, LogOut, PawPrint, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { useState, useEffect, useMemo } from 'react';
import { Adoption, getMyShelterAdoptions } from '@/services/AdoptionService';

export interface AnimalAdoptionGroup {
  animalId: number;
  animalName: string;
  animalImage?: string;
  animalBreed?: string;
  animalAge?: string;
  adoptions: Adoption[];
}

interface AdoptionRequestsScreenProps {
  onBack: () => void;
  onSelectAnimal: (group: AnimalAdoptionGroup) => void;
  onLogout: () => void;
}

export function AdoptionRequestsScreen({ onBack, onSelectAnimal, onLogout }: AdoptionRequestsScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdoptions() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMyShelterAdoptions();

        setAdoptions(data);
      } catch {
        setError('Não foi possível carregar as solicitações. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchAdoptions();
  }, []);

  // Agrupa adoções por animal
  const animalGroups = useMemo<AnimalAdoptionGroup[]>(() => {
    const map = new Map<number, AnimalAdoptionGroup>();
    for (const adoption of adoptions) {
      const id = adoption.animalId;
      if (!map.has(id)) {
        map.set(id, {
          animalId: id,
          animalName: adoption.animal?.name ?? `Animal #${id}`,
          animalImage: adoption.animal?.photoUrl,
          animalBreed: adoption.animal?.breed,
          animalAge: adoption.animal?.age,
          adoptions: [],
        });
      }
      map.get(id)!.adoptions.push(adoption);
    }
    return Array.from(map.values());
  }, [adoptions]);

  const filteredGroups = animalGroups.filter(g =>
    g.animalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPending = adoptions.filter(a => a.status === 'PENDING').length;

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
          <h2 className="text-4xl mb-2">Solicitações de Adoção</h2>
          <p className="text-xl opacity-90">Gerencie as solicitações recebidas para seus animais</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
            {/* Search */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome do animal..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <PawPrint className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl text-gray-900">{animalGroups.length}</p>
                  <p className="text-sm text-gray-600">Animais com solicitações</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl text-gray-900">{adoptions.length}</p>
                  <p className="text-sm text-gray-600">Total de solicitações</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <p className="text-3xl text-gray-900">{totalPending}</p>
                  <p className="text-sm text-gray-600">Pendentes</p>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl text-gray-900">Animais com Solicitações</h3>
              </div>

              {filteredGroups.length === 0 ? (
                <div className="p-12 text-center">
                  <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum animal encontrado com solicitações</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredGroups.map((group) => {
                    const pendingCount = group.adoptions.filter(a => a.status === 'PENDING').length;
                    return (
                      <button
                        key={group.animalId}
                        onClick={() => onSelectAnimal(group)}
                        className="w-full p-6 hover:bg-gray-50 transition-colors flex items-center gap-6 text-left"
                      >
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {group.animalImage ? (
                            <ImageWithFallback src={group.animalImage} alt={group.animalName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <PawPrint className="w-10 h-10 text-gray-400" />
                            </div>
                          )}
                          {pendingCount > 0 && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">{pendingCount}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl text-gray-900 mb-1">{group.animalName}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {[group.animalBreed, group.animalAge].filter(Boolean).join(' • ')}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-900">
                              <strong>{group.adoptions.length}</strong>{' '}
                              {group.adoptions.length === 1 ? 'solicitação' : 'solicitações'}
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
          </>
        )}
      </div>
    </div>
  );
}