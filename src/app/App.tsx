// src/App.tsx
import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ShelterRegistrationScreen } from './components/ShelterRegistrationScreen';
import { HomeScreen } from './components/HomeScreen';
import { PetDetailsScreen, type Pet } from './components/PetDetailsScreen';
import { SheltersScreen } from './components/SheltersScreen';
import { ShelterDetailsScreen } from './components/ShelterDetailsScreen';
import { ScheduleVisitModal, type Shelter } from './components/ScheduleVisitModal';
import { ProfileScreen } from './components/ProfileScreen';
import { AdoptionRequestsScreen, type PetAdoptionGroup } from './components/AdoptionRequestsScreen'; // ← removido AdoptionRequest
import { AdoptionRequestDetailsScreen } from './components/AdoptionRequestDetailsScreen';
import { MyVisitsScreen } from './components/MyVisitsScreen';
import { MyAdoptionRequestsScreen } from './components/MyAdoptionRequestsScreen';
import { ShelterVisitsScreen } from './components/ShelterVisitsScreen';
import { ShelterDashboardScreen } from './components/ShelterDashboardScreen';
import { ManagePetScreen } from './components/ManagePetScreen';
import { AddPetScreen } from './components/AddPetScreen';

// Serviços de autenticação e API
import {
  saveToken,
  saveUser,
  getSavedUser,
  clearSession,
  decodeTokenPayload,
  isLoggedIn,
  type AuthUser,
} from '../services/AuthService';
import {
  login as apiLogin,
  createUser as apiCreateUser,
  createShelter as apiCreateShelter,
  getUserById,
  getAllAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  createVisit,
  createAdoption,
  type UserProfile as ApiUserProfile,
  type Animal,
} from '../services/ApiService';
import { ApiError } from '../lib/api';

// ─── Tipos locais ─────────────────────────────────────────────────────────────

type Screen =
  | 'login' | 'signup' | 'shelter-registration' | 'home' | 'pet-details'
  | 'shelters' | 'shelter-details' | 'profile' | 'adoption-requests'
  | 'request-details' | 'my-visits' | 'my-adoptions' | 'shelter-visits'
  | 'shelter-dashboard' | 'manage-pet' | 'add-pet';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

