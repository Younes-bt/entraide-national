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
      goHome: 'Go Home',

      // Added for AdminCentersPage
      common: {
        yes: "Yes",
        no: "No",
        closeButton: "Close",
        loading: "Loading...",
        cancelButton: "Cancel",
        optional: "Optional",
        backToList: "Back to List"
      },
      adminCentersPage: {
        title: "Manage Centers",
        addNewCenterButton: "Add New Center",
        tableHeaderLogo: "Logo",
        tableHeaderName: "Name",
        tableHeaderAffiliatedTo: "Affiliated To",
        tableHeaderPhone: "Phone",
        tableHeaderActions: "Actions",
        logoAlt: "{{name}} logo",
        noLogo: "No Logo",
        notAvailable: "N/A",
        openMenuSr: "Open menu",
        actionViewDetails: "View Details",
        actionEdit: "Edit",
        actionDelete: "Delete",
        noCentersFound: "No centers found.",
        dialogDescription: "Detailed information about {{name}}.",
        dialogId: "ID",
        dialogDescriptionLabel: "Description",
        dialogAffiliation: "Affiliation",
        dialogAssociationName: "Association Name",
        dialogOtherAffiliationDetails: "Other Affiliation Details",
        dialogPhone: "Phone",
        dialogEmail: "Email",
        dialogAddress: "Address",
        dialogCity: "City",
        dialogSupervisor: "Supervisor",
        dialogActive: "Active",
        dialogVerified: "Verified",
        dialogWebsite: "Website",
        dialogFacebook: "Facebook",
        dialogInstagram: "Instagram",
        dialogTwitter: "Twitter",
        dialogMapsLink: "Maps Link",
        dialogCreatedAt: "Created At",
        dialogLastUpdated: "Last Updated",
        dialogRoomsCount: "Rooms Count",
        dialogGroupsCount: "Groups Count",
        affiliationEntraide: "Entraide Nationale",
        affiliationAssociation: "Association",
        confirmDeleteCenter: "Are you sure you want to delete center ID {{centerId}}?",
        loadingAuthAndCenters: "Authenticating and loading centers...",
        loadingCenters: "Loading centers...",
        errorAuthNotAvailable: "User not authenticated or token not available.",
        errorAuthNotAvailableForDelete: "Authentication token not available for delete operation.",
        errorLoadingDynamic: "Error loading centers: {{message}}",
        errorDeletingCenter: "Error deleting center: {{message}}",
        addDialog: {
          title: "Add New Center",
          description: "Fill in the details below to create a new center.",
          labelName: "Center Name",
          labelDescription: "Description",
          labelPhone: "Phone Number",
          labelEmail: "Email Address",
          labelAddress: "Address",
          labelCity: "City",
          labelAffiliatedTo: "Affiliated To",
          affiliationOther: "Other",
          labelOtherAffiliation: "Specify Other Affiliation",
          labelAssociationId: "Association ID",
          labelAssociation: "Association",
          selectAssociation: "Select Association",
          placeholderAssociationId: "Enter Association ID (if applicable)",
          labelSupervisorId: "Supervisor ID",
          labelSupervisor: "Supervisor",
          selectSupervisor: "Select Supervisor",
          placeholderSupervisorId: "Enter Supervisor User ID (if applicable)",
          submitButton: "Create Center",
          errorNameRequired: "Center name is required.",
          errorCreateCenter: "An unexpected error occurred while creating the center.",
          successMessage: "Center created successfully!"
        }
      }
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
      goHome: 'Retour à l\'accueil',

      // Added for AdminCentersPage (French)
      common: {
        yes: "Oui",
        no: "Non",
        closeButton: "Fermer",
        loading: "Chargement...",
        cancelButton: "Annuler",
        optional: "Optionnel",
        backToList: "Retour à la liste"
      },
      adminCentersPage: {
        title: "Gérer les Centres",
        addNewCenterButton: "Ajouter un Nouveau Centre",
        tableHeaderLogo: "Logo",
        tableHeaderName: "Nom",
        tableHeaderAffiliatedTo: "Affilié À",
        tableHeaderPhone: "Téléphone",
        tableHeaderActions: "Actions",
        logoAlt: "Logo de {{name}}",
        noLogo: "Aucun Logo",
        notAvailable: "N/D",
        openMenuSr: "Ouvrir le menu",
        actionViewDetails: "Voir les Détails",
        actionEdit: "Modifier",
        actionDelete: "Supprimer",
        noCentersFound: "Aucun centre trouvé.",
        dialogDescription: "Informations détaillées sur {{name}}.",
        dialogId: "ID",
        dialogDescriptionLabel: "Description",
        dialogAffiliation: "Affiliation",
        dialogAssociationName: "Nom de l'Association",
        dialogOtherAffiliationDetails: "Détails Autre Affiliation",
        dialogPhone: "Téléphone",
        dialogEmail: "E-mail",
        dialogAddress: "Adresse",
        dialogCity: "Ville",
        dialogSupervisor: "Superviseur",
        dialogActive: "Actif",
        dialogVerified: "Vérifié",
        dialogWebsite: "Site Web",
        dialogFacebook: "Facebook",
        dialogInstagram: "Instagram",
        dialogTwitter: "Twitter",
        dialogMapsLink: "Lien Maps",
        dialogCreatedAt: "Créé le",
        dialogLastUpdated: "Mis à jour le",
        dialogRoomsCount: "Nombre de Salles",
        dialogGroupsCount: "Nombre de Groupes",
        affiliationEntraide: "Entraide Nationale",
        affiliationAssociation: "Association",
        confirmDeleteCenter: "Êtes-vous sûr de vouloir supprimer le centre ID {{centerId}}?",
        loadingAuthAndCenters: "Authentification et chargement des centres...",
        loadingCenters: "Chargement des centres...",
        errorAuthNotAvailable: "Utilisateur non authentifié ou jeton non disponible.",
        errorAuthNotAvailableForDelete: "Jeton d'authentification non disponible pour la suppression.",
        errorLoadingDynamic: "Erreur lors du chargement des centres: {{message}}",
        errorDeletingCenter: "Erreur lors de la suppression du centre: {{message}}",
        addDialog: {
          title: "Ajouter un Nouveau Centre",
          description: "Remplissez les détails ci-dessous pour créer un nouveau centre.",
          labelName: "Nom du Centre",
          labelDescription: "Description",
          labelPhone: "Numéro de Téléphone",
          labelEmail: "Adresse E-mail",
          labelAddress: "Adresse",
          labelCity: "Ville",
          labelAffiliatedTo: "Affilié À",
          affiliationOther: "Autre",
          labelOtherAffiliation: "Spécifier l'Autre Affiliation",
          labelAssociationId: "ID Association",
          labelAssociation: "Association",
          selectAssociation: "Sélectionner une Association",
          placeholderAssociationId: "Entrez l'ID de l'association (si applicable)",
          labelSupervisorId: "ID Superviseur",
          labelSupervisor: "Superviseur",
          selectSupervisor: "Sélectionner un Superviseur",
          placeholderSupervisorId: "Entrez l'ID utilisateur du superviseur (si applicable)",
          submitButton: "Créer le Centre",
          errorNameRequired: "Le nom du centre est requis.",
          errorCreateCenter: "Une erreur inattendue s'est produite lors de la création du centre.",
          successMessage: "Centre créé avec succès !"
        }
      }
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
      goHome: 'العودة إلى الرئيسية',

      // Added for AdminCentersPage (Arabic)
      common: {
        yes: "نعم",
        no: "لا",
        closeButton: "إغلاق",
        loading: "جار التحميل...",
        cancelButton: "إلغاء",
        optional: "اختياري",
        backToList: "العودة للقائمة"
      },
      adminCentersPage: {
        title: "إدارة المراكز",
        addNewCenterButton: "إضافة مركز جديد",
        tableHeaderLogo: "الشعار",
        tableHeaderName: "الاسم",
        tableHeaderAffiliatedTo: "تابع لـ",
        tableHeaderPhone: "الهاتف",
        tableHeaderActions: "الإجراءات",
        logoAlt: "شعار {{name}}",
        noLogo: "لا يوجد شعار",
        notAvailable: "غير متاح",
        openMenuSr: "فتح القائمة",
        actionViewDetails: "عرض التفاصيل",
        actionEdit: "تعديل",
        actionDelete: "حذف",
        noCentersFound: "لم يتم العثور على مراكز.",
        dialogDescription: "معلومات مفصلة عن {{name}}.",
        dialogId: "المعرف",
        dialogDescriptionLabel: "الوصف",
        dialogAffiliation: "الانتماء",
        dialogAssociationName: "اسم الجمعية",
        dialogOtherAffiliationDetails: "تفاصيل الانتماء الآخر",
        dialogPhone: "الهاتف",
        dialogEmail: "البريد الإلكتروني",
        dialogAddress: "العنوان",
        dialogCity: "المدينة",
        dialogSupervisor: "المشرف",
        dialogActive: "نشط",
        dialogVerified: "موثق",
        dialogWebsite: "الموقع الإلكتروني",
        dialogFacebook: "فيسبوك",
        dialogInstagram: "انستجرام",
        dialogTwitter: "تويتر",
        dialogMapsLink: "رابط الخرائط",
        dialogCreatedAt: "تاريخ الإنشاء",
        dialogLastUpdated: "آخر تحديث",
        dialogRoomsCount: "عدد الغرف",
        dialogGroupsCount: "عدد المجموعات",
        affiliationEntraide: "التعاضدية الوطنية",
        affiliationAssociation: "جمعية",
        confirmDeleteCenter: "هل أنت متأكد أنك تريد حذف المركز رقم {{centerId}}؟",
        loadingAuthAndCenters: "جارٍ المصادقة وتحميل المراكز...",
        loadingCenters: "جارٍ تحميل المراكز...",
        errorAuthNotAvailable: "المستخدم غير مصادق عليه أو الرمز غير متوفر.",
        errorAuthNotAvailableForDelete: "رمز المصادقة غير متوفر لعملية الحذف.",
        errorLoadingDynamic: "خطأ في تحميل المراكز: {{message}}",
        errorDeletingCenter: "خطأ في حذف المركز: {{message}}",
        addDialog: {
          title: "إضافة مركز جديد",
          description: "املأ التفاصيل أدناه لإنشاء مركز جديد.",
          labelName: "اسم المركز",
          labelDescription: "الوصف",
          labelPhone: "رقم الهاتف",
          labelEmail: "البريد الإلكتروني",
          labelAddress: "العنوان",
          labelCity: "المدينة",
          labelAffiliatedTo: "تابع لـ",
          affiliationOther: "آخر",
          labelOtherAffiliation: "حدد الانتماء الآخر",
          labelAssociationId: "معرف الجمعية",
          labelAssociation: "الجمعية",
          selectAssociation: "اختر الجمعية",
          placeholderAssociationId: "أدخل معرف الجمعية (إن وجد)",
          labelSupervisorId: "معرف المشرف",
          labelSupervisor: "المشرف",
          selectSupervisor: "اختر المشرف",
          placeholderSupervisorId: "أدخل معرف مستخدم المشرف (إن وجد)",
          submitButton: "إنشاء المركز",
          errorNameRequired: "اسم المركز مطلوب.",
          errorCreateCenter: "حدث خطأ غير متوقع أثناء إنشاء المركز.",
          successMessage: "تم إنشاء المركز بنجاح!"
        }
      }
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