import { Heart, MapPin, Search, User, LogOut, Building2, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';
import { Animal, getAllAnimals } from '@/services/AnimalService';

interface HomeScreenProps {
  onLogout: () => void;
  onSelectAnimal: (animal: Animal) => void;
  onGoToShelters: () => void;
  onGoToProfile: () => void;
}

export function HomeScreen({ onLogout, onSelectAnimal, onGoToShelters, onGoToProfile }: HomeScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilters, setShowFilters]   = useState(false);
  const [searchTerm, setSearchTerm]     = useState('');
  const [animals, setAnimals]                 = useState<Animal[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'Cachorro' | 'Gato'>('all');
  const [selectedGender,  setSelectedGender]  = useState<'all' | 'Macho' | 'Fêmea'>('all');
  const [selectedSize,    setSelectedSize]    = useState<'all' | 'Pequeno' | 'Médio' | 'Grande'>('all');

  const fetchAnimals = () => {
    setLoading(true);
    setError(null);
    getAllAnimals()
      .then(setAnimals)
      .catch(() => setError('Não foi possível carregar os animais. Tente novamente.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnimals(); }, []);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
    const matchesGender  = selectedGender  === 'all' || animal.gender === selectedGender;
    const matchesSize    = selectedSize    === 'all' || animal.size   === selectedSize;

    return matchesSearch && matchesSpecies && matchesGender && matchesSize;
  });

  const clearFilters = () => {
    setSelectedSpecies('all');
    setSelectedGender('all');
    setSelectedSize('all');
  };

  const activeFiltersCount = [selectedSpecies, selectedGender, selectedSize].filter(f => f !== 'all').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
              <h1 className="text-2xl text-purple-600">AnimalConnect</h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button className="text-purple-600 border-b-2 border-purple-600 pb-1">Animals</button>
              <button onClick={onGoToShelters} className="text-gray-600 hover:text-purple-600 transition-colors">Abrigos</button>
            </div>

            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input type="text" placeholder="Buscar por nome, raça ou localização..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <User className="w-6 h-6 text-gray-600" />
              </button>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button onClick={() => { setShowUserMenu(false); onGoToProfile(); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2">
                      <User className="w-4 h-4" /> Meu Perfil
                    </button>
                    <button onClick={() => { setShowUserMenu(false); onLogout(); }} className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Buscar animals..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="md:hidden pb-4 flex gap-4">
            <button className="flex-1 py-2 text-purple-600 border-b-2 border-purple-600">Animals</button>
            <button onClick={onGoToShelters} className="flex-1 py-2 text-gray-600 hover:text-purple-600 transition-colors">Abrigos</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">Encontre seu novo melhor amigo</h2>
          <p className="text-xl opacity-90">Centenas de animals esperando por um lar cheio de amor e carinho</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl text-gray-900">Animals disponíveis para adoção</h3>
          {!loading && !error && <p className="text-gray-600">{animals.length} {animals.length === 1 ? 'animal encontrado' : 'animals encontrados'}</p>}
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Buscar por nome, raça ou localização..." className="pl-10 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${showFilters || activeFiltersCount > 0 ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-900">Filtrar por:</span>
                {activeFiltersCount > 0 && <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-700">Limpar filtros</button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Espécie</label>
                  <select value={selectedSpecies} onChange={(e) => setSelectedSpecies(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">Todos</option>
                    <option value="Cachorro">🐕 Cachorros</option>
                    <option value="Gato">🐱 Gatos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sexo</label>
                  <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">Todos</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Porte</label>
                  <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="all">Todos</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
            <p>Carregando animais disponíveis...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 mb-4">{error}</p>
            <button onClick={fetchAnimals} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Tentar novamente</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && animals.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="currentColor" />
            <p className="text-gray-500 text-lg mb-2">Nenhum animal disponível no momento</p>
            <p className="text-sm text-gray-400">Novos animais são cadastrados regularmente. Volte em breve!</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && animals.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animals encontrados'}
            </div>

            {filteredAnimals.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-2">Nenhum animal corresponde aos filtros selecionados</p>
                <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-700 underline">Limpar filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnimals.map((animal) => (
                  <div key={animal.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => onSelectAnimal(animal)}>
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      <ImageWithFallback src={animal.photoUrl} alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-purple-50 transition-colors">
                        <Heart className="w-5 h-5 text-purple-600" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-xl text-gray-900 mb-1">{animal.name}</h4>
                          <p className="text-sm text-gray-600">{animal.breed} • {animal.age} anos</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {animal.species === 'Cachorro' ? '🐕 Cão' : '🐱 Gato'}
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {animal.shelterName && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{animal.shelterName}</span>
                          </div>
                        )}
                        {animal.location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{animal.location}</span>
                          </div>
                        )}
                      </div>
                      <button className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}