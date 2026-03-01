import { Heart, MapPin, Search, User, LogOut, Building2, Filter, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import type { Pet } from './PetDetailsScreen';
import { useState } from 'react';
import { Button } from './ui/button';

// Dados de exemplo com informações completas
const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    type: 'dog',
    breed: 'Vira-lata',
    age: '2 anos',
    gender: 'Macho',
    size: 'Médio',
    shelterName: 'Abrigo Patinhas Felizes',
    location: 'São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXQlMjBhZG9wdGlvbnxlbnwxfHx8fDE3NzIwMjg1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Max é um cachorro super carinhoso e cheio de energia! Ele adora brincar, correr e fazer novos amigos. É ótimo com crianças e se adapta bem a ambientes familiares. Max foi resgatado das ruas e está procurando uma família que lhe dê todo o amor que ele merece.',
    personality: ['Brincalhão', 'Carinhoso', 'Energético', 'Sociável'],
    healthStatus: 'Excelente estado de saúde, sem problemas conhecidos.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(11) 98765-4321',
    shelterEmail: 'contato@patinhasfelizes.org.br'
  },
  {
    id: '2',
    name: 'Luna',
    type: 'cat',
    breed: 'Siamês',
    age: '1 ano',
    gender: 'Fêmea',
    size: 'Pequeno',
    shelterName: 'Casa dos Gatos',
    location: 'Rio de Janeiro, RJ',
    imageUrl: 'https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZG9yYWJsZSUyMGNhdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTk0MTE1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Luna é uma gatinha elegante e curiosa. Ela adora explorar, brincar com bolinhas e receber carinho. É muito comunicativa e fará questão de conversar com você! Perfeita para quem procura uma companheira carinhosa e cheia de personalidade.',
    personality: ['Curiosa', 'Vocal', 'Carinhosa', 'Inteligente'],
    healthStatus: 'Saudável, com check-up veterinário recente.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(21) 97654-3210',
    shelterEmail: 'adocao@casadosgatos.com.br'
  },
  {
    id: '3',
    name: 'Thor',
    type: 'dog',
    breed: 'Golden Retriever',
    age: '3 anos',
    gender: 'Macho',
    size: 'Grande',
    shelterName: 'Refúgio Animal',
    location: 'Belo Horizonte, MG',
    imageUrl: 'https://images.unsplash.com/photo-1734966213753-1b361564bab4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjByZXRyaWV2ZXIlMjBkb2d8ZW58MXx8fHwxNzcxOTgyODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Thor é um Golden Retriever dócil e extremamente leal. Ele adora nadar, buscar bolinhas e está sempre pronto para uma aventura. É muito paciente com crianças e outros animais. Um verdadeiro gigante gentil procurando um lar cheio de amor.',
    personality: ['Dócil', 'Leal', 'Paciente', 'Ativo'],
    healthStatus: 'Muito saudável, adora exercícios físicos.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(31) 96543-2109',
    shelterEmail: 'refugio@animalbh.org.br'
  },
  {
    id: '4',
    name: 'Mel',
    type: 'cat',
    breed: 'Persa',
    age: '6 meses',
    gender: 'Fêmea',
    size: 'Pequeno',
    shelterName: 'Abrigo Patinhas Felizes',
    location: 'São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1622641269217-954d3163a1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBwb3J0cmFpdCUyMGN1dGV8ZW58MXx8fHwxNzcyMDI4NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Mel é uma gatinha bebê cheia de fofura! Ela é brincalhona, adorável e está descobrindo o mundo. Adora carinho, cochiladas e brinquedinhos. Perfeita para quem quer acompanhar o crescimento de um filhote cheio de amor para dar.',
    personality: ['Brincalhona', 'Fofa', 'Doce', 'Curiosa'],
    healthStatus: 'Saudável, em crescimento normal.',
    vaccinated: true,
    neutered: false,
    shelterPhone: '(11) 98765-4321',
    shelterEmail: 'contato@patinhasfelizes.org.br'
  },
  {
    id: '5',
    name: 'Billy',
    type: 'dog',
    breed: 'Beagle',
    age: '4 anos',
    gender: 'Macho',
    size: 'Médio',
    shelterName: 'Lar dos Bichos',
    location: 'Curitiba, PR',
    imageUrl: 'https://images.unsplash.com/photo-1685387714439-edef4bd70ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFnbGUlMjBkb2clMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE5Nzg5MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Billy é um Beagle cheio de energia e sempre farejando novidades! Ele adora passear, explorar e seguir rastros interessantes. É um cão alegre, amigável e que se dá bem com outros pets. Ideal para famílias ativas.',
    personality: ['Curioso', 'Alegre', 'Amigável', 'Aventureiro'],
    healthStatus: 'Saudável e cheio de energia.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(41) 95432-1098',
    shelterEmail: 'adocao@lardosbichos.com.br'
  },
  {
    id: '6',
    name: 'Nina',
    type: 'cat',
    breed: 'Vira-lata',
    age: '2 anos',
    gender: 'Fêmea',
    size: 'Pequeno',
    shelterName: 'Casa dos Gatos',
    location: 'Rio de Janeiro, RJ',
    imageUrl: 'https://images.unsplash.com/photo-1768042230927-a3dbc38bbc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5ZnVsJTIwY2F0JTIwcGV0fGVufDF8fHx8MTc3MjAyODU0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Nina é uma gatinha independente mas muito carinhosa quando se sente à vontade. Ela adora lugares altos, brincar de caçar e receber cafuné. É perfeita para quem respeita o espaço dos felinos e quer uma companheira doce.',
    personality: ['Independente', 'Carinhosa', 'Observadora', 'Calma'],
    healthStatus: 'Excelente saúde.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(21) 97654-3210',
    shelterEmail: 'adocao@casadosgatos.com.br'
  },
  {
    id: '7',
    name: 'Bobby',
    type: 'dog',
    breed: 'Pug',
    age: '1 ano',
    gender: 'Macho',
    size: 'Pequeno',
    shelterName: 'Refúgio Animal',
    location: 'Belo Horizonte, MG',
    imageUrl: 'https://images.unsplash.com/photo-1690985210992-3a5f9e1aaaaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHB1cHB5JTIwZmFjZXxlbnwxfHx8fDE3NzIwMjg1NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Bobby é um Pug jovem e cheio de personalidade! Ele adora fazer gracinhas, receber atenção e está sempre de bom humor. É companheiro, carinhoso e perfeito para apartamentos. Um verdadeiro palhaço que vai alegrar seus dias.',
    personality: ['Divertido', 'Companheiro', 'Amoroso', 'Tranquilo'],
    healthStatus: 'Saudável, requer atenção com temperatura.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(31) 96543-2109',
    shelterEmail: 'refugio@animalbh.org.br'
  },
  {
    id: '8',
    name: 'Simba',
    type: 'cat',
    breed: 'Laranja',
    age: '3 anos',
    gender: 'Macho',
    size: 'Médio',
    shelterName: 'Lar dos Bichos',
    location: 'Curitiba, PR',
    imageUrl: 'https://images.unsplash.com/photo-1667518158890-0a6cf60de601?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjB0YWJieSUyMGNhdHxlbnwxfHx8fDE3NzIwMDQ2MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Simba é um gato laranja majestoso e confiante. Ele adora ser o centro das atenções e ronronar no colo de seus humanos favoritos. É brincalhão mas também aprecia uma boa soneca ao sol. Um rei procurando seu reino perfeito!',
    personality: ['Confiante', 'Carinhoso', 'Brincalhão', 'Majestoso'],
    healthStatus: 'Ótima saúde geral.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(41) 95432-1098',
    shelterEmail: 'adocao@lardosbichos.com.br'
  },
  {
    id: '9',
    name: 'Zeus',
    type: 'dog',
    breed: 'Husky Siberiano',
    age: '2 anos',
    gender: 'Macho',
    size: 'Grande',
    shelterName: 'Abrigo Patinhas Felizes',
    location: 'São Paulo, SP',
    imageUrl: 'https://images.unsplash.com/photo-1706941528529-e08c40ae7f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodXNreSUyMGRvZyUyMGJsdWUlMjBleWVzfGVufDF8fHx8MTc3MjAwODkzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Zeus é um Husky Siberiano lindo e atlético. Ele precisa de muito exercício e adora atividades ao ar livre. É inteligente, independente mas muito leal à sua família. Ideal para tutores experientes e ativos que possam acompanhar sua energia.',
    personality: ['Atlético', 'Inteligente', 'Leal', 'Independente'],
    healthStatus: 'Excelente condição física.',
    vaccinated: true,
    neutered: true,
    shelterPhone: '(11) 98765-4321',
    shelterEmail: 'contato@patinhasfelizes.org.br'
  },
];

