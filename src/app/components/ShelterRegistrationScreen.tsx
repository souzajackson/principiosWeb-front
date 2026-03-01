import { useState } from 'react';
import { Heart, Building2, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ShelterRegistrationScreenProps {
  onComplete: (shelterData: {
    shelterName: string;
    address: string;
    phone: string;
  }) => void;
  onBack: () => void;
}

export function ShelterRegistrationScreen({ onComplete, onBack }: ShelterRegistrationScreenProps) {
  const [shelterName, setShelterName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ shelterName, address, phone });
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1769117319103-ea3ade5c4749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcHVwcGllcyUyMGtpdHRlbnMlMjBzaGVsdGVyfGVufDF8fHx8MTc3MjAyNzM3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Filhotes de cachorro e gato"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-500/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <Building2 className="w-20 h-20 mx-auto mb-6 drop-shadow-lg" strokeWidth={1.5} />
            <h2 className="text-4xl mb-4">Cadastre seu abrigo</h2>
            <p className="text-xl opacity-90">
              Ajude mais animais a encontrarem um lar
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Botão Voltar */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          {/* Logo e Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Heart className="w-10 h-10 text-purple-600" fill="currentColor" />
              <h1 className="text-4xl text-purple-600">PetConnect</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Informações do abrigo
            </p>
          </div>

          {/* Indicador de progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
                ✓
              </div>
              <div className="w-16 h-1 bg-purple-600"></div>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
                2
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">Passo 2 de 2</p>
          </div>

          {/* Formulário de Cadastro do Abrigo */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="shelterName">Nome do abrigo</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="shelterName"
                  type="text"
                  placeholder="Ex: Lar dos Bichos"
                  value={shelterName}
                  onChange={(e) => setShelterName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço completo</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Rua, número, bairro, cidade - UF"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone de contato</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong className="text-purple-900">💡 Dica:</strong> Mantenha seus dados atualizados para que pessoas interessadas possam entrar em contato facilmente.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
            >
              Finalizar cadastro
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}