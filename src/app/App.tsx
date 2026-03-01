import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ShelterRegistrationScreen } from './components/ShelterRegistrationScreen';
import { HomeScreen } from './components/HomeScreen';
import { PetDetailsScreen, type Pet } from './components/PetDetailsScreen';
import { SheltersScreen } from './components/SheltersScreen';
import { ShelterDetailsScreen } from './components/ShelterDetailsScreen';
import { ScheduleVisitModal, type Shelter } from './components/ScheduleVisitModal';
import { ProfileScreen } from './components/ProfileScreen';
import { AdoptionRequestsScreen, type AdoptionRequest } from './components/AdoptionRequestsScreen';
import { AdoptionRequestDetailsScreen } from './components/AdoptionRequestDetailsScreen';
import { MyVisitsScreen } from './components/MyVisitsScreen';
import { MyAdoptionRequestsScreen } from './components/MyAdoptionRequestsScreen';
import { ShelterVisitsScreen } from './components/ShelterVisitsScreen';
import { ShelterDashboardScreen } from './components/ShelterDashboardScreen';
import { ManagePetScreen } from './components/ManagePetScreen';
import { AddPetScreen } from './components/AddPetScreen';

type Screen = 'login' | 'signup' | 'shelter-registration' | 'home' | 'pet-details' | 'shelters' | 'shelter-details' | 'profile' | 'adoption-requests' | 'request-details' | 'my-visits' | 'my-adoptions' | 'shelter-visits' | 'shelter-dashboard' | 'manage-pet' | 'add-pet';

