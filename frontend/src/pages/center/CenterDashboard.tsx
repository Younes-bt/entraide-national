import { useTranslation } from 'react-i18next';

const CenterDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('centerDashboardTitle')}</h1>
      <p>{t('welcomeCenterSupervisor')}</p>
      {/* Center Supervisor specific content for the dashboard overview will go here */}
    </div>
  );
};

export default CenterDashboard; 