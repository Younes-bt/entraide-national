import { useTranslation } from 'react-i18next';

const CenterDashboard = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }} className="bg-background text-foreground min-h-screen">
      <h1>{t('centerDashboardTitle')}</h1>
      <p>{t('welcomeCenterSupervisor')}</p>
      {/* Center Supervisor specific content will go here */}
    </div>
  );
};

export default CenterDashboard; 