interface HomeScreenProps {
  onLogout: () => void;
  onSelectPet: (pet: Pet) => void;
  onGoToShelters: () => void;
  onGoToProfile: () => void;
}

export function HomeScreen({ onLogout, onSelectPet, onGoToShelters, onGoToProfile }: HomeScreenProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'Macho' | 'Fêmea'>('all');
  const [selectedSize, setSelectedSize] = useState<'all' | 'Pequeno' | 'Médio' | 'Grande'>('all');
  const [selectedAge, setSelectedAge] = useState<'all' | 'young' | 'adult' | 'senior'>('all');

  const filteredPets = mockPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecies = selectedSpecies === 'all' || 
                          (selectedSpecies === 'dog' && pet.species === 'Cachorro') ||
                          (selectedSpecies === 'cat' && pet.species === 'Gato');
    
    const matchesGender = selectedGender === 'all' || pet.gender === selectedGender;
    
    const matchesSize = selectedSize === 'all' || pet.size === selectedSize;
    
    const matchesAge = selectedAge === 'all' || 
                      (selectedAge === 'young' && (pet.age.includes('meses') || pet.age.includes('mês') || pet.age === '1 ano')) ||
                      (selectedAge === 'adult' && (pet.age.includes('2 anos') || pet.age.includes('3 anos') || pet.age.includes('4 anos'))) ||
                      (selectedAge === 'senior' && (pet.age.includes('5 anos') || pet.age.includes('6 anos') || pet.age.includes('7 anos') || parseInt(pet.age) >= 5));
    
    return matchesSearch && matchesSpecies && matchesGender && matchesSize && matchesAge;
  });

  const clearFilters = () => {
    setSelectedSpecies('all');
    setSelectedGender('all');
    setSelectedSize('all');
    setSelectedAge('all');
  };

  const activeFiltersCount = [selectedSpecies, selectedGender, selectedSize, selectedAge].filter(f => f !== 'all').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-purple-600" fill="currentColor" />
              <h1 className="text-2xl text-purple-600">PetConnect</h1>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button className="text-purple-600 border-b-2 border-purple-600 pb-1">
                Pets
              </button>
              <button
                onClick={onGoToShelters}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Abrigos
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome, raça ou localização..."
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
                placeholder="Buscar pets..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 flex gap-4">
            <button className="flex-1 py-2 text-purple-600 border-b-2 border-purple-600">
              Pets
            </button>
            <button
              onClick={onGoToShelters}
              className="flex-1 py-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              Abrigos
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">Encontre seu novo melhor amigo</h2>
          <p className="text-xl opacity-90">
            Centenas de pets esperando por um lar cheio de amor e carinho
          </p>
        </div>
      </div>

      {/* Pets Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl text-gray-900">Pets disponíveis para adoção</h3>
          <p className="text-gray-600">{mockPets.length} pets encontrados</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, raça ou localização..."
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Species Filter */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Espécie</label>
                  <select
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todos</option>
                    <option value="dog">🐕 Cachorros</option>
                    <option value="cat">🐱 Gatos</option>
                  </select>
                </div>

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

                {/* Age Filter */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Idade</label>
                  <select
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todas</option>
                    <option value="young">Filhote/Jovem</option>
                    <option value="adult">Adulto</option>
                    <option value="senior">Idoso</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          {filteredPets.length} {filteredPets.length === 1 ? 'pet encontrado' : 'pets encontrados'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => onSelectPet(pet)}
            >
              {/* Pet Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <ImageWithFallback
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-purple-50 transition-colors">
                  <Heart className="w-5 h-5 text-purple-600" />
                </button>
              </div>

              {/* Pet Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-xl text-gray-900 mb-1">{pet.name}</h4>
                    <p className="text-sm text-gray-600">
                      {pet.breed} • {pet.age}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {pet.type === 'dog' ? '🐕 Cão' : '🐱 Gato'}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{pet.shelterName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{pet.location}</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
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