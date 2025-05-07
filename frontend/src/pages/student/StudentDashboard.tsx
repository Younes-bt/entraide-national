import { useTranslation } from 'react-i18next';

const StudentDashboard = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }} className="bg-background text-foreground min-h-screen">
      <h1>{t('studentDashboardTitle')}</h1>
      <p>{t('welcomeStudent')}</p>
      {/* Student specific content will go here */}
    </div>
  );
};

export default StudentDashboard; 