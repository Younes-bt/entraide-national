import { useTranslation } from 'react-i18next';

const TrainerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('trainerDashboardTitle')}</h1>
      <p>{t('welcomeTrainer')}</p>
      {/* Trainer specific content for the dashboard overview will go here */}
    </div>
  );
};

export default TrainerDashboard; 