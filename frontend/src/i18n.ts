import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define translation resources
const resources = {
  en: {
    translation: {
      // Navbar
      navbarLogo: 'Entraide National',
      home: 'Home',
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      faq: 'FAQ',
      login: 'Login',
      logout: 'Logout',
      adminDashboard: 'Admin DB',
      studentDashboard: 'Student DB',
      // User related
      greeting: 'Hi, {{firstName}} {{lastName}}',
      // Main Page
      welcome: 'Welcome to Entraide National!',
      mainPageMessage: 'This is the main public page.',
      // Login Page
      loginPageTitle: 'Login to Your Account',
      login_form_message: 'Enter your credentials below to access your dashboard.',
      login_details: {
        pleaseFillFields: 'Please fill in all fields.',
        errorTitle: 'Login Failed',
        emailLabel: 'Email Address',
        emailPlaceholder: 'name@example.com',
        passwordLabel: 'Password',
        passwordPlaceholder: 'Your Password',
        loading: 'Logging in...',
        loginButton: 'Sign In'
      },
      sidebar: {
        dashboard: "Dashboard",
        centers: "Centers",
        associations: "Associations",
        supervisors: "Supervisors",
        trainers: "Trainers",
        students: "Students"
      },
      table: {
        avatar: "Avatar",
        fullName: "Full Name",
        center: "Center",
        phone: "Phone",
        actions: "Actions"
      },
      actions: {
        edit: "Edit",
        delete: "Delete"
      },
      supervisors: {
        fetchError: "Failed to fetch supervisors.",
        errorTitle: "Error",
        loading: "Loading supervisors...",
        noResults: "No supervisors found."
      },
      // Dashboards (generic)
      adminDashboardTitle: 'Admin Dashboard',
      welcomeAdmin: 'Welcome, Admin!',
      centerDashboardTitle: 'Center Supervisor Dashboard',
      welcomeCenterSupervisor: 'Welcome, Center Supervisor!',
      associationDashboardTitle: 'Association Supervisor Dashboard',
      welcomeAssociationSupervisor: 'Welcome, Association Supervisor!',
      trainerDashboardTitle: 'Trainer Dashboard',
      welcomeTrainer: 'Welcome, Trainer!',
      studentDashboardTitle: 'Student Dashboard',
      welcomeStudent: 'Welcome, Student!',
      // Not Found Page
      notFoundTitle: '404 - Page Not Found',
      goHome: 'Go Home'
    }
  },
  fr: {
    translation: {
      // Navbar
      navbarLogo: 'Entraide National',
      home: 'Accueil',
      aboutUs: 'À Propos',
      contactUs: 'Contactez-Nous',
      faq: 'FAQ',
      login: 'Connexion',
      logout: 'Déconnexion',
      adminDashboard: 'DB Admin',
      studentDashboard: 'DB Étudiant',
      // User related
      greeting: 'Salut, {{firstName}} {{lastName}}',
      // Main Page
      welcome: 'Bienvenue à Entraide National!',
      mainPageMessage: 'Ceci est la page publique principale.',
      // Login Page
      loginPageTitle: 'Connectez-vous à Votre Compte',
      login_form_message: 'Entrez vos identifiants ci-dessous pour accéder à votre tableau de bord.',
      login_details: {
        pleaseFillFields: 'Veuillez remplir tous les champs.',
        errorTitle: 'Échec de la Connexion',
        emailLabel: 'Adresse E-mail',
        emailPlaceholder: 'nom@exemple.com',
        passwordLabel: 'Mot de Passe',
        passwordPlaceholder: 'Votre Mot de Passe',
        loading: 'Connexion en cours...',
        loginButton: 'Se Connecter'
      },
      sidebar: {
        dashboard: "Tableau de Bord",
        centers: "Centres",
        associations: "Associations",
        supervisors: "Superviseurs",
        trainers: "Formateurs",
        students: "Étudiants"
      },
      table: {
        avatar: "Avatar",
        fullName: "Nom Complet",
        center: "Centre",
        phone: "Téléphone",
        actions: "Actions"
      },
      actions: {
        edit: "Modifier",
        delete: "Supprimer"
      },
      supervisors: {
        fetchError: "Échec de la récupération des superviseurs.",
        errorTitle: "Erreur",
        loading: "Chargement des superviseurs...",
        noResults: "Aucun superviseur trouvé."
      },
      // Dashboards (generic)
      adminDashboardTitle: 'Tableau de Bord Admin',
      welcomeAdmin: 'Bienvenue, Admin!',
      centerDashboardTitle: 'Tableau de Bord Superviseur Centre',
      welcomeCenterSupervisor: 'Bienvenue, Superviseur Centre!',
      associationDashboardTitle: 'Tableau de Bord Superviseur Association',
      welcomeAssociationSupervisor: 'Bienvenue, Superviseur Association!',
      trainerDashboardTitle: 'Tableau de Bord Formateur',
      welcomeTrainer: 'Bienvenue, Formateur!',
      studentDashboardTitle: 'Tableau de Bord Étudiant',
      welcomeStudent: 'Bienvenue, Étudiant!',
      // Not Found Page
      notFoundTitle: '404 - Page Non Trouvée',
      goHome: 'Retour à l\'accueil'
    }
  },
  ar: {
    translation: {
      // Navbar
      navbarLogo: 'التعاضدية الوطنية',
      home: 'الرئيسية',
      aboutUs: 'من نحن',
      contactUs: 'اتصل بنا',
      faq: 'الأسئلة الشائعة',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      adminDashboard: 'لوحة تحكم المسؤول',
      studentDashboard: 'لوحة تحكم الطالب',
      // User related
      greeting: 'مرحباً، {{firstName}} {{lastName}}',
      // Main Page
      welcome: 'مرحباً بكم في التعاضدية الوطنية!',
      mainPageMessage: 'هذه هي الصفحة العامة الرئيسية.',
      // Login Page
      loginPageTitle: 'تسجيل الدخول إلى حسابك',
      login_form_message: 'أدخل بيانات الاعتماد الخاصة بك أدناه للوصول إلى لوحة التحكم الخاصة بك.',
      login_details: {
        pleaseFillFields: 'يرجى ملء جميع الحقول.',
        errorTitle: 'فشل تسجيل الدخول',
        emailLabel: 'البريد الإلكتروني',
        emailPlaceholder: 'name@example.com',
        passwordLabel: 'كلمة المرور',
        passwordPlaceholder: 'كلمة المرور الخاصة بك',
        loading: 'جارٍ تسجيل الدخول...',
        loginButton: 'الدخول'
      },
      sidebar: {
        dashboard: "لوحة التحكم",
        centers: "المراكز",
        associations: "الجمعيات",
        supervisors: "المشرفين",
        trainers: "المدربين",
        students: "الطلاب"
      },
      table: {
        avatar: "الصورة الرمزية",
        fullName: "الاسم الكامل",
        center: "المركز",
        phone: "الهاتف",
        actions: "الإجراءات"
      },
      actions: {
        edit: "تعديل",
        delete: "حذف"
      },
      supervisors: {
        fetchError: "فشل في جلب المشرفين.",
        errorTitle: "خطأ",
        loading: "جاري تحميل المشرفين...",
        noResults: "لم يتم العثور على مشرفين."
      },
      // Dashboards (generic)
      adminDashboardTitle: 'لوحة تحكم المسؤول',
      welcomeAdmin: 'مرحباً، أيها المسؤول!',
      centerDashboardTitle: 'لوحة تحكم مشرف المركز',
      welcomeCenterSupervisor: 'مرحباً، مشرف المركز!',
      associationDashboardTitle: 'لوحة تحكم مشرف الجمعية',
      welcomeAssociationSupervisor: 'مرحباً، مشرف الجمعية!',
      trainerDashboardTitle: 'لوحة تحكم المدرب',
      welcomeTrainer: 'مرحباً، أيها المدرب!',
      studentDashboardTitle: 'لوحة تحكم الطالب',
      welcomeStudent: 'مرحباً، أيها الطالب!',
      // Not Found Page
      notFoundTitle: '404 - الصفحة غير موجودة',
      goHome: 'العودة إلى الرئيسية'
    }
  }
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Use English if detected language is not available
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false // React already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'], // Cache the language in localStorage
    }
  });

export default i18n; 