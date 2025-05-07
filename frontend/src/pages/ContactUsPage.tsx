import { useTranslation } from 'react-i18next';

const ContactUsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto p-4 pt-10 bg-background text-foreground min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{t('contactUs')}</h1>
      <p>This is the Contact Us page. Content will be added here.</p>
    </div>
  );
};

export default ContactUsPage; 