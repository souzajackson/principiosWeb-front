import {
  Heart,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  Save,
  X,
  FileText,
  CalendarDays,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { UserProfile } from '@/services/UserService';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onBack: () => void;
  onUpdateProfile: (profile: UserProfile) => Promise<void>;
  onGoToRequests?: () => void;
  onGoToShelterVisits?: () => void;
  onGoToMyVisits?: () => void;
  onGoToMyAdoptions?: () => void;
}

export function ProfileScreen({
  userProfile,
  onBack,
  onUpdateProfile,
  onGoToRequests,
  onGoToShelterVisits,
  onGoToMyVisits,
  onGoToMyAdoptions,
}: ProfileScreenProps) {
  const isShelter = userProfile.role === 'SHELTER';

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingShelter, setIsEditingShelter] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<UserProfile | null>(null);

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);

  const [shelterName, setShelterName] = useState(userProfile.shelterData?.name || '');
  const [shelterAddress, setShelterAddress] = useState(userProfile.shelterData?.address || '');
  const [shelterPhone, setShelterPhone] = useState(userProfile.shelterData?.phone || '');
  const [shelterId, setShelterId] = useState(userProfile.shelterData?.id || '');


  const handleSavePersonal = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      name,
      email,
    };
    setPendingChanges(updatedProfile);
    setShowConfirmModal(true);
  };

  const handleSaveShelter = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      shelterData: {
        id: Number(shelterId),
        name: shelterName,
        address: shelterAddress,
        phone: shelterPhone,
      },
    };
    setPendingChanges(updatedProfile);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    if (pendingChanges) {
      await onUpdateProfile(pendingChanges);
      setShowConfirmModal(false);
      setIsEditingPersonal(false);
      setIsEditingShelter(false);
      setPendingChanges(null);
    }
  };

  const handleCancelEdit = () => {
    setName(userProfile.name);
    setEmail(userProfile.email);
    setShelterName(userProfile.shelterData?.name || '');
    setShelterAddress(userProfile.shelterData?.address || '');
    setShelterPhone(userProfile.shelterData?.phone || '');
    setIsEditingPersonal(false);
    setIsEditingShelter(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              {isShelter ? (
                <Building2 className="w-10 h-10 text-purple-600" />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-3xl mb-1">{userProfile.name}</h2>
              <p className="text-purple-100">
                {isShelter ? '🏢 Conta de Abrigo' : '👤 Usuário'}
              </p>
            </div>
          </div>

          {isShelter ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {onGoToRequests && (
                <Button
                  onClick={onGoToRequests}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Solicitações de Adoção
                </Button>
              )}
              {onGoToShelterVisits && (
                <Button
                  onClick={onGoToShelterVisits}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Visitas Agendadas
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
              {onGoToMyAdoptions && (
                <Button
                  onClick={onGoToMyAdoptions}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Minhas Solicitações
                </Button>
              )}
              {onGoToMyVisits && (
                <Button
                  onClick={onGoToMyVisits}
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Minhas Visitas
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-gray-900">Informações Pessoais</h3>
            {!isEditingPersonal && !isEditingShelter && (
              <Button
                onClick={() => setIsEditingPersonal(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">Nome Completo</label>
              {isEditingPersonal ? (
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">{userProfile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">E-mail</label>
              {isEditingPersonal ? (
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">{userProfile.email}</span>
                </div>
              )}
            </div>
          </div>

          {isEditingPersonal && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleSavePersonal}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
            </div>
          )}
        </div>

        {isShelter && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-purple-600" />
                <h3 className="text-2xl text-gray-900">Informações do Abrigo</h3>
              </div>

              {!isEditingShelter && !isEditingPersonal && (
                <Button
                  onClick={() => setIsEditingShelter(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Nome do Abrigo</label>
                {isEditingShelter ? (
                  <Input
                    type="text"
                    value={shelterName}
                    onChange={(e) => setShelterName(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">{userProfile.shelterData?.name || 'Não informado'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Endereço do Abrigo</label>
                {isEditingShelter ? (
                  <Input
                    type="text"
                    value={shelterAddress}
                    onChange={(e) => setShelterAddress(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">{userProfile.shelterData?.address || 'Não informado'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Telefone do Abrigo</label>
                {isEditingShelter ? (
                  <Input
                    type="tel"
                    value={shelterPhone}
                    onChange={(e) => setShelterPhone(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-900">{userProfile.shelterData?.phone || 'Não informado'}</span>
                  </div>
                )}
              </div>
            </div>

            {isEditingShelter && (
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveShelter}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirmModal && pendingChanges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl text-gray-900">Confirmar Alterações</h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Você tem certeza que deseja salvar as alterações realizadas no seu perfil?
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <strong>Atenção:</strong> As informações atualizadas serão refletidas em todo o sistema.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="outline"
                  className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmSave}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}