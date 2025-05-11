import { useTranslation } from 'react-i18next';

const CenterStudentsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t('centerStudentsPageTitle')}</h1>
      <p>{t('manageCenterStudentsMessage')}</p>
      {/* Content for managing students will go here */}
    </div>
  );
};

export default CenterStudentsPage; 