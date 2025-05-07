import { useTranslation } from 'react-i18next';

const AssociationDashboard = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }} className="bg-background text-foreground min-h-screen">
      <h1>{t('associationDashboardTitle')}</h1>
      <p>{t('welcomeAssociationSupervisor')}</p>
      {/* Association Supervisor specific content will go here */}
    </div>
  );
};

export default AssociationDashboard; 