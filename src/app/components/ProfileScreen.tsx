import { Heart, ArrowLeft, User, Mail, Phone, MapPin, Building2, Calendar, Edit2, Save, X, FileText, CalendarDays } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  isShelter: boolean;
  shelterData?: {
    shelterName: string;
    shelterAddress: string;
    shelterCity: string;
    shelterState: string;
    shelterPhone: string;
    shelterEmail: string;
    description: string;
    workingHours: string;
    foundedYear: number;
  };
}

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
  onGoToMyAdoptions
}: ProfileScreenProps) {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingShelter, setIsEditingShelter] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<UserProfile | null>(null);

  // Personal info state
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [address, setAddress] = useState(userProfile.address);
  const [city, setCity] = useState(userProfile.city);
  const [state, setState] = useState(userProfile.state);

  // Shelter info state
  const [shelterName, setShelterName] = useState(userProfile.shelterData?.shelterName || '');
  const [shelterAddress, setShelterAddress] = useState(userProfile.shelterData?.shelterAddress || '');
  const [shelterCity, setShelterCity] = useState(userProfile.shelterData?.shelterCity || '');
  const [shelterState, setShelterState] = useState(userProfile.shelterData?.shelterState || '');
  const [shelterPhone, setShelterPhone] = useState(userProfile.shelterData?.shelterPhone || '');
  const [shelterEmail, setShelterEmail] = useState(userProfile.shelterData?.shelterEmail || '');
  const [description, setDescription] = useState(userProfile.shelterData?.description || '');
  const [workingHours, setWorkingHours] = useState(userProfile.shelterData?.workingHours || '');
  const [foundedYear, setFoundedYear] = useState(userProfile.shelterData?.foundedYear || new Date().getFullYear());

  const handleSavePersonal = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      name,
      email,
      phone,
      address,
      city,
      state,
    };
    setPendingChanges(updatedProfile);
    setShowConfirmModal(true);
  };

  const handleSaveShelter = () => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      shelterData: {
        shelterName,
        shelterAddress,
        shelterCity,
        shelterState,
        shelterPhone,
        shelterEmail,
        description,
        workingHours,
        foundedYear,
      },
    };
    setPendingChanges(updatedProfile);
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    if (pendingChanges) {
      onUpdateProfile(pendingChanges);
      setShowConfirmModal(false);
      setIsEditingPersonal(false);
      setIsEditingShelter(false);
      setPendingChanges(null);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setName(userProfile.name);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    setAddress(userProfile.address);
    setCity(userProfile.city);
    setState(userProfile.state);
    
    if (userProfile.shelterData) {
      setShelterName(userProfile.shelterData.shelterName);
      setShelterAddress(userProfile.shelterData.shelterAddress);
      setShelterCity(userProfile.shelterData.shelterCity);
      setShelterState(userProfile.shelterData.shelterState);
      setShelterPhone(userProfile.shelterData.shelterPhone);
      setShelterEmail(userProfile.shelterData.shelterEmail);
      setDescription(userProfile.shelterData.description);
      setWorkingHours(userProfile.shelterData.workingHours);
      setFoundedYear(userProfile.shelterData.foundedYear);
    }
    
    setIsEditingPersonal(false);
    setIsEditingShelter(false);
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
              <h1 className="text-xl text-purple-600">PetConnect</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              {userProfile.isShelter ? (
                <Building2 className="w-10 h-10 text-purple-600" />
              ) : (
                <User className="w-10 h-10 text-purple-600" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl mb-1">{userProfile.name}</h2>
              <p className="text-purple-100">
                {userProfile.isShelter ? '🏢 Conta de Abrigo' : '👤 Usuário'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          {userProfile.isShelter ? (
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

        {/* Personal Information Section */}
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
            {/* Name */}
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

            {/* Email */}
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

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Telefone</label>
              {isEditingPersonal ? (
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                  placeholder="(00) 00000-0000"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">{userProfile.phone || 'Não informado'}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm text-gray-500 mb-2">Endereço</label>
              {isEditingPersonal ? (
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full"
                  placeholder="Rua, número, complemento"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">{userProfile.address || 'Não informado'}</span>
                </div>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Cidade</label>
                {isEditingPersonal ? (
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{userProfile.city || 'Não informado'}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Estado</label>
                {isEditingPersonal ? (
                  <Input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full"
                    placeholder="UF"
                    maxLength={2}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{userProfile.state || 'Não informado'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons for Personal Info */}
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

        {/* Shelter Information Section */}
        {userProfile.isShelter && userProfile.shelterData && (
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
              {/* Shelter Name */}
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
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-900">{userProfile.shelterData.shelterName}</span>
                  </div>
                )}
              </div>

              {/* Shelter Description */}
              <div>
                <label className="block text-sm text-gray-500 mb-2">Descrição</label>
                {isEditingShelter ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descreva o abrigo, sua missão e serviços..."
                  />
                ) : (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-900">{userProfile.shelterData.description}</span>
                  </div>
                )}
              </div>

              {/* Shelter Address */}
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
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-900">{userProfile.shelterData.shelterAddress}</span>
                  </div>
                )}
              </div>

              {/* Shelter City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Cidade</label>
                  {isEditingShelter ? (
                    <Input
                      type="text"
                      value={shelterCity}
                      onChange={(e) => setShelterCity(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-900">{userProfile.shelterData.shelterCity}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Estado</label>
                  {isEditingShelter ? (
                    <Input
                      type="text"
                      value={shelterState}
                      onChange={(e) => setShelterState(e.target.value)}
                      className="w-full"
                      maxLength={2}
                    />
                  ) : (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-900">{userProfile.shelterData.shelterState}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shelter Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-900">{userProfile.shelterData.shelterPhone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">E-mail do Abrigo</label>
                  {isEditingShelter ? (
                    <Input
                      type="email"
                      value={shelterEmail}
                      onChange={(e) => setShelterEmail(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-900">{userProfile.shelterData.shelterEmail}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Working Hours and Founded Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Horário de Funcionamento</label>
                  {isEditingShelter ? (
                    <Input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      className="w-full"
                      placeholder="Ex: Segunda a Sábado, 9h às 18h"
                    />
                  ) : (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-900">{userProfile.shelterData.workingHours}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Ano de Fundação</label>
                  {isEditingShelter ? (
                    <Input
                      type="number"
                      value={foundedYear}
                      onChange={(e) => setFoundedYear(parseInt(e.target.value))}
                      className="w-full"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <span className="text-gray-900">{userProfile.shelterData.foundedYear}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons for Shelter Info */}
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

      {/* Confirmation Modal */}
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