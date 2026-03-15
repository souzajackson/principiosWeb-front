import { Heart, ArrowLeft, MapPin, Calendar, Ruler, Activity, Shield, Building2, Phone, Mail } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { AdoptionConfirmModal } from './AdoptionConfirmModal';
import { useState } from 'react';
import { Animal } from '@/services/AnimalService';


interface animalDetailsScreenProps {
  animal: Animal;
  onBack: () => void;
  onAdopt: (animalId: Number) => void;
}

export function AnimalDetailsScreen({ animal, onBack, onAdopt }: animalDetailsScreenProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmAdopt = () => { setShowConfirmModal(false); onAdopt(animal.id); };


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
                src={animal.photoUrl}
                alt={animal.name}
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
                <h2 className="text-4xl text-gray-900">{animal.name}</h2>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full">
                  {animal.species === 'Cachorro' ? '🐕 Cão' : '🐱 Gato'}
                </span>
              </div>
              <p className="text-xl text-gray-600">{animal.breed}</p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Idade</p>
                  <p className="text-gray-900">{animal.age} {!isNaN(Number(animal.age)) ? 'anos' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Activity className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Sexo</p>
                  <p className="text-gray-900">{animal.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <Ruler className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Porte</p>
                  <p className="text-gray-900">{animal.size || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Localização</p>
                  <p className="text-gray-900 text-sm">{animal.location || '—'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {animal.description ? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg text-gray-900 mb-3">Sobre {animal.name}</h3>
                <p className="text-gray-600 leading-relaxed">{animal.description}</p>
              </div>
            ) : null}

            {/* Personality */}
            {animal.personality? (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg text-gray-900 mb-3">Personalidade</h3>
                <p className="text-gray-600 leading-relaxed">{animal.personality}</p>
              </div>
            ) : null}

            {/* Health */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg text-gray-900">Saúde</h3>
              </div>
              {animal.healthStatus && <p className="text-gray-600 mb-3">{animal.healthStatus}</p>}
              <div className="flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${animal.vaccinated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {animal.vaccinated ? '✓ Vacinado' : '✗ Não vacinado'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${animal.neutered ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {animal.neutered ? '✓ Castrado' : '✗ Não castrado'}
                </span>
              </div>
            </div>

            {/* Shelter Info */}
            {animal.shelterName && (
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg text-gray-900">{animal.shelterName}</h3>
                </div>
                <div className="space-y-2">
                  {animal.shelterPhone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{animal.shelterPhone}</span>
                    </div>
                  )}
                  {animal.shelterEmail && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{animal.shelterEmail}</span>
                    </div>
                  )}
                  {animal.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{animal.location}</span>
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
          animal={animal}
          onConfirm={handleConfirmAdopt}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}