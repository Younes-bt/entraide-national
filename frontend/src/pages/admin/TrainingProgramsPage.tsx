import React, { useState, useEffect } from 'react';
import TrainingProgramCard, { type TrainingProgram } from './components/TrainingProgramCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

// TODO: Consider moving API_BASE_URL to an environment variable
const API_BASE_URL = 'http://localhost:8000/api';

const TrainingProgramsPage: React.FC = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!accessToken) {
        setError(t('trainingPrograms.error.notAuthenticated', 'Authentication token is missing. Please log in.'));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/programs/trainingprogrames/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          let errorDetail = 'Failed to fetch training programs.';
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || `HTTP error! status: ${response.status}`;
          } catch (e) {
            // If response is not JSON or error parsing JSON
            errorDetail = `HTTP error! status: ${response.status}`;
          }
          throw new Error(errorDetail);
        }

        const data = await response.json();
        setPrograms(data.results || []);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t('trainingPrograms.error.unknown', 'An unknown error occurred.'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, [accessToken, t]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {t('trainingPrograms.title', 'Training Programs')}
        </h1>
        <Link to="/admin/training-programs/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            {t('trainingPrograms.addNew', 'Add New Training Program')}
          </Button>
        </Link>
      </div>
      
      {isLoading && <p>{t('loading', 'Loading...')}</p>}
      {error && <p className="text-red-500">{t('error', 'Error')}: {error}</p>}
      
      {!isLoading && !error && programs.length === 0 && (
        <p>{t('trainingPrograms.noPrograms', 'No training programs found.')}</p>
      )}
      
      {!isLoading && !error && programs.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {programs.map((program) => (
            <TrainingProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingProgramsPage; 