import { X, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { createVisit } from '../../services/VisitService';
import { ApiError } from '../../lib/api';

export interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  description: string;
  photoUrl: string;
  animalsCount: number;
  availableDogs: number;
  availableCats: number;
  workingHours: string;
  foundedYear: number;
}

interface ScheduleVisitModalProps {
  shelter: Shelter;
  userId: number;           // ← novo
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
}

// Converte "2025-06-15" → "15/06/2025" sem problema de fuso
function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function ScheduleVisitModal({ shelter, userId, onConfirm, onCancel }: ScheduleVisitModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const localDate = new Date(`${date}T${time}:00`);
      const isoTimestamp = localDate.toISOString();

      await createVisit({
        shelterId: Number(shelter.id),
        date: isoTimestamp,
      });

      onConfirm(date, time);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao agendar visita.';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl text-gray-900">Confirmar Agendamento</h2>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg text-gray-900 mb-1">{shelter.name}</h3>
              <p className="text-sm text-gray-600">{shelter.address}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Data</p>
                  {/* DD/MM/YYYY sem depender do locale do navegador */}
                  <p className="text-gray-900">{formatDateBR(date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-500">Horário</p>
                  {/* Exibe diretamente o valor HH:MM em 24h */}
                  <p className="text-gray-900">{time}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-800">
                <strong>Lembre-se:</strong> Chegue com alguns minutos de antecedência. Traga um documento de identificação e esteja preparado para conhecer os animais disponíveis para adoção.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outline"
                className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Agendando...' : 'Confirmar Visita'}
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl text-gray-900">Agendar Visita</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSchedule} className="p-6">
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg text-gray-900 mb-1">{shelter.name}</h3>
            <p className="text-sm text-gray-600">{shelter.address}</p>
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
                  // Força o picker a exibir no formato brasileiro (DD/MM/YYYY)
                  lang="pt-BR"
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
                  // Força o picker a usar formato 24h
                  step="60"
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