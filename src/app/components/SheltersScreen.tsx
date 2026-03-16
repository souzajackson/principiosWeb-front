import { Heart, MapPin, Search, User, LogOut, Building2, Phone, Mail, Filter, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import type { Shelter } from './ScheduleVisitModal';
import { useState, useEffect } from 'react';
import { getAllShelters } from '../../services/ShelterService';

interface SheltersScreenProps {
  onLogout: () => void;
  onSelectShelter: (shelter: Shelter) => void;
  onBackToAnimals: () => void;
  onGoToProfile: () => void;
}

export function SheltersScreen({ onLogout, onSelectShelter, onBackToAnimals, onGoToProfile }: SheltersScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  // ─── Estado para dados do backend ────────────────────────────────────────────
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Buscar abrigos do backend ────────────────────────────────────────────────
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    getAllShelters()
      .then(apiShelters => {
        // Mapeia o tipo simples do backend para o tipo completo da UI
        // Campos ausentes na API recebem valores padrão
        const mapped: Shelter[] = apiShelters.map(s => ({
          id: String(s.id),
          name: s.name,
          address: s.address ?? '',
          city: '',     // não existe no backend
          state: '',    // não existe no backend
          phone: s.phone ?? '',
          email: '',
          description: '',
          photoUrl: '',
          animalsCount: 0,
          availableDogs: 0,
          availableCats: 0,
          workingHours: '',
          foundedYear: 0,
        }));
        setShelters(mapped);
      })
      .catch(() => setError('Não foi possível carregar os abrigos. Tente novamente.'))
      .finally(() => setIsLoading(false));
  }, []);

  // ─── Filtragem ────────────────────────────────────────────────────────────────
  const filteredShelters = shelters.filter(shelter =>
    shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shelter.phone.includes(searchTerm)
  );

  const cities  = Array.from(new Set(shelters.map(s => s.city).filter(Boolean)));
  const states  = Array.from(new Set(shelters.map(s => s.state).filter(Boolean)));

  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedState('all');
  };

  const activeFiltersCount = [selectedCity, selectedState].filter(f => f !== 'all').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
              <h1 className="text-2xl text-purple-600">PetConnect</h1>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={onBackToAnimals} className="text-gray-600 hover:text-purple-600 transition-colors">
                Animals
              </button>
              <button className="text-purple-600 border-b-2 border-purple-600 pb-1">
                Abrigos
              </button>
            </div>

            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input type="text" placeholder="Buscar abrigos por nome ou localização..." className="pl-10 w-full" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <User className="w-6 h-6 text-gray-600" />
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <button
                        onClick={() => { setShowUserMenu(false); onGoToProfile(); }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" /> Meu Perfil
                      </button>
                      <button
                        onClick={() => { setShowUserMenu(false); onLogout(); }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Buscar abrigos..." className="pl-10 w-full" />
            </div>
          </div>

          <div className="md:hidden pb-4 flex gap-4">
            <button onClick={onBackToAnimals} className="flex-1 py-2 text-gray-600 hover:text-purple-600 transition-colors">
              Animals
            </button>
            <button className="flex-1 py-2 text-purple-600 border-b-2 border-purple-600">
              Abrigos
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">Conheça os Abrigos Parceiros</h2>
          <p className="text-xl opacity-90">Visite pessoalmente e conheça os animais disponíveis para adoção</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl text-gray-900">Abrigos cadastrados</h3>
          {!isLoading && !error && (
            <p className="text-gray-600">{shelters.length} abrigos encontrados</p>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar abrigo por nome, descrição ou endereço..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                showFilters || activeFiltersCount > 0
                  ? 'border-purple-600 bg-purple-50 text-purple-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">Filtrar por:</h3>
                {activeFiltersCount > 0 && (
                  <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-700">
                    Limpar filtros
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Cidade</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todas</option>
                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Estado</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos</option>
                    {states.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Estados de loading / erro / vazio ─── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
            <p>Carregando abrigos...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-red-500">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {filteredShelters.length} {filteredShelters.length === 1 ? 'abrigo encontrado' : 'abrigos encontrados'}
            </div>

            {filteredShelters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Building2 className="w-12 h-12 mb-4" />
                <p className="text-lg">Nenhum abrigo encontrado</p>
                <p className="text-sm mt-1">Tente ajustar os filtros ou o termo de busca</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShelters.map((shelter) => (
                  <div
                    key={shelter.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    {/* Imagem — exibe placeholder se photoUrl vier vazio */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      {shelter.photoUrl ? (
                        <ImageWithFallback
                          src={shelter.photoUrl}
                          alt={shelter.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-50">
                          <Building2 className="w-16 h-16 text-purple-200" />
                        </div>
                      )}
                      {shelter.animalsCount > 0 && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full shadow-md">
                          <span className="text-sm text-gray-700">{shelter.animalsCount} animais</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <h4 className="text-xl text-gray-900">{shelter.name}</h4>
                        </div>
                        {shelter.address && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{shelter.address}</span>
                          </div>
                        )}
                      </div>

                      {shelter.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{shelter.description}</p>
                      )}

                      {(shelter.availableDogs > 0 || shelter.availableCats > 0) && (
                        <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex-1 text-center">
                            <p className="text-lg text-purple-600">{shelter.availableDogs}</p>
                            <p className="text-xs text-gray-500">Cães</p>
                          </div>
                          <div className="flex-1 text-center">
                            <p className="text-lg text-purple-600">{shelter.availableCats}</p>
                            <p className="text-xs text-gray-500">Gatos</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        {shelter.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{shelter.phone}</span>
                          </div>
                        )}
                        {shelter.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{shelter.email}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => onSelectShelter(shelter)}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
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