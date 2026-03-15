import { Heart, ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Animal } from '@/services/AnimalService';

interface ManageAnimalScreenProps {
  animal: Animal;
  onBack: () => void;
  onUpdate: (animal: Animal) => void;
  onDelete: (animalId: Number) => void;
}

export function ManageAnimalScreen({ animal, onBack, onUpdate, onDelete }: ManageAnimalScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Edit state
  const [photoUrl, setPhotoUrl] = useState(animal.photoUrl);
  const [name, setName] = useState(animal.name);
  const [species, setSpecies] = useState(animal.species);
  const [breed, setBreed] = useState(animal.breed);
  const [age, setAge] = useState(animal.age);
  const [gender, setGender] = useState(animal.gender);
  const [size, setSize] = useState(animal.size || '');
  const [personality, setPersonality] = useState(animal.personality || '');
  const [healthStatus, setHealthStatus] = useState(animal.healthStatus || '');
  const [description, setDescription] = useState(animal.description || '');

  const handleSave = () => {
    const updatedAnimal: Animal = {
      ...animal,
      photoUrl,
      name,
      species,
      breed,
      age,
      gender,
      size,
      personality,
      healthStatus,
      description,
    };
    
    onUpdate(updatedAnimal);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setName(animal.name);
    setSpecies(animal.species);
    setBreed(animal.breed);
    setAge(animal.age);
    setGender(animal.gender);
    setSize(animal.size || '');
    setPersonality(animal.personality || '');
    setHealthStatus(animal.healthStatus || '');
    setDescription(animal.description || '');
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(animal.id);
  };

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
              <h1 className="text-xl text-purple-600">AnimalConnect</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animal Image */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="h-96 bg-gray-200 relative">
            <ImageWithFallback
              src={animal.photoUrl}
              alt={animal.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-purple-600 text-white rounded-full">
                {species}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 py-6 text-lg"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Editar Informações
            </Button>
            <Button
              onClick={() => setShowDeleteModal(true)}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50 py-6 text-lg"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Remover Animal
            </Button>
          </div>
        )}

        {/* Animal Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">
              {isEditing ? 'Editar Informações' : 'Informações do Animal'}
            </h2>
            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </div>


          {isEditing ? (
          <div className="space-y-4">
            {/* Photo */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Link da Foto</label>
                <Input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full"
                />
            </div>
          </div>
              ) : null}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Nome</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-900 text-lg">{animal.name}</p>
              )}
            </div>

            {/* Type and Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Espécie</label>
                {isEditing ? (
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{animal.species}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Raça</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">{animal.breed}</p>
                )}
              </div>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Idade</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full"
                    placeholder="Ex: 2 anos, 6 meses"
                  />
                ) : (
                  <p className="text-gray-900">{animal.age}</p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Sexo</label>
                {isEditing ? (
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Fêmea">Fêmea</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{animal.gender}</p>
                )}
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Porte</label>
                {isEditing ? (
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Selecione</option>
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande">Grande</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{animal.size || 'Não informado'}</p>
                )}
              </div>
            </div>

            {/* Personality */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Personalidade</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Calmo, Brincalhão, Sociável"
                />
              ) : (
                <p className="text-gray-900">{animal.personality || 'Não informado'}</p>
              )}
            </div>

            {/* Health Status */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Estado de Saúde</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Vacinado, Castrado, Saudável"
                />
              ) : (
                <p className="text-gray-900">{animal.healthStatus || 'Não informado'}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Descrição</label>
              {isEditing ? (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Conte mais sobre o animal..."
                />
              ) : (
                <p className="text-gray-900">{animal.description || 'Não informado'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h2 className="text-2xl text-gray-900 text-center mb-2">
                Remover Animal
              </h2>

              <p className="text-gray-600 text-center mb-6">
                Você tem certeza que deseja remover <strong>{animal.name}</strong> do sistema?
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>⚠️ Atenção:</strong> Esta ação não pode ser desfeita. Todas as informações e solicitações de adoção relacionadas a este animal serão permanentemente removidas.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmar Remoção
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}