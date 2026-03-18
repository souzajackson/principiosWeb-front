import { ArrowLeft, MapPin, Phone, Heart, Building2, PawPrint, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import type { Shelter } from './ScheduleVisitModal';
import { useEffect, useState } from 'react';
import { getAllAnimals, type Animal } from '../../services/AnimalService';

interface ShelterDetailsScreenProps {
  shelter: Shelter;
  onBack: () => void;
  onScheduleVisit: () => void;
  onSelectAnimal: (animal: Animal) => void;
}

export function ShelterDetailsScreen({ shelter, onBack, onScheduleVisit, onSelectAnimal }: ShelterDetailsScreenProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllAnimals()
      .then(all => setAnimals(all.filter(a => String(a.shelterId) === String(shelter.id))))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [shelter.id]);

  const dogs = animals.filter(a => a.species === 'Cachorro');
  const cats = animals.filter(a => a.species === 'Gato');

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

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-9 h-9 text-white" />
            </div>
            <div>
              <h2 className="text-3xl mb-1">{shelter.name}</h2>
              <div className="flex items-center gap-2 opacity-90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{shelter.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Info + Agendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Contato */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="text-lg text-gray-900">Informações de Contato</h3>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Endereço</p>
                <p className="text-gray-900">{shelter.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Telefone</p>
                <p className="text-gray-900">{shelter.phone}</p>
              </div>
            </div>
          </div>

          {/* Agendar visita */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-lg text-gray-900 mb-1">Quer conhecer o abrigo?</h3>
              <p className="text-sm text-gray-500">Agende uma visita e conheça os animais pessoalmente.</p>
            </div>
            <Button
              onClick={onScheduleVisit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 text-base rounded-lg"
            >
              📅 Agendar Visita
            </Button>
          </div>
        </div>

        {/* Estatísticas dos animais */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-3xl text-purple-600 mb-1">{animals.length}</p>
              <p className="text-sm text-gray-500">Total de Animais</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-3xl text-purple-600 mb-1">{dogs.length}</p>
              <p className="text-sm text-gray-500">Cães</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-3xl text-purple-600 mb-1">{cats.length}</p>
              <p className="text-sm text-gray-500">Gatos</p>
            </div>
          </div>
        )}

        {/* Lista de animais */}
        <div>
          <h3 className="text-xl text-gray-900 mb-4">Animais disponíveis para adoção</h3>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
              <p>Carregando animais...</p>
            </div>
          )}

          {!isLoading && animals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm text-gray-400">
              <PawPrint className="w-12 h-12 mb-3 text-purple-200" />
              <p className="text-lg">Nenhum animal cadastrado ainda</p>
              <p className="text-sm mt-1">Este abrigo ainda não possui animais disponíveis.</p>
            </div>
          )}

          {!isLoading && animals.length > 0 && (
            <div>
              {animals.map(animal => (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {animals.map((animal) => (
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
              ))}
            </div>
          )}
        </div>

        {/* Como funciona */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <h3 className="text-2xl text-gray-900 mb-6">Como Funciona a Adoção</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '1️⃣', title: 'Agende uma Visita', desc: 'Escolha um dia e horário para conhecer o abrigo e os animais disponíveis.' },
              { emoji: '2️⃣', title: 'Conheça os Pets', desc: 'Interaja com os animais e escolha aquele que conquistou seu coração.' },
              { emoji: '3️⃣', title: 'Finalize a Adoção', desc: 'Complete o processo de adoção e leve seu novo amigo para casa!' },
            ].map(step => (
              <div key={step.title} className="bg-white rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <h4 className="text-lg text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}