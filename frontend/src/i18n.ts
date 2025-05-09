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
        association: "Association",
        phone: "Phone",
        actions: "Actions"
      },
      actions: {
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        addSupervisor: "Add Supervisor",
        addAssociationSupervisor: "Add Association Supervisor"
      },
      supervisors: {
        fetchError: "Failed to fetch supervisors.",
        errorTitle: "Error",
        loading: "Loading supervisors...",
        noResults: "No supervisors found.",
        noCenterResults: "No Center supervisors found.",
        noAssociationResults: "No Association supervisors found.",
        addNew: "Add New Supervisor",
        addNewCenterSupervisor: "Add New Center Supervisor",
        addNewAssociationSupervisor: "Add New Association Supervisor",
        addNewTitle: "Add New Supervisor",
        addNewAssociationTitle: "Add New Association Supervisor",
        centerSupervisorsTitle: "Center Supervisors",
        associationSupervisorsTitle: "Association Supervisors",
        addError: {
          title: "Error Adding Supervisor",
          titleAssociation: "Error Adding Association Supervisor",
          generic: "Could not add supervisor. Please check the details and try again.",
          genericAssociation: "Could not add association supervisor. Please check the details and try again."
        },
        addSuccess: {
          title: "Success",
          titleAssociation: "Success Adding Association Supervisor",
          message: "Supervisor added successfully!",
          messageAssociation: "Association supervisor added successfully!"
        }
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
        },
        adminAddAssociationPage: {
          labelCity: "City",
          selectCity: "Select City",
          cities: {
            ksarElKebir: "Ksar El Kebir",
            larache: "Larache",
            boujdian: "Boujdian",
            ksarBjir: "Ksar Bjir",
            laouamra: "Laouamra",
            soukLQolla: "Souk L'Qolla",
            tatoft: "Tatoft",
            zouada: "Zouada",
            ayacha: "Ayacha",
            bniArouss: "Bni Arouss",
            bniGarfett: "Bni Garfett",
            zaaroura: "Zaaroura",
            ouladOuchih: "Oulad Ouchih",
            rissanaChamalia: "Rissana Chamalia",
            rissanaJanoubia: "Rissana Janoubia",
            sahel: "Sahel",
            souaken: "Souaken",
            soukTolba: "Souk Tolba"
          },
          title: "Add New Association",
          labels: {
            name: "Association Name",
            description: "Description",
            email: "Email",
            phoneNumber: "Phone Number",
            address: "Address",
            registrationNumber: "Registration Number",
            supervisor: "Supervisor",
            logo: "Logo",
            website: "Website URL",
            mapsLink: "Google Maps Link",
            facebookLink: "Facebook URL",
            instagramLink: "Instagram URL",
            twitterLink: "Twitter URL",
            contractStartDate: "Contract Start Date",
            contractEndDate: "Contract End Date"
          },
          sections: {
            contactSocialTitle: "Contact & Social Links (Optional)",
            contractInfoTitle: "Contract Information (Optional)"
          },
          placeholders: {
            websiteExample: "https://example.com"
          },
          buttons: {
            cancel: "Cancel",
            creating: "Creating...",
            createAssociation: "Create Association"
          },
          messages: {
            loadingSupervisorsError: "Failed to load potential supervisors.",
            authTokenNotFound: "Authentication token not found. Please log in.",
            supervisorNotSelected: "Please select a supervisor.",
            creationSuccess: "Association created successfully! Redirecting...",
            creationErrorDefault: "Failed to create association. Server response not JSON.",
            unknownError: "An unknown error occurred.",
            supervisorNameDisplay: "{{firstName}} {{lastName}} (ID: {{id}})"
          },
          supervisorDropdown: {
            select: "Select Supervisor",
            loading: "Loading supervisors...",
            noneAvailable: "No supervisors available",
            noAssociationSupervisors: "No association supervisors found.",
            availableSupervisorsLabel: "Available Supervisors"
          },
          requiredField: "*"
        },
      },
      fields: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        phoneNumberOptional: "Phone Number (Optional)",
        cinOptional: "National ID (CIN) (Optional)",
        birthDateOptional: "Birth Date (Optional)",
        birthCityOptional: "Birth City (Optional)",
        addressOptional: "Address (Optional)",
        cityOptional: "City (Optional)",
        profilePictureUrlOptional: "Profile Picture URL (Optional)",
        profilePictureUrlPlaceholder: "https://example.com/image.png",
        firstNameFrench: "First Name (French)",
        lastNameFrench: "Last Name (French)",
        firstNameArabic: "First Name (Arabic)",
        lastNameArabic: "Last Name (Arabic)",
        profilePictureOptional: "Profile Picture (Optional)"
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
        association: "Association",
        phone: "Téléphone",
        actions: "Actions"
      },
      actions: {
        edit: "Modifier",
        delete: "Supprimer",
        cancel: "Annuler",
        addSupervisor: "Ajouter un Superviseur",
        addAssociationSupervisor: "Ajouter un Superviseur d'Association"
      },
      supervisors: {
        fetchError: "Échec de la récupération des superviseurs.",
        errorTitle: "Erreur",
        loading: "Chargement des superviseurs...",
        noResults: "Aucun superviseur trouvé.",
        noCenterResults: "Aucun superviseur de centre trouvé.",
        noAssociationResults: "Aucun superviseur d'association trouvé.",
        addNew: "Ajouter un Nouveau Superviseur",
        addNewCenterSupervisor: "Ajouter un Nouveau Superviseur de Centre",
        addNewAssociationSupervisor: "Ajouter un Nouveau Superviseur d'Association",
        addNewTitle: "Ajouter un Nouveau Superviseur",
        addNewAssociationTitle: "Ajouter un Nouveau Superviseur d'Association",
        centerSupervisorsTitle: "Superviseurs de Centre",
        associationSupervisorsTitle: "Superviseurs d'Association",
        addError: {
          title: "Erreur lors de l'ajout du superviseur",
          titleAssociation: "Erreur lors de l'ajout du superviseur d'association",
          generic: "Impossible d'ajouter le superviseur. Veuillez vérifier les détails et réessayer.",
          genericAssociation: "Impossible d'ajouter le superviseur d'association. Veuillez vérifier les détails et réessayer."
        },
        addSuccess: {
          title: "Succès",
          titleAssociation: "Succès lors de l'ajout du superviseur d'association",
          message: "Superviseur ajouté avec succès !",
          messageAssociation: "Superviseur d'association ajouté avec succès !"
        }
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
        },
        adminAddAssociationPage: {
          labelCity: "Ville",
          selectCity: "Sélectionner une ville",
          cities: {
            ksarElKebir: "Ksar El Kebir",
            larache: "Larache",
            boujdian: "Boujdian",
            ksarBjir: "Ksar Bjir",
            laouamra: "Laouamra",
            soukLQolla: "Souk L'Qolla",
            tatoft: "Tatoft",
            zouada: "Zouada",
            ayacha: "Ayacha",
            bniArouss: "Bni Arouss",
            bniGarfett: "Bni Garfett",
            zaaroura: "Zaaroura",
            ouladOuchih: "Oulad Ouchih",
            rissanaChamalia: "Rissana Chamalia",
            rissanaJanoubia: "Rissana Janoubia",
            sahel: "Sahel",
            souaken: "Souaken",
            soukTolba: "Souk Tolba"
          },
          title: "Ajouter une Nouvelle Association",
          labels: {
            name: "Nom de l'Association",
            description: "Description",
            email: "E-mail",
            phoneNumber: "Numéro de Téléphone",
            address: "Adresse",
            registrationNumber: "Numéro d'Enregistrement",
            supervisor: "Superviseur",
            logo: "Logo",
            website: "URL du Site Web",
            mapsLink: "Lien Google Maps",
            facebookLink: "URL Facebook",
            instagramLink: "URL Instagram",
            twitterLink: "URL Twitter",
            contractStartDate: "Date de Début du Contrat",
            contractEndDate: "Date de Fin du Contrat"
          },
          sections: {
            contactSocialTitle: "Contacts et Liens Sociaux (Optionnel)",
            contractInfoTitle: "Informations sur le Contrat (Optionnel)"
          },
          placeholders: {
            websiteExample: "https://exemple.com"
          },
          buttons: {
            cancel: "Annuler",
            creating: "Création en cours...",
            createAssociation: "Créer l'Association"
          },
          messages: {
            loadingSupervisorsError: "Échec du chargement des superviseurs potentiels.",
            authTokenNotFound: "Jeton d'authentification introuvable. Veuillez vous connecter.",
            supervisorNotSelected: "Veuillez sélectionner un superviseur.",
            creationSuccess: "Association créée avec succès ! Redirection...",
            creationErrorDefault: "Échec de la création de l'association. Réponse du serveur non JSON.",
            unknownError: "Une erreur inconnue s'est produite.",
            supervisorNameDisplay: "{{firstName}} {{lastName}} (ID : {{id}})"
          },
          supervisorDropdown: {
            select: "Sélectionner un Superviseur",
            loading: "Chargement des superviseurs...",
            noneAvailable: "Aucun superviseur disponible",
            noAssociationSupervisors: "Aucun superviseur d'association trouvé.",
            availableSupervisorsLabel: "Superviseurs Disponibles"
          },
          requiredField: "*"
        }
      },
      fields: {
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        password: "Mot de Passe",
        phoneNumberOptional: "Numéro de Téléphone (Optionnel)",
        cinOptional: "CIN (Optionnel)",
        birthDateOptional: "Date de Naissance (Optionnel)",
        birthCityOptional: "Ville de Naissance (Optionnel)",
        addressOptional: "Adresse (Optionnel)",
        cityOptional: "Ville (Optionnel)",
        profilePictureUrlOptional: "URL de la Photo de Profil (Optionnel)",
        profilePictureUrlPlaceholder: "https://example.com/image.png",
        firstNameFrench: "Prénom (Français)",
        lastNameFrench: "Nom (Français)",
        firstNameArabic: "Prénom (Arabe)",
        lastNameArabic: "Nom (Arabe)",
        profilePictureOptional: "Photo de Profil (Optionnel)"
      }
    }
  },
  ar: {
    translation: {
      // Navbar
      navbarLogo: 'التعاون الوطني',
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
      welcome: 'مرحباً بكم في التعاون الوطني!',
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
        association: "الجمعية",
        phone: "الهاتف",
        actions: "الإجراءات"
      },
      actions: {
        edit: "تعديل",
        delete: "حذف",
        cancel: "إلغاء",
        addSupervisor: "إضافة مشرف",
        addAssociationSupervisor: "إضافة مشرف جمعية"
      },
      supervisors: {
        fetchError: "فشل في جلب المشرفين.",
        errorTitle: "خطأ",
        loading: "جاري تحميل المشرفين...",
        noResults: "لم يتم العثور على مشرفين.",
        noCenterResults: "لم يتم العثور على مشرفي مراكز.",
        noAssociationResults: "لم يتم العثور على مشرفي جمعيات.",
        addNew: "إضافة مشرف جديد",
        addNewCenterSupervisor: "إضافة مشرف مركز جديد",
        addNewAssociationSupervisor: "إضافة مشرف جمعية جديد",
        addNewTitle: "إضافة مشرف جديد",
        addNewAssociationTitle: "إضافة مشرف جمعية جديد",
        centerSupervisorsTitle: "مشرفو المراكز",
        associationSupervisorsTitle: "مشرفو الجمعيات",
        addError: {
          title: "خطأ في إضافة المشرف",
          titleAssociation: "خطأ في إضافة مشرف الجمعية",
          generic: "تعذر إضافة المشرف. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
          genericAssociation: "تعذر إضافة مشرف الجمعية. يرجى التحقق من التفاصيل والمحاولة مرة أخرى."
        },
        addSuccess: {
          title: "نجاح",
          titleAssociation: "نجاح إضافة مشرف الجمعية",
          message: "تمت إضافة المشرف بنجاح!",
          messageAssociation: "تمت إضافة مشرف الجمعية بنجاح!"
        }
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
        affiliationEntraide: "التعاون الوطني",
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
        },
        adminAddAssociationPage: {
          labelCity: "المدينة",
          selectCity: "اختر مدينة",
          cities: {
            ksarElKebir: "القصر الكبير",
            larache: "العرائش",
            boujdian: "بوجديان",
            ksarBjir: "قصر بجير",
            laouamra: "العوامرة",
            soukLQolla: "سوق القلة",
            tatoft: "تاطفت",
            zouada: "زوادة",
            ayacha: "عياشة",
            bniArouss: "بني عروس",
            bniGarfett: "بني قرفط",
            zaaroura: "زعرورة",
            ouladOuchih: "أولاد أوشيح",
            rissanaChamalia: "ريصانة الشمالية",
            rissanaJanoubia: "ريصانة الجنوبية",
            sahel: "الساحل",
            souaken: "سواكن",
            soukTolba: "سوق الطلبة"
          },
          title: "إضافة جمعية جديدة",
          labels: {
            name: "اسم الجمعية",
            description: "الوصف",
            email: "البريد الإلكتروني",
            phoneNumber: "رقم الهاتف",
            address: "العنوان",
            registrationNumber: "رقم التسجيل",
            supervisor: "المشرف",
            logo: "الشعار",
            website: "رابط الموقع",
            mapsLink: "رابط خرائط جوجل",
            facebookLink: "رابط فيسبوك",
            instagramLink: "رابط انستجرام",
            twitterLink: "رابط تويتر",
            contractStartDate: "تاريخ بدء العقد",
            contractEndDate: "تاريخ انتهاء العقد"
          },
          sections: {
            contactSocialTitle: "معلومات الاتصال والروابط الاجتماعية (اختياري)",
            contractInfoTitle: "معلومات العقد (اختياري)"
          },
          placeholders: {
            websiteExample: "https://example.com"
          },
          buttons: {
            cancel: "إلغاء",
            creating: "جارٍ الإنشاء...",
            createAssociation: "إنشاء الجمعية"
          },
          messages: {
            loadingSupervisorsError: "فشل تحميل المشرفين المحتملين.",
            authTokenNotFound: "لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.",
            supervisorNotSelected: "يرجى اختيار مشرف.",
            creationSuccess: "تم إنشاء الجمعية بنجاح! جارٍ إعادة التوجيه...",
            creationErrorDefault: "فشل إنشاء الجمعية. استجابة الخادم ليست بتنسيق JSON.",
            unknownError: "حدث خطأ غير معروف.",
            supervisorNameDisplay: "{{firstName}} {{lastName}} (المعرف: {{id}})"
          },
          supervisorDropdown: {
            select: "اختر مشرفًا",
            loading: "جارٍ تحميل المشرفين...",
            noneAvailable: "لا يوجد مشرفون متاحون",
            noAssociationSupervisors: "لم يتم العثور على مشرفي جمعيات.",
            availableSupervisorsLabel: "المشرفون المتاحون"
          },
          requiredField: "*"
        }
      },
      fields: {
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        phoneNumberOptional: "رقم الهاتف (اختياري)",
        cinOptional: "رقم البطاقة الوطنية (اختياري)",
        birthDateOptional: "تاريخ الميلاد (اختياري)",
        birthCityOptional: "مكان الميلاد (اختياري)",
        addressOptional: "العنوان (اختياري)",
        cityOptional: "المدينة (اختياري)",
        profilePictureUrlOptional: "رابط صورة الملف الشخصي (اختياري)",
        profilePictureUrlPlaceholder: "https://example.com/image.png",
        firstNameFrench: "الاسم الأول (فرنسي)",
        lastNameFrench: "اسم العائلة (فرنسي)",
        firstNameArabic: "الاسم الأول (عربي)",
        lastNameArabic: "اسم العائلة (عربي)",
        profilePictureOptional: "صورة الملف الشخصي (اختياري)"
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