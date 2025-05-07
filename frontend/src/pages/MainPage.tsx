import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 70px - 40px)' }} /* Adjusted height considering navbar and content padding */
         className="bg-background text-foreground"
    >
      <h1>{t('welcome')}</h1>
      <p>{t('mainPageMessage')}</p>
      <Link to="/login">
        <Button variant="outline">{t('login')}</Button>
      </Link>
    </div>
  );
};

export default MainPage; 