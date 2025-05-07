import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t('adminDashboardTitle')}</h1>
      <p>
        Welcome to the admin area. Use the sidebar to navigate different management sections.
      </p>
      {/* Add actual dashboard widgets/content here */}
    </div>
  );
};

export default AdminDashboard; 