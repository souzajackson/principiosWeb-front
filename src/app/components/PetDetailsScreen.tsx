import { Heart, ArrowLeft, MapPin, Calendar, Ruler, Activity, Shield, Building2, Phone, Mail } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { AdoptionConfirmModal } from './AdoptionConfirmModal';
import { useState } from 'react';

// Interface espelho exato dos campos retornados pelo backend
export interface Pet {
  id: string;
  name: string;
  type: string;          // "Cachorro" | "Gato"
  breed: string;
  age: string;           // número convertido para string no animalToPet
  gender: string;
  size: string;
  imageUrl: string;      // campo exato do backend
  description: string;
  personality: string;   // vem como "[]" ou JSON string
  healthStatus: string;
  vaccinated: boolean;
  neutered: boolean;
  shelterName: string;   // campo exato do backend
  shelterPhone: string;
  shelterEmail: string;
  location: string;
}

interface PetDetailsScreenProps {
  pet: Pet;
  onBack: () => void;
  onAdopt: (petId: string) => void;
}

// Normaliza personality: "[]", JSON array ou texto livre → array de strings
function parsePersonality(value: string): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch {}
  return value.split(',').map(s => s.trim()).filter(Boolean);
}

export function PetDetailsScreen({ pet, onBack, onAdopt }: PetDetailsScreenProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmAdopt = () => { setShowConfirmModal(false); onAdopt(pet.id); };

  const personalityTags = parsePersonality(pet.personality);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200 aspect-square">
              <ImageWithFallback
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-purple-50 transition-colors">
                <Heart className="w-6 h-6 text-purple-600" />
              </button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-4xl text-gray-900">{pet.name}</h2>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                  {pet.type === 'Cachorro' ? '🐕 Cão' : '🐱 Gato'}
                </span>
              </div>
              <p className="text-xl text-gray-600">{pet.breed}</p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Idade</p>
                  <p className="text-gray-900">{pet.age} {!isNaN(Number(pet.age)) ? 'anos' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Activity className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Sexo</p>
                  <p className="text-gray-900">{pet.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Ruler className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Porte</p>
                  <p className="text-gray-900">{pet.size || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Localização</p>
                  <p className="text-gray-900 text-sm">{pet.location || '—'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {pet.description ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg text-gray-900 mb-3">Sobre {pet.name}</h3>
                <p className="text-gray-600 leading-relaxed">{pet.description}</p>
              </div>
            ) : null}

            {/* Personality */}
            {personalityTags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg text-gray-900 mb-3">Personalidade</h3>
                <div className="flex flex-wrap gap-2">
                  {personalityTags.map((trait, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Health */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg text-gray-900">Saúde</h3>
              </div>
              {pet.healthStatus && <p className="text-gray-600 mb-3">{pet.healthStatus}</p>}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${pet.vaccinated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {pet.vaccinated ? '✓ Vacinado' : '✗ Não vacinado'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${pet.neutered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {pet.neutered ? '✓ Castrado' : '✗ Não castrado'}
                </span>
              </div>
            </div>

            {/* Shelter Info */}
            {pet.shelterName && (
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg text-gray-900">{pet.shelterName}</h3>
                </div>
                <div className="space-y-2">
                  {pet.shelterPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{pet.shelterPhone}</span>
                    </div>
                  )}
                  {pet.shelterEmail && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{pet.shelterEmail}</span>
                    </div>
                  )}
                  {pet.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{pet.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Adopt Button */}
            <Button
              onClick={() => setShowConfirmModal(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-lg shadow-lg"
            >
              💜 Solicitar Adoção
            </Button>
            <p className="text-center text-sm text-gray-500">
              Ao solicitar a adoção, você será contatado pelo abrigo para dar continuidade ao processo
            </p>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <AdoptionConfirmModal
          pet={pet}
          onConfirm={handleConfirmAdopt}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}