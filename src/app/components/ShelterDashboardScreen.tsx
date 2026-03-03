import { Heart, User, LogOut, Search, Plus, PawPrint, Edit, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import type { Pet } from './PetDetailsScreen';

interface ShelterDashboardScreenProps {
  onLogout: () => void;
  onSelectPet: (pet: Pet) => void;
  onAddPet: () => void;
  onGoToProfile: () => void;
  shelterPets: Pet[];
}

export function ShelterDashboardScreen({ 
  onLogout, 
  onSelectPet, 
  onAddPet, 
  onGoToProfile,
  shelterPets 
}: ShelterDashboardScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'dogs' | 'cats'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGender, setSelectedGender] = useState<'all' | 'Macho' | 'Fêmea'>('all');
  const [selectedSize, setSelectedSize] = useState<'all' | 'Pequeno' | 'Médio' | 'Grande'>('all');

  const filteredPets = shelterPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'dogs' && pet.type === 'Cachorro') ||
                           (selectedCategory === 'cats' && pet.type === 'Gato');
    
    const matchesGender = selectedGender === 'all' || pet.gender === selectedGender;
    const matchesSize = selectedSize === 'all' || pet.size === selectedSize;
    
    return matchesSearch && matchesCategory && matchesGender && matchesSize;
  });

  const totalDogs = shelterPets.filter(p => p.type === 'Cachorro').length;
  const totalCats = shelterPets.filter(p => p.type === 'Gato').length;

  const clearFilters = () => {
    setSelectedGender('all');
    setSelectedSize('all');
  };

  const activeFiltersCount = [selectedGender, selectedSize].filter(f => f !== 'all').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" fill="currentColor" />
              <h1 className="text-xl text-purple-600">PetConnect</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <User className="w-6 h-6 text-gray-600" />
                </button>
                
                {/* Dropdown Menu */}
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
                          onGoToProfile();
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Meu Perfil
                      </button>
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
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl mb-2">Meus Animais</h2>
              <p className="text-xl opacity-90">
                Gerencie todos os animais do seu abrigo
              </p>
            </div>
            <Button
              onClick={onAddPet}
              className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3"
            >
              <Plus className="w-5 h-5 mr-2" />
              Cadastrar Animal
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-3xl text-gray-900">{shelterPets.length}</p>
                <p className="text-sm text-gray-600">Total de Animais</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐕</span>
              </div>
              <div>
                <p className="text-3xl text-gray-900">{totalDogs}</p>
                <p className="text-sm text-gray-600">Cachorros</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐱</span>
              </div>
              <div>
                <p className="text-3xl text-gray-900">{totalCats}</p>
                <p className="text-sm text-gray-600">Gatos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou raça..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({shelterPets.length})
              </button>
              <button
                onClick={() => setSelectedCategory('dogs')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'dogs'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🐕 Cachorros ({totalDogs})
              </button>
              <button
                onClick={() => setSelectedCategory('cats')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'cats'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🐱 Gatos ({totalCats})
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? 'border-purple-600 bg-purple-50 text-purple-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 text-white rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">Filtros Avançados:</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gender Filter */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Sexo</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos</option>
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Porte</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
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

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredPets.length} {filteredPets.length === 1 ? 'animal encontrado' : 'animais encontrados'}
        </div>

        {/* Pets Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onSelectPet(pet)}
              >
                {/* Pet Image */}
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <ImageWithFallback
                    src={pet.imageUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                      {pet.type}
                    </span>
                  </div>
                </div>

                {/* Pet Info */}
                <div className="p-4">
                  <h3 className="text-xl text-gray-900 mb-2">{pet.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>🐾 {pet.breed}</p>
                    <p>🎂 {pet.age}</p>
                    <p>⚧ {pet.gender}</p>
                    {pet.size && <p>📏 {pet.size}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <PawPrint className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum animal encontrado</p>
            <p className="text-sm text-gray-400 mb-6">
              {searchTerm 
                ? 'Tente ajustar sua busca ou filtros'
                : 'Comece cadastrando seu primeiro animal'
              }
            </p>
            {!searchTerm && shelterPets.length === 0 && (
              <Button
                onClick={onAddPet}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Animal
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}