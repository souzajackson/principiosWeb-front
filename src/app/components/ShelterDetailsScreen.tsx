import { ArrowLeft, MapPin, Phone, Mail, Clock, Calendar, Heart, Building2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import type { Shelter } from './ScheduleVisitModal';

interface ShelterDetailsScreenProps {
  shelter: Shelter;
  onBack: () => void;
  onScheduleVisit: () => void;
}

export function ShelterDetailsScreen({ shelter, onBack, onScheduleVisit }: ShelterDetailsScreenProps) {
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
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-200 aspect-[4/3]">
              <ImageWithFallback
                src={shelter.imageUrl}
                alt={shelter.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-2xl text-purple-600 mb-1">{shelter.animalsCount}</p>
                <p className="text-xs text-gray-600">Animais</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-2xl text-purple-600 mb-1">{shelter.availableDogs}</p>
                <p className="text-xs text-gray-600">Cães</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <p className="text-2xl text-purple-600 mb-1">{shelter.availableCats}</p>
                <p className="text-xs text-gray-600">Gatos</p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Name and Basic Info */}
            <div>
              <div className="flex items-start gap-3 mb-2">
                <Building2 className="w-8 h-8 text-purple-600 mt-1" />
                <div>
                  <h2 className="text-4xl text-gray-900 mb-2">{shelter.name}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Fundado em {shelter.foundedYear}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg text-gray-900 mb-3">Sobre o Abrigo</h3>
              <p className="text-gray-600 leading-relaxed">{shelter.description}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h3 className="text-lg text-gray-900 mb-3">Informações de Contato</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Endereço</p>
                    <p className="text-gray-900">{shelter.address}</p>
                    <p className="text-gray-600">{shelter.city}, {shelter.state}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telefone</p>
                    <p className="text-gray-900">{shelter.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">E-mail</p>
                    <p className="text-gray-900">{shelter.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Horário de Funcionamento</p>
                    <p className="text-gray-900">{shelter.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Visit Button */}
            <Button
              onClick={onScheduleVisit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-lg shadow-lg"
            >
              📅 Agendar Visita
            </Button>

            <p className="text-center text-sm text-gray-500">
              Agende uma visita para conhecer pessoalmente o abrigo e os animais disponíveis para adoção
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <h3 className="text-2xl text-gray-900 mb-4">Como Funciona a Adoção</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h4 className="text-lg text-gray-900 mb-2">Agende uma Visita</h4>
              <p className="text-gray-600 text-sm">
                Escolha um dia e horário para conhecer o abrigo e os animais disponíveis.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h4 className="text-lg text-gray-900 mb-2">Conheça os Pets</h4>
              <p className="text-gray-600 text-sm">
                Interaja com os animais e escolha aquele que conquistou seu coração.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h4 className="text-lg text-gray-900 mb-2">Finalize a Adoção</h4>
              <p className="text-gray-600 text-sm">
                Complete o processo de adoção e leve seu novo amigo para casa!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
