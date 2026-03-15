// src/App.tsx
import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ShelterRegistrationScreen } from './components/ShelterRegistrationScreen';
import { HomeScreen } from './components/HomeScreen';
import { AnimalDetailsScreen } from './components/AnimalDetailsScreen';
import { SheltersScreen } from './components/SheltersScreen';
import { ShelterDetailsScreen } from './components/ShelterDetailsScreen';
import { ScheduleVisitModal, type Shelter } from './components/ScheduleVisitModal';
import { ProfileScreen } from './components/ProfileScreen';
import { AdoptionRequestsScreen, type AnimalAdoptionGroup } from './components/AdoptionRequestsScreen'; // ← removido AdoptionRequest
import { AdoptionRequestDetailsScreen } from './components/AdoptionRequestDetailsScreen';
import { MyVisitsScreen } from './components/MyVisitsScreen';
import { MyAdoptionRequestsScreen } from './components/MyAdoptionRequestsScreen';
import { ShelterVisitsScreen } from './components/ShelterVisitsScreen';
import { ShelterDashboardScreen } from './components/ShelterDashboardScreen';

// Serviços de autenticação e API
import {
  saveToken,
  saveUser,
  getSavedUser,
  clearSession,
  decodeTokenPayload,
  isLoggedIn,
  type AuthUser,
  login,
} from '../services/AuthService';

import { ApiError } from '../lib/api';
import { Animal, createAnimal, deleteAnimal, getAllAnimals, updateAnimal } from '@/services/AnimalService';
import { getUserById, UserProfile } from '@/services/UserService';
import { createVisit } from '@/services/VisitService';
import { createAdoption } from '@/services/AdoptionService';
import { AddAnimalScreen } from './components/AddAnimalScreen';
import { ManageAnimalScreen } from './components/ManageAnimalScreen';
import { getMyShelter, updateShelter } from '@/services/ShelterService';

// ─── Tipos locais ─────────────────────────────────────────────────────────────

type Screen =
  | 'login' | 'signup' | 'shelter-registration' | 'home' | 'Animal-details'
  | 'shelters' | 'shelter-details' | 'profile' | 'adoption-requests'
  | 'request-details' | 'my-visits' | 'my-adoptions' | 'shelter-visits'
  | 'shelter-dashboard' | 'manage-Animal' | 'add-Animal';

interface SignupData {
  name: string;
  email: string;
  password: string;
}


// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // Usuário autenticado (id + role vindos do JWT)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // Perfil completo (nome, email…) buscado via GET /users/:id
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Dados temporários durante o fluxo de cadastro
  const [signupData, setSignupData] = useState<SignupData | null>(null);

  // Animals do abrigo (carregados do backend)
  const [shelterAnimals, setShelterAnimals] = useState<Animal[]>([]);

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // ← Antes era { AnimalId, AnimalName, requests: AdoptionRequest[] }
  // Agora é o grupo completo vindo direto da API
  const [selectedAnimalGroup, setSelectedAnimalGroup] = useState<AnimalAdoptionGroup | null>(null);

  const loadCompleteUserProfile = async (user: AuthUser): Promise<UserProfile> => {
  const baseProfile = await getUserById(user.id);

  if (user.role !== 'SHELTER') {
    return baseProfile;
  }

  const shelter = await getMyShelter();

  return {
    ...baseProfile,
    shelterData: {
      id: shelter.id,
      name: shelter.name,
      address: shelter.address,
      phone: shelter.phone,
    },
  };
};

  // ─── Restaurar sessão ao abrir o app ────────────────────────────────────────
  useEffect(() => {
  if (!isLoggedIn()) return;

  const saved = getSavedUser();
  if (!saved) return;

  setAuthUser(saved);

  loadCompleteUserProfile(saved)
    .then(profile => {
      setUserProfile(profile);
      setCurrentScreen(saved.role === 'SHELTER' ? 'shelter-dashboard' : 'home');
    })
    .catch(() => {
      clearSession();
    });
}, []);

  // ─── Carregar Animals do abrigo quando chega no dashboard ───────────────────────
  useEffect(() => {
    if (currentScreen !== 'shelter-dashboard') return;

    getAllAnimals()
      .then(setShelterAnimals)
      .catch(console.error);
  }, [currentScreen]);

  // ─── Auth handlers ───────────────────────────────────────────────────────────

  const handleLogin = async (email: string, password: string) => {
  try {
    const { token } = await login(email, password);
    saveToken(token);

    const decoded = decodeTokenPayload(token);
    if (!decoded) throw new Error('Token inválido');

    saveUser(decoded);
    setAuthUser(decoded);

    const profile = await loadCompleteUserProfile(decoded);
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
    setSelectedAnimal(null);
    setSelectedShelter(null);
    setSelectedAnimalGroup(null);
    setShelterAnimals([]);
    setCurrentScreen('login');
  };

  // ─── Signup handlers ─────────────────────────────────────────────────────────

  const handleGoToSignup  = () => setCurrentScreen('signup');
  const handleGoToLogin   = () => setCurrentScreen('login');

  const handleSignupComplete = async () => {
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

  const handleShelterComplete = async () => {
  if (!signupData) return;
  try {
    const { token } = await login(signupData.email, signupData.password);
    saveToken(token);
    const decoded = decodeTokenPayload(token);
    if (!decoded) throw new Error('Token inválido');
    console.log("here", decoded)
    saveUser(decoded);
    setAuthUser(decoded);

    const profile = await loadCompleteUserProfile(decoded);
    setUserProfile(profile);

    setSignupData(null);
    setCurrentScreen('shelter-dashboard');
  } catch (err) {
    alert(err instanceof ApiError ? err.message : 'Erro ao cadastrar abrigo.');
  }
};

  // ─── Animal handlers ─────────────────────────────────────────────────────────────

  const handleSelectAnimal = (Animal: Animal) => {
    setSelectedAnimal(Animal);
    setCurrentScreen('Animal-details');
  };

  const handleBackToHome = () => {
    setSelectedAnimal(null);
    setCurrentScreen('home');
  };

  const handleAdoptRequest = async (AnimalId: Number) => {
    try {
      await createAdoption({ animalId: Number(AnimalId) });
      alert('Solicitação de adoção enviada com sucesso! O abrigo entrará em contato em breve. 🐾');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao solicitar adoção.';
      alert(msg);
    }
  };

  // ─── Shelter Animal management ───────────────────────────────────────────────────

  const handleSelectAnimalInShelter = (Animal: Animal) => {
    setSelectedAnimal(Animal);
    setCurrentScreen('manage-Animal');
  };

  const handleBackFromManageAnimal = () => {
    setSelectedAnimal(null);
    setCurrentScreen('shelter-dashboard');
  };

  const handleUpdateAnimal = async (updatedAnimal: Animal) => {
    try {
      await updateAnimal(Number(updatedAnimal.id), {
        name:         updatedAnimal.name,
        species:      updatedAnimal.species,
        breed:        updatedAnimal.breed,
        age:          String(updatedAnimal.age),
        gender:       updatedAnimal.gender,
        size:         updatedAnimal.size,
        photoUrl:        updatedAnimal.photoUrl,
        personality:  updatedAnimal.personality,
        healthStatus: updatedAnimal.healthStatus,
        description:  updatedAnimal.description,
      });
      setShelterAnimals(prev => prev.map(p => p.id === updatedAnimal.id ? updatedAnimal : p));
      setSelectedAnimal(null);
      setCurrentScreen('shelter-dashboard');
      alert('Informações do animal atualizadas com sucesso! ✅');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao atualizar animal.';
      alert(msg);
    }
  };

  const handleDeleteAnimal = async (AnimalId: Number) => {
    try {
      await deleteAnimal(Number(AnimalId));
      setShelterAnimals(prev => prev.filter(p => p.id !== AnimalId));
      setSelectedAnimal(null);
      setCurrentScreen('shelter-dashboard');
      alert('Animal removido do sistema com sucesso! 🗑️');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao remover animal.';
      alert(msg);
    }
  };

  const handleGoToAddAnimal     = () => setCurrentScreen('add-Animal');
  const handleBackFromAddAnimal = () => setCurrentScreen('shelter-dashboard');

  const handleSaveNewAnimal = async (AnimalData: Omit<Animal, 'id' | 'shelterId'>) => {
    try {
      const created = await createAnimal({
        name:         AnimalData.name,
        species:      AnimalData.species,
        breed:        AnimalData.breed,
        age:          AnimalData.age,
        gender:       AnimalData.gender,
        size:         AnimalData.size,
        weight:       AnimalData.weight,
        color:        AnimalData.color,
        photoUrl:     AnimalData.photoUrl,
        personality:  AnimalData.personality,
        healthStatus: AnimalData.healthStatus,
        description:  AnimalData.description,
        shelterId:    authUser!.id,
      });
      setShelterAnimals(prev => [...prev, created]);
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
  const handleBackToAnimals    = () => setCurrentScreen('home');

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

const handleUpdateProfile = async (updatedProfile: UserProfile) => {
  if (!authUser) return;

  try {
    const { http } = await import('../lib/api');

    await http(`/users/${authUser.id}`, {
      method: 'PUT',
      body: {
        name: updatedProfile.name,
        email: updatedProfile.email,
        role: updatedProfile.role,
      },
    });

    if (
      authUser.role === 'SHELTER' &&
      updatedProfile.shelterData &&
      updatedProfile.shelterData.id != null
    ) {
      await updateShelter(updatedProfile.shelterData.id, {
        name: updatedProfile.shelterData.name,
        address: updatedProfile.shelterData.address,
        phone: updatedProfile.shelterData.phone,
      });
    }

    const refreshedProfile = await loadCompleteUserProfile(authUser);
    setUserProfile(refreshedProfile);

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

  // ← Antes recebia (AnimalId, AnimalName, requests[]); agora recebe o grupo completo
  const handleSelectAnimalGroup = (group: AnimalAdoptionGroup) => {
    setSelectedAnimalGroup(group);
    setCurrentScreen('request-details');
  };

  const handleBackFromRequestDetails = () => {
    setSelectedAnimalGroup(null);
    setCurrentScreen('adoption-requests');
  };

  if (currentScreen === 'add-Animal') {
    return <AddAnimalScreen onBack={handleBackFromAddAnimal} onSave={handleSaveNewAnimal} />;
  }

  if (currentScreen === 'manage-Animal' && selectedAnimal) {
    return (
      <ManageAnimalScreen
        animal={selectedAnimal}
        onBack={handleBackFromManageAnimal}
        onUpdate={handleUpdateAnimal}
        onDelete={handleDeleteAnimal}
      />
    );
  }

  if (currentScreen === 'shelter-dashboard') {
    return (
      <ShelterDashboardScreen
        shelterId = {userProfile?.shelterData?.id}
        onLogout={handleLogout}
        onSelectAnimal={handleSelectAnimalInShelter}
        onAddAnimal={handleGoToAddAnimal}
        onGoToProfile={handleGoToProfile}
        shelterAnimals={shelterAnimals}
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
  if (currentScreen === 'request-details' && selectedAnimalGroup) {
    return (
      <AdoptionRequestDetailsScreen
        group={selectedAnimalGroup}
        onBack={handleBackFromRequestDetails}
      />
    );
  }

  if (currentScreen === 'adoption-requests') {
    return (
      <AdoptionRequestsScreen
        onBack={handleBackFromRequests}
        onSelectAnimal={handleSelectAnimalGroup} // ← assinatura atualizada
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'profile' && userProfile) {
    return (
      <ProfileScreen
        userProfile={userProfile}
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
        onBackToAnimals={handleBackToAnimals}
        onGoToProfile={handleGoToProfile}
      />
    );
  }

  if (currentScreen === 'Animal-details' && selectedAnimal) {
    return (
      <AnimalDetailsScreen
        animal={selectedAnimal}
        onBack={handleBackToHome}
        onAdopt={handleAdoptRequest}
      />
    );
  }

  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onLogout={handleLogout}
        onSelectAnimal={handleSelectAnimal}
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