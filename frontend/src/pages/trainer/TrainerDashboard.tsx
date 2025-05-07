import { useTranslation } from 'react-i18next';

const TrainerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }} className="bg-background text-foreground min-h-screen">
      <h1>{t('trainerDashboardTitle')}</h1>
      <p>{t('welcomeTrainer')}</p>
      {/* Trainer specific content will go here */}
    </div>
  );
};

export default TrainerDashboard; 