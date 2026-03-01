import { X, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

export interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  description: string;
  imageUrl: string;
  animalsCount: number;
  availableDogs: number;
  availableCats: number;
  workingHours: string;
  foundedYear: number;
}

interface ScheduleVisitModalProps {
  shelter: Shelter;
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
}

export function ScheduleVisitModal({ shelter, onConfirm, onCancel }: ScheduleVisitModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    onConfirm(date, time);
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl text-gray-900">Confirmar Agendamento</h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg text-gray-900 mb-2">{shelter.name}</h3>
              <p className="text-sm text-gray-600">{shelter.address}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Data</p>
                  <p className="text-gray-900">{new Date(date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Horário</p>
                  <p className="text-gray-900">{time}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                <strong>Lembre-se:</strong> Chegue com alguns minutos de antecedência. Traga um documento de identificação e esteja preparado para conhecer os animais disponíveis para adoção.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outline"
                className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Confirmar Visita
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900">Agendar Visita</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSchedule} className="p-6">
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg text-gray-900 mb-2">{shelter.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{shelter.address}</p>
            <p className="text-sm text-purple-700">
              <strong>Horário de funcionamento:</strong> {shelter.workingHours}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="date" className="block text-sm text-gray-700 mb-2">
                Data da visita
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm text-gray-700 mb-2">
                Horário
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Visite o abrigo para conhecer os animais pessoalmente e conversar com a equipe sobre o processo de adoção.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!date || !time}
            >
              Continuar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
