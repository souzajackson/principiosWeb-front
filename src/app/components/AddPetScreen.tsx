import { Heart, ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import type { Pet } from './PetDetailsScreen';

interface AddPetScreenProps {
  onBack: () => void;
  onSave: (pet: Omit<Pet, 'id'>) => void;
}

export function AddPetScreen({ onBack, onSave }: AddPetScreenProps) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Cachorro');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Macho');
  const [size, setSize] = useState('');
  const [weight, setWeight] = useState('');
  const [color, setColor] = useState('');
  const [personality, setPersonality] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !breed || !age) {
      alert('Por favor, preencha os campos obrigatórios: Nome, Raça e Idade');
      return;
    }

    const newPet: Omit<Pet, 'id'> = {
      name,
      species,
      breed,
      age,
      gender,
      size,
      weight,
      color,
      personality,
      healthStatus,
      description,
      image: imageUrl || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIwMDg5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      shelter: 'Meu Abrigo',
      location: 'São Paulo, SP'
    };

    onSave(newPet);
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
              <span>Cancelar</span>
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-3xl text-gray-900 mb-2">Cadastrar Novo Animal</h2>
          <p className="text-gray-600 mb-8">
            Preencha as informações do animal para disponibilizá-lo para adoção
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                URL da Foto do Animal
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="pl-10 w-full"
                  placeholder="https://exemplo.com/foto.jpg (opcional)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Cole o link de uma foto do animal. Se não informado, será usada uma imagem padrão.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Nome do Animal <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                placeholder="Ex: Rex, Mimi, Bob"
                required
              />
            </div>

            {/* Species and Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Espécie <span className="text-red-500">*</span>
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Raça <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full"
                  placeholder="Ex: Vira-lata, SRD, Poodle"
                  required
                />
              </div>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Idade <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full"
                  placeholder="Ex: 2 anos, 6 meses, Filhote"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
            </div>

            {/* Size and Weight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Porte</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione (opcional)</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Peso</label>
                <Input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full"
                  placeholder="Ex: 15kg, 8kg (opcional)"
                />
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Cor</label>
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full"
                placeholder="Ex: Marrom, Branco e preto, Tigrado (opcional)"
              />
            </div>

            {/* Personality */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Personalidade</label>
              <Input
                type="text"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full"
                placeholder="Ex: Calmo, Brincalhão, Sociável (opcional)"
              />
            </div>

            {/* Health Status */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Estado de Saúde</label>
              <Input
                type="text"
                value={healthStatus}
                onChange={(e) => setHealthStatus(e.target.value)}
                className="w-full"
                placeholder="Ex: Vacinado, Castrado, Saudável (opcional)"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Conte mais sobre o animal, sua história, comportamento, necessidades especiais... (opcional)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Uma boa descrição ajuda a encontrar o lar perfeito!
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>💡 Dica:</strong> Quanto mais informações você fornecer, maiores são as chances de encontrar um adotante adequado para o animal.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Save className="w-5 h-5 mr-2" />
                Cadastrar Animal
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              <span className="text-red-500">*</span> Campos obrigatórios
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
