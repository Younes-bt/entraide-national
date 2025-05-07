import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }} className="bg-background text-foreground min-h-screen">
      <h1>{t('adminDashboardTitle')}</h1>
      <p>{t('welcomeAdmin')}</p>
      {/* Admin specific content will go here */}
    </div>
  );
};

export default AdminDashboard; 