// Converte Animal do backend para o formato Pet que os componentes esperam
function animalToPet(a: Animal): Pet {
  return {
    id:           String(a.id),
    name:         a.name,
    type:         a.type          ?? '',
    breed:        a.breed         ?? '',
    age:          String(a.age),
    gender:       a.gender        ?? '',
    size:         a.size          ?? '',
    imageUrl:     a.imageUrl      ?? '',
    description:  a.description   ?? '',
    personality:  a.personality   ?? '[]',
    healthStatus: a.healthStatus  ?? '',
    vaccinated:   a.vaccinated    ?? false,
    neutered:     a.neutered      ?? false,
    shelterName:  a.shelterName   ?? '',
    shelterPhone: a.shelterPhone  ?? '',
    shelterEmail: a.shelterEmail  ?? '',
    location:     a.location      ?? '',
  };
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // Usuário autenticado (id + role vindos do JWT)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Perfil completo (nome, email…) buscado via GET /users/:id
  const [userProfile, setUserProfile] = useState<ApiUserProfile | null>(null);

  // Dados temporários durante o fluxo de cadastro
  const [signupData, setSignupData] = useState<SignupData | null>(null);

  // Pets do abrigo (carregados do backend)
  const [shelterPets, setShelterPets] = useState<Pet[]>([]);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // ← Antes era { petId, petName, requests: AdoptionRequest[] }
  // Agora é o grupo completo vindo direto da API
  const [selectedPetGroup, setSelectedPetGroup] = useState<PetAdoptionGroup | null>(null);

  // ─── Restaurar sessão ao abrir o app ────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn()) return;

    const saved = getSavedUser();
    if (!saved) return;

    setAuthUser(saved);

    getUserById(saved.id)
      .then(profile => {
        setUserProfile(profile);
        setCurrentScreen(saved.role === 'SHELTER' ? 'shelter-dashboard' : 'home');
      })
      .catch(() => {
        clearSession();
      });
  }, []);

  // ─── Carregar pets do abrigo quando chega no dashboard ───────────────────────
  useEffect(() => {
    if (currentScreen !== 'shelter-dashboard') return;
    getAllAnimals()
      .then(animals => setShelterPets(animals.map(animalToPet)))
      .catch(console.error);
  }, [currentScreen]);

  // ─── Auth handlers ───────────────────────────────────────────────────────────

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token } = await apiLogin(email, password);
      saveToken(token);

      const decoded = decodeTokenPayload(token);
      if (!decoded) throw new Error('Token inválido');

      saveUser(decoded);
      setAuthUser(decoded);

      const profile = await getUserById(decoded.id);
      setUserProfile(profile);

      setCurrentScreen(decoded.role === 'SHELTER' ? 'shelter-dashboard' : 'home');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao fazer login.';
      alert(msg);
    }
  };

  const handleLogout = () => {
    clearSession();
    setAuthUser(null);
    setUserProfile(null);
    setSelectedPet(null);
    setSelectedShelter(null);
    setSelectedPetGroup(null);
    setShelterPets([]);
    setCurrentScreen('login');
  };

  // ─── Signup handlers ─────────────────────────────────────────────────────────

  const handleGoToSignup  = () => setCurrentScreen('signup');
  const handleGoToLogin   = () => setCurrentScreen('login');

  const handleSignupComplete = async (_data: SignupData) => {
    try {
      alert('Cadastro realizado! Faça login para continuar. ✅');
      setCurrentScreen('login');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao cadastrar.';
      alert(msg);
    }
  };

  const handleProceedToShelter = (data: SignupData) => {
    setSignupData(data);
    setCurrentScreen('shelter-registration');
  };

  const handleBackToSignup = () => setCurrentScreen('signup');

  const handleShelterComplete = async (shelterData: {
    shelterName: string;
    address: string;
    phone: string;
  }) => {
    if (!signupData) return;
    try {
      const { token } = await apiLogin(signupData.email, signupData.password);
      saveToken(token);

      const decoded = decodeTokenPayload(token);
      if (!decoded) throw new Error('Token inválido');
      saveUser(decoded);
      setAuthUser(decoded);

      const profile = await getUserById(decoded.id);
      setUserProfile(profile);
      setSignupData(null);
      setCurrentScreen('shelter-dashboard');
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Erro ao cadastrar abrigo.');
    }
  };

  // ─── Pet handlers ─────────────────────────────────────────────────────────────

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentScreen('pet-details');
  };

  const handleBackToHome = () => {
    setSelectedPet(null);
    setCurrentScreen('home');
  };

  const handleAdoptRequest = async (petId: string) => {
    try {
      await createAdoption({ animalId: Number(petId) });
      alert('Solicitação de adoção enviada com sucesso! O abrigo entrará em contato em breve. 🐾');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao solicitar adoção.';
      alert(msg);
    }
  };

  // ─── Shelter pet management ───────────────────────────────────────────────────

  const handleSelectPetInShelter = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentScreen('manage-pet');
  };

  const handleBackFromManagePet = () => {
    setSelectedPet(null);
    setCurrentScreen('shelter-dashboard');
  };

  const handleUpdatePet = async (updatedPet: Pet) => {
    try {
      await updateAnimal(Number(updatedPet.id), {
        name:         updatedPet.name,
        species:      updatedPet.type,
        breed:        updatedPet.breed,
        age:          String(updatedPet.age),
        gender:       updatedPet.gender,
        size:         updatedPet.size,
        image:        updatedPet.imageUrl,
        personality:  updatedPet.personality,
        healthStatus: updatedPet.healthStatus,
        description:  updatedPet.description,
      });
      setShelterPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
      setSelectedPet(null);
      setCurrentScreen('shelter-dashboard');
      alert('Informações do animal atualizadas com sucesso! ✅');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao atualizar animal.';
      alert(msg);
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await deleteAnimal(Number(petId));
      setShelterPets(prev => prev.filter(p => p.id !== petId));
      setSelectedPet(null);
      setCurrentScreen('shelter-dashboard');
      alert('Animal removido do sistema com sucesso! 🗑️');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao remover animal.';
      alert(msg);
    }
  };

  const handleGoToAddPet     = () => setCurrentScreen('add-pet');
  const handleBackFromAddPet = () => setCurrentScreen('shelter-dashboard');

  const handleSaveNewPet = async (petData: Omit<Pet, 'id'>) => {
    try {
      const created = await createAnimal({
        name:         petData.name,
        species:      petData.species,
        breed:        petData.breed,
        age:          petData.age,
        gender:       petData.gender,
        size:         petData.size,
        weight:       petData.weight,
        color:        petData.color,
        image:        petData.image,
        personality:  petData.personality,
        healthStatus: petData.healthStatus,
        description:  petData.description,
        shelterId:    authUser!.id,
      });
      setShelterPets(prev => [...prev, animalToPet(created)]);
      setCurrentScreen('shelter-dashboard');
      alert('Animal cadastrado com sucesso! 🎉');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao cadastrar animal.';
      alert(msg);
    }
  };

  // ─── Shelter visit / schedule ─────────────────────────────────────────────────

  const handleScheduleVisit  = () => setShowScheduleModal(true);
  const handleCancelSchedule = () => setShowScheduleModal(false);

  const handleConfirmVisit = async (date: string, time: string) => {
    if (!selectedShelter) return;
    try {
      await createVisit({ shelterId: Number(selectedShelter.id), date, time });
      setShowScheduleModal(false);
      alert(`Visita agendada com sucesso para ${new Date(date).toLocaleDateString('pt-BR')} às ${time}! 📅`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao agendar visita.';
      alert(msg);
    }
  };

  // ─── Navigation helpers ───────────────────────────────────────────────────────

  const handleGoToShelters  = () => setCurrentScreen('shelters');
  const handleBackToPets    = () => setCurrentScreen('home');

  const handleSelectShelter = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setCurrentScreen('shelter-details');
  };
  const handleBackToShelters = () => {
    setSelectedShelter(null);
    setCurrentScreen('shelters');
  };

  const handleGoToProfile      = () => setCurrentScreen('profile');
  const handleBackFromProfile  = () => {
    setCurrentScreen(authUser?.role === 'SHELTER' ? 'shelter-dashboard' : 'home');
  };

  const handleUpdateProfile = async (updatedProfile: ApiUserProfile) => {
    if (!authUser) return;
    try {
      await import('../lib/api').then(({ http }) =>
        http(`/users/${authUser.id}`, { method: 'PUT', body: updatedProfile })
      );
      setUserProfile(updatedProfile);
      alert('Perfil atualizado com sucesso! ✅');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao atualizar perfil.';
      alert(msg);
    }
  };

  const handleGoToRequests          = () => setCurrentScreen('adoption-requests');
  const handleBackFromRequests      = () => setCurrentScreen('profile');
  const handleGoToMyVisits          = () => setCurrentScreen('my-visits');
  const handleBackFromMyVisits      = () => setCurrentScreen('profile');
  const handleGoToMyAdoptions       = () => setCurrentScreen('my-adoptions');
  const handleBackFromMyAdoptions   = () => setCurrentScreen('profile');
  const handleGoToShelterVisits     = () => setCurrentScreen('shelter-visits');
  const handleBackFromShelterVisits = () => setCurrentScreen('profile');

  // ← Antes recebia (petId, petName, requests[]); agora recebe o grupo completo
  const handleSelectPetGroup = (group: PetAdoptionGroup) => {
    setSelectedPetGroup(group);
    setCurrentScreen('request-details');
  };

  const handleBackFromRequestDetails = () => {
    setSelectedPetGroup(null);
    setCurrentScreen('adoption-requests');
  };

  // ─── Adapta UserProfile para ProfileScreen ────────────────────────────────────
  const profileScreenProps = userProfile
    ? {
        name:      userProfile.name,
        email:     userProfile.email,
        phone:     '',
        address:   '',
        city:      '',
        state:     '',
        role:      userProfile.role,
        isShelter: userProfile.role === 'SHELTER',
      }
    : null;

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (currentScreen === 'add-pet') {
    return <AddPetScreen onBack={handleBackFromAddPet} onSave={handleSaveNewPet} />;
  }

  if (currentScreen === 'manage-pet' && selectedPet) {
    return (
      <ManagePetScreen
        pet={selectedPet}
        onBack={handleBackFromManagePet}
        onUpdate={handleUpdatePet}
        onDelete={handleDeletePet}
      />
    );
  }

  if (currentScreen === 'shelter-dashboard') {
    return (
      <ShelterDashboardScreen
        onLogout={handleLogout}
        onSelectPet={handleSelectPetInShelter}
        onAddPet={handleGoToAddPet}
        onGoToProfile={handleGoToProfile}
        shelterPets={shelterPets}
      />
    );
  }

  if (currentScreen === 'shelter-visits') {
    return <ShelterVisitsScreen onBack={handleBackFromShelterVisits} onLogout={handleLogout} />;
  }

  if (currentScreen === 'my-adoptions') {
    return <MyAdoptionRequestsScreen onBack={handleBackFromMyAdoptions} onLogout={handleLogout} />;
  }

  if (currentScreen === 'my-visits') {
    return <MyVisitsScreen onBack={handleBackFromMyVisits} onLogout={handleLogout} />;
  }

  // ← Agora passa group diretamente; aceite/recusa são feitos internamente no componente
  if (currentScreen === 'request-details' && selectedPetGroup) {
    return (
      <AdoptionRequestDetailsScreen
        group={selectedPetGroup}
        onBack={handleBackFromRequestDetails}
      />
    );
  }

  if (currentScreen === 'adoption-requests') {
    return (
      <AdoptionRequestsScreen
        onBack={handleBackFromRequests}
        onSelectPet={handleSelectPetGroup} // ← assinatura atualizada
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'profile' && profileScreenProps) {
    return (
      <ProfileScreen
        userProfile={profileScreenProps}
        onBack={handleBackFromProfile}
        onUpdateProfile={handleUpdateProfile}
        onGoToRequests={authUser?.role === 'SHELTER' ? handleGoToRequests : undefined}
        onGoToShelterVisits={authUser?.role === 'SHELTER' ? handleGoToShelterVisits : undefined}
        onGoToMyVisits={authUser?.role !== 'SHELTER' ? handleGoToMyVisits : undefined}
        onGoToMyAdoptions={authUser?.role !== 'SHELTER' ? handleGoToMyAdoptions : undefined}
      />
    );
  }

  if (currentScreen === 'shelter-details' && selectedShelter) {
    return (
      <>
        <ShelterDetailsScreen
          shelter={selectedShelter}
          onBack={handleBackToShelters}
          onScheduleVisit={handleScheduleVisit}
        />
        {showScheduleModal && (
          <ScheduleVisitModal
            shelter={selectedShelter}
            onConfirm={handleConfirmVisit}
            onCancel={handleCancelSchedule}
          />
        )}
      </>
    );
  }

  if (currentScreen === 'shelters') {
    return (
      <SheltersScreen
        onLogout={handleLogout}
        onSelectShelter={handleSelectShelter}
        onBackToPets={handleBackToPets}
        onGoToProfile={handleGoToProfile}
      />
    );
  }

  if (currentScreen === 'pet-details' && selectedPet) {
    return (
      <PetDetailsScreen
        pet={selectedPet}
        onBack={handleBackToHome}
        onAdopt={handleAdoptRequest}
      />
    );
  }

  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onLogout={handleLogout}
        onSelectPet={handleSelectPet}
        onGoToShelters={handleGoToShelters}
        onGoToProfile={handleGoToProfile}
      />
    );
  }

  if (currentScreen === 'login') {
    return <LoginScreen onGoToSignup={handleGoToSignup} onLogin={handleLogin} />;
  }

  if (currentScreen === 'shelter-registration') {
    return (
      <ShelterRegistrationScreen
        onComplete={handleShelterComplete}
        onBack={handleBackToSignup}
      />
    );
  }

  return (
    <SignupScreen
      onProceedToShelter={handleProceedToShelter}
      onGoToLogin={handleGoToLogin}
      onSignupComplete={handleSignupComplete}
    />
  );
}