interface UserData {
  name: string;
  email: string;
  password: string;
}

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedPetRequests, setSelectedPetRequests] = useState<{ petId: string; petName: string; requests: AdoptionRequest[] } | null>(null);
  
  // Mock shelter pets - In production, this would come from a database
  const [shelterPets, setShelterPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Max',
      species: 'Cachorro',
      breed: 'Vira-lata',
      age: '2 anos',
      gender: 'Macho',
      size: 'Médio',
      weight: '15kg',
      color: 'Marrom',
      image: 'https://images.unsplash.com/photo-1559681369-e8b09c685cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXQlMjBhZG9wdGlvbnxlbnwxfHx8fDE3NzIwMjg1NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      shelter: 'Meu Abrigo',
      location: 'São Paulo, SP',
      personality: 'Alegre e brincalhão',
      healthStatus: 'Vacinado e castrado',
      description: 'Max é um cachorro super carinhoso e cheio de energia!'
    },
    {
      id: '2',
      name: 'Luna',
      species: 'Cachorro',
      breed: 'Labrador',
      age: '1 ano',
      gender: 'Fêmea',
      size: 'Grande',
      weight: '25kg',
      color: 'Dourado',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYWwlMjByZXNjdWUlMjBjZW50ZXJ8ZW58MXx8fHwxNzcyMDA4OTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      shelter: 'Meu Abrigo',
      location: 'São Paulo, SP',
      personality: 'Dócil e obediente',
      healthStatus: 'Saudável e vacinada',
      description: 'Luna adora brincar e é muito amigável com crianças.'
    },
    {
      id: '3',
      name: 'Mel',
      species: 'Gato',
      breed: 'Persa',
      age: '6 meses',
      gender: 'Fêmea',
      size: 'Pequeno',
      weight: '3kg',
      color: 'Branco',
      image: 'https://images.unsplash.com/photo-1622641269217-954d3163a1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXR0ZW4lMjBwb3J0cmFpdCUyMGN1dGV8ZW58MXx8fHwxNzcyMDI4NTQxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      shelter: 'Meu Abrigo',
      location: 'São Paulo, SP',
      personality: 'Calma e carinhosa',
      healthStatus: 'Vacinada',
      description: 'Mel é uma gatinha muito tranquila e adorável.'
    }
  ]);
  
  // Mock user profile - In production, this would come from a database
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    isShelter: false, // Change to true to test shelter profile
    shelterData: undefined
    // For shelter users, uncomment:
    // shelterData: {
    //   shelterName: 'Abrigo Patinhas Felizes',
    //   shelterAddress: 'Avenida Principal, 456',
    //   shelterCity: 'São Paulo',
    //   shelterState: 'SP',
    //   shelterPhone: '(11) 3456-7890',
    //   shelterEmail: 'contato@patinhasfelizes.org.br',
    //   description: 'Dedicados ao resgate e adoção responsável de animais abandonados há mais de 15 anos.',
    //   workingHours: 'Segunda a Sábado, 9h às 18h',
    //   foundedYear: 2009
    // }
  });

  const handleProceedToShelter = (data: UserData) => {
    setUserData(data);
    setCurrentScreen('shelter-registration');
  };

  const handleBackToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleShelterComplete = (shelterData: {
    shelterName: string;
    address: string;
    phone: string;
  }) => {
    console.log('Complete signup with:', {
      ...userData,
      ...shelterData,
      isShelter: true
    });
    
    // Update user profile with shelter data
    setUserProfile({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: shelterData.phone,
      address: shelterData.address,
      city: 'São Paulo', // In production, parse from address
      state: 'SP',
      isShelter: true,
      shelterData: {
        shelterName: shelterData.shelterName,
        shelterAddress: shelterData.address,
        shelterCity: 'São Paulo',
        shelterState: 'SP',
        shelterPhone: shelterData.phone,
        shelterEmail: userData?.email || '',
        description: 'Novo abrigo dedicado ao resgate e adoção responsável de animais.',
        workingHours: 'Segunda a Sábado, 9h às 18h',
        foundedYear: new Date().getFullYear()
      }
    });
    
    setCurrentScreen('home');
  };

  const handleGoToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    // Simula login bem-sucedido
    // Redireciona para o dashboard apropriado
    if (userProfile.isShelter) {
      setCurrentScreen('shelter-dashboard');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleSignupComplete = () => {
    // Quando o usuário completa o cadastro normal (não abrigo)
    if (userData) {
      setUserProfile({
        name: userData.name,
        email: userData.email,
        phone: '',
        address: '',
        city: '',
        state: '',
        isShelter: false
      });
    }
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
    setUserData(null);
    setSelectedPet(null);
    setSelectedShelter(null);
  };

  const handleSelectPet = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentScreen('pet-details');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedPet(null);
  };

  const handleAdoptRequest = (petId: string) => {
    console.log('Adoption request for pet:', petId);
    alert('Solicitação de adoção enviada com sucesso! O abrigo entrará em contato em breve. 🐾');
  };

  const handleGoToShelters = () => {
    setCurrentScreen('shelters');
  };

  const handleBackToPets = () => {
    setCurrentScreen('home');
  };

  const handleSelectShelter = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setCurrentScreen('shelter-details');
  };

  const handleBackToShelters = () => {
    setCurrentScreen('shelters');
    setSelectedShelter(null);
  };

  const handleScheduleVisit = () => {
    setShowScheduleModal(true);
  };

  const handleConfirmVisit = (date: string, time: string) => {
    console.log('Visit scheduled:', { shelter: selectedShelter?.name, date, time });
    setShowScheduleModal(false);
    alert(`Visita agendada com sucesso para ${new Date(date).toLocaleDateString('pt-BR')} às ${time}! 📅`);
  };

  const handleCancelSchedule = () => {
    setShowScheduleModal(false);
  };

  const handleGoToProfile = () => {
    setCurrentScreen('profile');
  };

  const handleBackFromProfile = () => {
    if (userProfile.isShelter) {
      setCurrentScreen('shelter-dashboard');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    console.log('Profile updated:', updatedProfile);
    alert('Perfil atualizado com sucesso! ✅');
  };

  const handleGoToRequests = () => {
    setCurrentScreen('adoption-requests');
  };

  const handleBackFromRequests = () => {
    setCurrentScreen('profile');
  };

  const handleSelectPetForRequests = (petId: string, petName: string, requests: AdoptionRequest[]) => {
    setSelectedPetRequests({ petId, petName, requests });
    setCurrentScreen('request-details');
  };

  const handleBackFromRequestDetails = () => {
    setCurrentScreen('adoption-requests');
    setSelectedPetRequests(null);
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log('Accept request:', requestId);
    alert('Solicitação aceita com sucesso! Entre em contato com o adotante para dar continuidade. ✅');
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
    alert('Solicitação recusada. O solicitante será notificado. ❌');
  };

  const handleGoToMyVisits = () => {
    setCurrentScreen('my-visits');
  };

  const handleBackFromMyVisits = () => {
    setCurrentScreen('profile');
  };

  const handleGoToMyAdoptions = () => {
    setCurrentScreen('my-adoptions');
  };

  const handleBackFromMyAdoptions = () => {
    setCurrentScreen('profile');
  };

  const handleGoToShelterVisits = () => {
    setCurrentScreen('shelter-visits');
  };

  const handleBackFromShelterVisits = () => {
    setCurrentScreen('profile');
  };

  const handleSelectPetInShelter = (pet: Pet) => {
    setSelectedPet(pet);
    setCurrentScreen('manage-pet');
  };

  const handleBackFromManagePet = () => {
    setCurrentScreen('shelter-dashboard');
    setSelectedPet(null);
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setShelterPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
    alert('Informações do animal atualizadas com sucesso! ✅');
  };

  const handleDeletePet = (petId: string) => {
    setShelterPets(prev => prev.filter(p => p.id !== petId));
    setCurrentScreen('shelter-dashboard');
    setSelectedPet(null);
    alert('Animal removido do sistema com sucesso! 🗑️');
  };

  const handleGoToAddPet = () => {
    setCurrentScreen('add-pet');
  };

  const handleBackFromAddPet = () => {
    setCurrentScreen('shelter-dashboard');
  };

  const handleSaveNewPet = (petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: Date.now().toString() // Simple ID generation
    };
    
    setShelterPets(prev => [...prev, newPet]);
    setCurrentScreen('shelter-dashboard');
    alert('Animal cadastrado com sucesso! 🎉');
  };

  if (currentScreen === 'add-pet') {
    return (
      <AddPetScreen
        onBack={handleBackFromAddPet}
        onSave={handleSaveNewPet}
      />
    );
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
    return (
      <ShelterVisitsScreen
        onBack={handleBackFromShelterVisits}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'my-adoptions') {
    return (
      <MyAdoptionRequestsScreen
        onBack={handleBackFromMyAdoptions}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'my-visits') {
    return (
      <MyVisitsScreen
        onBack={handleBackFromMyVisits}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'request-details' && selectedPetRequests) {
    return (
      <AdoptionRequestDetailsScreen
        petName={selectedPetRequests.petName}
        requests={selectedPetRequests.requests}
        onBack={handleBackFromRequestDetails}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
      />
    );
  }

  if (currentScreen === 'adoption-requests') {
    return (
      <AdoptionRequestsScreen
        onBack={handleBackFromRequests}
        onSelectPet={handleSelectPetForRequests}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <ProfileScreen
        userProfile={userProfile}
        onBack={handleBackFromProfile}
        onUpdateProfile={handleUpdateProfile}
        onGoToRequests={userProfile.isShelter ? handleGoToRequests : undefined}
        onGoToShelterVisits={userProfile.isShelter ? handleGoToShelterVisits : undefined}
        onGoToMyVisits={!userProfile.isShelter ? handleGoToMyVisits : undefined}
        onGoToMyAdoptions={!userProfile.isShelter ? handleGoToMyAdoptions : undefined}
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

  return <SignupScreen onProceedToShelter={handleProceedToShelter} onGoToLogin={handleGoToLogin} onSignupComplete={handleSignupComplete} />;
}