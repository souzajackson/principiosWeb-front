import { X } from 'lucide-react';
import { Button } from './ui/button';
import type { Pet } from './PetDetailsScreen';

interface AdoptionConfirmModalProps {
  pet: Pet;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdoptionConfirmModal({ pet, onConfirm, onCancel }: AdoptionConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900">Confirmar Solicitação de Adoção</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 p-4 bg-purple-50 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
              {pet.type === 'Cachorro' ? '🐕' : '🐱'}
            </div>
            <div>
              <h3 className="text-lg text-gray-900">{pet.name}</h3>
              <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-gray-700">
              Você está prestes a solicitar a adoção de <strong>{pet.name}</strong>.
            </p>
            <p className="text-gray-600 text-sm">
              O abrigo <strong>{pet.shelterName}</strong> entrará em contato com você em breve através dos dados cadastrados para dar continuidade ao processo de adoção.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800">
                <strong>Importante:</strong> O processo de adoção pode incluir entrevista, visita domiciliar e documentação. Certifique-se de estar preparado para oferecer um lar amoroso e responsável.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Confirmar Solicitação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
