import { Heart, MapPin, Search, User, LogOut, Building2, Phone, Mail, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import type { Shelter } from './ScheduleVisitModal';
import { useState } from 'react';

// Dados de exemplo de abrigos
const mockShelters: Shelter[] = [
  {
    id: '1',
    name: 'Abrigo Patinhas Felizes',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    phone: '(11) 98765-4321',
    email: 'contato@patinhasfelizes.org.br',
    description: 'O Abrigo Patinhas Felizes é uma organização sem fins lucrativos dedicada ao resgate, cuidado e adoção responsável de animais abandonados. Com mais de 15 anos de experiência, já ajudamos milhares de animals a encontrarem lares amorosos. Nossa equipe de veterinários e voluntários trabalha incansavelmente para garantir o bem-estar de cada animal.',
    photoUrl: 'https://images.unsplash.com/photo-1591322447626-589ac8ad0c29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzcyMDU2MzM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    animalsCount: 87,
    availableDogs: 45,
    availableCats: 42,
    workingHours: 'Segunda a Sábado, 9h às 18h',
    foundedYear: 2009
  },
  {
    id: '2',
    name: 'Casa dos Gatos',
    address: 'Avenida Central, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    phone: '(21) 97654-3210',
    email: 'adocao@casadosgatos.com.br',
    description: 'Somos um abrigo especializado no resgate e adoção de gatos. Nossa missão é proporcionar um ambiente seguro e acolhedor para felinos abandonados ou resgatados. Oferecemos cuidados veterinários completos, incluindo vacinação, castração e tratamento de doenças. Todos os nossos gatos são socializados e preparados para a vida em família.',
    photoUrl: 'https://images.unsplash.com/photo-1763130063654-667be23d5c4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjBjYXJlJTIwY2VudGVyfGVufDF8fHx8MTc3MjE1OTU5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    animalsCount: 62,
    availableDogs: 8,
    availableCats: 54,
    workingHours: 'Terça a Domingo, 10h às 17h',
    foundedYear: 2012
  },
  {
    id: '3',
    name: 'Refúgio Animal',
    address: 'Rua dos Animais, 789',
    city: 'Belo Horizonte',
    state: 'MG',
    phone: '(31) 96543-2109',
    email: 'refugio@animalbh.org.br',
    description: 'O Refúgio Animal BH é uma instituição comprometida com a causa animal. Resgatamos, reabilitamos e encaminhamos para adoção cães e gatos de todas as idades e raças. Contamos com instalações modernas, área de recreação e uma equipe dedicada de profissionais e voluntários. Promovemos também campanhas de conscientização sobre posse responsável.',
    photoUrl: 'https://images.unsplash.com/photo-1699791910411-6c9ea7f47b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGZhY2FkZXxlbnwxfHx8fDE3NzIwOTgzMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    animalsCount: 103,
    availableDogs: 58,
    availableCats: 45,
    workingHours: 'Segunda a Sexta, 8h às 17h',
    foundedYear: 2010
  },
  {
    id: '4',
    name: 'Lar dos Bichos',
    address: 'Praça da Esperança, 321',
    city: 'Curitiba',
    state: 'PR',
    phone: '(41) 95432-1098',
    email: 'adocao@lardosbichos.com.br',
    description: 'O Lar dos Bichos é mais do que um abrigo, é um verdadeiro lar temporário para animais que esperam por uma segunda chance. Oferecemos atendimento veterinário gratuito, programa de apadrinhamento e feiras de adoção mensais. Nossa filosofia é baseada no amor, respeito e cuidado individualizado para cada animal.',
    photoUrl: 'https://images.unsplash.com/photo-1771607500173-c87fcddc5fcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjZW50ZXIlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzIxMTM3OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    animalsCount: 95,
    availableDogs: 52,
    availableCats: 43,
    workingHours: 'Segunda a Sábado, 9h às 18h',
    foundedYear: 2015
  },
  {
    id: '5',
    name: 'Proteção Animal',
    address: 'Rua do Carinho, 567',
    city: 'Porto Alegre',
    state: 'RS',
    phone: '(51) 94321-0987',
    email: 'contato@protecaoanimal.org',
    description: 'A Proteção Animal é uma ONG que atua no resgate e proteção de animais em situação de risco. Mantemos um abrigo com capacidade para mais de 100 animais, todos recebendo alimentação adequada, cuidados médicos e muito amor. Trabalhamos em parceria com clínicas veterinárias e promovemos eventos de adoção regularmente.',
    photoUrl: 'https://images.unsplash.com/photo-1770548037928-a29bfacc84ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzcyMTU5NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    animalsCount: 118,
    availableDogs: 63,
    availableCats: 55,
    workingHours: 'Terça a Domingo, 10h às 18h',
    foundedYear: 2008
  }
];

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
  
  // Filter states
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  const filteredShelters = mockShelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === 'all' || shelter.city === selectedCity;
    const matchesState = selectedState === 'all' || shelter.state === selectedState;
    
    return matchesSearch && matchesCity && matchesState;
  });

  // Get unique cities and states
  const cities = Array.from(new Set(mockShelters.map(s => s.city)));
  const states = Array.from(new Set(mockShelters.map(s => s.state)));

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
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
              <h1 className="text-2xl text-purple-600">AnimalConnect</h1>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={onBackToAnimals}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Animals
              </button>
              <button className="text-purple-600 border-b-2 border-purple-600 pb-1">
                Abrigos
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar abrigos por nome ou localização..."
                  className="pl-10 w-full"
                />
              </div>
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

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar abrigos..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 flex gap-4">
            <button
              onClick={onBackToAnimals}
              className="flex-1 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              Animals
            </button>
            <button className="flex-1 py-2 text-purple-600 border-b-2 border-purple-600">
              Abrigos
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">Conheça os Abrigos Parceiros</h2>
          <p className="text-xl opacity-90">
            Visite pessoalmente e conheça os animais disponíveis para adoção
          </p>
        </div>
      </div>

      {/* Shelters Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl text-gray-900">Abrigos cadastrados</h3>
          <p className="text-gray-600">{mockShelters.length} abrigos encontrados</p>
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

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-gray-900">Filtrar por:</h3>
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
                {/* City Filter */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Cidade</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todas</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* State Filter */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Estado</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredShelters.length} {filteredShelters.length === 1 ? 'abrigo encontrado' : 'abrigos encontrados'}
        </div>

        {/* Shelters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map((shelter) => (
            <div
              key={shelter.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
            >
              {/* Shelter Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={shelter.photoUrl}
                  alt={shelter.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-white rounded-full shadow-md">
                  <span className="text-sm text-gray-700">{shelter.animalsCount} animals</span>
                </div>
              </div>

              {/* Shelter Info */}
              <div className="p-5">
                <div className="flex items-start gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xl text-gray-900 mb-1">{shelter.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{shelter.city}, {shelter.state}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {shelter.description}
                </p>

                {/* Stats */}
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

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{shelter.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{shelter.email}</span>
                  </div>
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
      </div>
    </div>
  );
}