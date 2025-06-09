export const fr = {
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
      students: "Étudiants",
      // Added for Center Supervisor (French)
      centerInfo: "Infos du Centre",
      rooms: "Salles",
      equipment: "Équipement",
      groups: "Groupes",
      schedules: "Horaires",
      attendance: "Présence",
      trainingPrograms: "Programmes de Formation",
      trainingCourses: "Cours de Formation",
      annualCourseDistribution: "Répartition Annuelle des Cours",
      courses: "Cours",
      // Added for Trainer
      myClasses: "Mes classes",
      schedule: "Horaire",
      materials: "Matériaux",
      exams: {
        comingSoon: "Bientôt Disponible"
      },
      sections: {
        overview: "Aperçu",
        hr: "Gestion RH",
        center: "Gestion du Centre",
        programme: "Gestion des Programmes",
        trainings: "Formations",
        exams: "Examens",
        classes: "Classes",
        students: "Étudiants",
        courses: "Cours"
      }
    },
    table: {
      avatar: "Avatar",
      fullName: "Nom Complet",
      center: "Centre",
      association: "Association",
      phone: "Téléphone",
      actions: "Actions",
      attendance: "Présence",
      trainingPrograms: "Programmes de Formation",
      trainingCourses: "Cours de Formation",
      annualCourseDistribution: "Répartition Annuelle des Cours",
      courses: "Cours",
      exams: {
        comingSoon: "Bientôt Disponible"
      },
      sections: {
        overview: "Aperçu",
        hr: "Gestion RH",
        center: "Gestion du Centre",
        programme: "Gestion des Programmes",
        trainings: "Formations",
        exams: "Examens"
      }
    },
    actions: {
      edit: "Modifier",
      delete: "Supprimer",
      cancel: "Annuler",
      addSupervisor: "Ajouter un Superviseur",
      addAssociationSupervisor: "Ajouter un Superviseur d'Association",
      added: "Ajouté"
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
        genericAssociation: "Impossible d'ajouter le superviseur d'association. Veuillez vérifier les détails et réessayer.",
        authRequired: "Authentification requise.",
        genericDialog: "Échec de l'ajout du superviseur.",
        titleDialog: "Erreur",
        genericCenterDialog: "Échec de l'ajout du superviseur de centre.",
        titleCenterDialog: "Erreur d'ajout du superviseur de centre"
      },
      addSuccess: {
        title: "Succès",
        titleAssociation: "Succès lors de l'ajout du superviseur d'association",
        message: "Superviseur ajouté avec succès !",
        messageAssociation: "Superviseur d'association ajouté avec succès !",
        titleDialog: "Succès",
        messageDialog: "Superviseur ajouté avec succès !",
        messageCenterDialog: "Superviseur de centre ajouté avec succès !",
        titleCenterDialog: "Superviseur de centre ajouté"
      },
      // Dialog specific translations
      addNewDialogTitle: "Ajouter un Nouveau Superviseur d'Association",
      addNewDialogDescription: "Remplissez les détails pour créer un nouveau superviseur. L'email et le mot de passe seront auto-générés.",
      addNewCenterSupervisorDialogTitle: "Ajouter un Nouveau Superviseur de Centre",
      addNewCenterSupervisorDialogDescription: "Remplissez les détails pour créer un nouveau superviseur de centre. L'email et le mot de passe seront auto-générés."
    },
    // Dashboards (generic)
    adminDashboardTitle: 'Tableau de Bord Admin',
    welcomeAdmin: 'Bienvenue, Admin!',
    centerDashboardTitle: 'Tableau de Bord Centre',
    welcomeCenterSupervisor: 'Bienvenue, Superviseur du Centre ! Gérez votre centre d\'ici.',
    associationDashboardTitle: 'Tableau de Bord Superviseur Association',
    welcomeAssociationSupervisor: 'Bienvenue, Superviseur Association!',
    trainerDashboardTitle: 'Tableau de Bord Formateur',
    welcomeTrainer: 'Bienvenue, Formateur!',
    studentDashboardTitle: 'Tableau de Bord Étudiant',
    welcomeStudent: 'Bienvenue, Étudiant!',
    // Center Students Page (French)
    centerStudentsPageTitle: 'Gérer les Étudiants du Centre',
    manageCenterStudentsMessage: 'Ici, vous pouvez gérer tous les étudiants inscrits dans votre centre.',
    
    centerStudentsPage: {
      pageTitle: "Étudiants à {{centerName}}",
      pageSubtitle: "Gérez tous les {{count}} étudiants de votre centre.",
      addNewStudentButton: "Ajouter Nouvel Étudiant",
      loadingMessage: "Chargement des étudiants du centre...",
      errorFetching: "Erreur lors de la récupération des données d'étudiants pour le superviseur du centre :",
      errorFetchingDetail: "Échec de la récupération des informations sur les étudiants. Veuillez vous assurer que votre centre existe et que des étudiants y sont inscrits.",
      noStudentsTitle: "Aucun Étudiant Trouvé à {{centerName}}",
      noStudentsDescription: "Aucun étudiant n'est actuellement inscrit dans ce centre. Vous pouvez ajouter des étudiants via le portail de gestion des étudiants.",
      noStudentsFound: "Aucun étudiant trouvé.",
      noStudentsMatchFilter: "Aucun étudiant ne correspond aux filtres actuels.",
      noCenterAssigned: "Aucun centre n'est actuellement attribué à ce compte superviseur, ou les données du centre n'ont pas pu être récupérées.",
      noCenterDataTitle: "Données du Centre Non Disponibles",
      noCenterDataDescription: "Impossible de charger les données du centre. Veuillez réessayer plus tard ou contacter le support.",
      accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
      errorAuthNotAvailable: "Utilisateur non authentifié ou token non disponible.",
      searchPlaceholder: "Rechercher des étudiants par nom, email ou ID d'examen...",
      filterByProgram: "Filtrer par Programme",
      filterByGroup: "Filtrer par Groupe",
      allPrograms: "Tous les Programmes",
      allGroups: "Tous les Groupes",
      studentsListTitle: "Liste des Étudiants",
      noGroup: "Aucun Groupe",
      noCourse: "Aucun Cours",
      openMenu: "Ouvrir le menu",
      tableHeaders: {
        student: "Étudiant",
        examId: "ID d'Examen",
        program: "Programme",
        group: "Groupe",
        academicYear: "Année Académique",
        joiningDate: "Date d'Inscription",
        actions: "Actions"
      },
      actions: {
        viewDetails: "Voir les Détails",
        edit: "Modifier",
        delete: "Supprimer",
        confirmDeactivate: "Êtes-vous sûr de vouloir désactiver cet étudiant ? Il ne pourra plus accéder au système."
      },
      dialogDescription: "Informations détaillées sur l'étudiant.",
      dialogSections: {
        studentInfo: "Informations de l'Étudiant",
        personalInfo: "Informations Personnelles",
        contactInfo: "Coordonnées",
        profilePicture: "Photo de Profil"
      },
      dialogLabels: {
        examId: "ID d'Examen",
        program: "Programme",
        group: "Groupe",
        academicYear: "Année Académique",
        joiningDate: "Date d'Inscription",
        trainingCourse: "Cours de Formation",
        centerCode: "Code du Centre",
        user: {
          email: "Email",
          username: "Nom d'utilisateur",
          arabicFirstName: "Prénom (Arabe)",
          arabicLastName: "Nom (Arabe)",
          birthDate: "Date de Naissance",
          birthCity: "Ville de Naissance",
          cin: "CIN",
          role: "Rôle",
          phoneNumber: "Numéro de Téléphone",
          address: "Adresse",
          city: "Ville"
        }
      }
    },
    // Not Found Page
    notFoundTitle: '404 - Page Non Trouvée',
    goHome: 'Retour à l\'accueil',

    // AdminCenterDetailsPage translations
    adminCenterDetailsPage: {
      errorNoCenterId: 'ID du centre non fourni',
      errorAuthRequired: 'Authentification requise',
      errorFetchingDetails: 'Échec de la récupération des détails du centre',
      loadingDetails: 'Chargement des détails du centre...',
      backToCenters: 'Retour aux Centres',
      centerNotFoundTitle: 'Centre Non Trouvé',
      centerNotFoundDescription: 'Le centre demandé n\'a pas pu être trouvé.',
      editCenter: 'Modifier le Centre',
      deleteCenter: 'Supprimer le Centre',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce centre ? Cette action ne peut pas être annulée.',
      errorDeleting: 'Échec de la suppression du centre',
      
      // Tab names
      tabGeneral: 'Infos Générales',
      tabContact: 'Contact et Liens',
      tabRooms: 'Salles',
      tabGroups: 'Groupes',
      tabStudents: 'Étudiants',
      tabTrainers: 'Formateurs',
      
      // General Info section
      generalInfo: {
        title: 'Informations Générales',
        basicInfo: 'Informations de Base',
        id: 'ID',
        affiliation: 'Affiliation',
        association: 'Association',
        otherAffiliation: 'Autre Affiliation',
        supervisor: 'Superviseur',
        supervisorName: 'Nom',
        supervisorUsername: 'Nom d\'utilisateur',
        noSupervisor: 'Aucun superviseur assigné',
        statistics: 'Statistiques',
        roomsCount: 'Salles',
        groupsCount: 'Groupes',
        timestamps: 'Horodatages',
        createdAt: 'Créé le',
        updatedAt: 'Dernière mise à jour'
      },
      
      // Contact section
      contact: {
        title: 'Informations de Contact et Liens',
        contactInfo: 'Informations de Contact',
        email: 'E-mail',
        phone: 'Téléphone',
        address: 'Adresse',
        city: 'Ville',
        location: 'Emplacement',
        viewOnMap: 'Voir sur la Carte',
        socialLinks: 'Site Web et Réseaux Sociaux',
        website: 'Site Web',
        facebook: 'Facebook',
        instagram: 'Instagram',
        twitter: 'Twitter',
        viewProfile: 'Voir le Profil',
        noSocialLinks: 'Aucun site web ou lien de réseau social disponible'
      },
      
      // Rooms section
      rooms: {
        description: 'Toutes les salles disponibles dans ce centre',
        capacity: 'Capacité',
        available: 'Disponible',
        equipment: 'Équipement',
        items: 'articles',
        viewDetails: 'Voir les Détails',
        noRooms: 'Aucune salle trouvée pour ce centre'
      },
      
      // Groups section
      groups: {
        description: 'Tous les groupes d\'étudiants de ce centre',
        createdAt: 'Créé le',
        updatedAt: 'Mis à jour le',
        viewDetails: 'Voir les Détails',
        noGroups: 'Aucun groupe trouvé pour ce centre'
      },

      // Students section
      students: {
        description: 'Tous les étudiants inscrits dans ce centre',
        searchPlaceholder: 'Rechercher des étudiants par nom, email ou ID d\'examen...',
        filterByStatus: 'Filtrer par Statut',
        filterByProgram: 'Filtrer par Programme',
        allStatuses: 'Tous les Statuts',
        allPrograms: 'Tous les Programmes',
        statusActive: 'Actif',
        statusInactive: 'Inactif',
        clearFilters: 'Effacer les Filtres',
        resultsCount: 'Affichage de {{count}} sur {{total}} étudiants',
        noStudents: 'Aucun étudiant trouvé pour ce centre',
        noStudentsMatchFilters: 'Aucun étudiant ne correspond aux filtres actuels',
        tableHeaders: {
          examId: 'ID d\'Examen',
          name: 'Nom',
          email: 'Email',
          phone: 'Téléphone',
          program: 'Programme',
          joiningDate: 'Date d\'Inscription',
          status: 'Statut'
        }
      },

      // Trainers section
      trainers: {
        description: 'Tous les formateurs affectés à ce centre',
        searchPlaceholder: 'Rechercher des formateurs par nom ou email...',
        filterByStatus: 'Filtrer par Statut',
        filterByContract: 'Filtrer par Contrat',
        filterByProgram: 'Filtrer par Programme',
        allStatuses: 'Tous les Statuts',
        allContracts: 'Tous les Contrats',
        allPrograms: 'Tous les Programmes',
        statusActive: 'Actif',
        statusInactive: 'Inactif',
        contractEntraide: 'Entraide Nationale',
        contractAssociation: 'Association',
        clearFilters: 'Effacer les Filtres',
        resultsCount: 'Affichage de {{count}} sur {{total}} formateurs',
        noTrainers: 'Aucun formateur trouvé pour ce centre',
        noTrainersMatchFilters: 'Aucun formateur ne correspond aux filtres actuels',
        tableHeaders: {
          name: 'Nom',
          email: 'Email',
          phone: 'Téléphone',
          program: 'Programme',
          contractWith: 'Contrat Avec',
          contractPeriod: 'Période de Contrat',
          status: 'Statut'
        }
      }
    },

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
      searchPlaceholder: "Rechercher des centres...",
      filterByCity: "Ville",
      allCities: "Toutes les Villes",
      filterByAffiliation: "Affiliation",
      allAffiliations: "Toutes les Affiliations",
      affiliationOther: "Autre",
      filterByStatus: "Statut",
      allStatuses: "Tous",
      statusActive: "Actif",
      statusInactive: "Inactif",
      filterByVerified: "Vérifié",
      allVerificationStatuses: "Tous",
      verifiedOnly: "Vérifié",
      unverifiedOnly: "Non Vérifié",
      clearFilters: "Effacer les Filtres",
      resultsCount: "Affichage de {{count}} sur {{total}} centres",
      noCentersMatchFilters: "Aucun centre ne correspond à vos filtres actuels",
      tableHeaderLogo: "Logo",
      tableHeaderName: "Nom",
      tableHeaderAffiliatedTo: "Affilié À",
      tableHeaderSupervisorName: "Nom du Superviseur",
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
        successMessage: "Centre créé avec succès !",
        selectCityPlaceholder: "Sélectionner une ville",
        labelLogo: "Logo du Centre",
        buttons: {
          addSupervisorShort: "Ajouter Nouveau Sup."
        },
        messages: {
          centerSupervisorAddedSuccessfully: "Nouveau superviseur de centre ajouté et sélectionné."
        }
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
          createAssociation: "Créer l'Association",
          addSupervisorShort: "Ajouter"
        },
        messages: {
          loadingSupervisorsError: "Échec du chargement des superviseurs potentiels.",
          authTokenNotFound: "Jeton d'authentification introuvable. Veuillez vous connecter.",
          supervisorNotSelected: "Veuillez sélectionner un superviseur.",
          creationSuccess: "Association créée avec succès ! Redirection...",
          creationErrorDefault: "Échec de la création de l'association. Réponse du serveur non JSON.",
          unknownError: "Une erreur inconnue s'est produite.",
          supervisorNameDisplay: "{{firstName}} {{lastName}} (ID : {{id}})",
          supervisorNameDisplayWithArabic: "{{firstName}} {{lastName}} ({{arabicFirstName}} {{arabicLastName}})",
          supervisorAddedSuccessfully: "Nouveau superviseur ajouté et sélectionné."
        },
        supervisorDropdown: {
          select: "Sélectionner un Superviseur",
          loading: "Chargement des superviseurs...",
          noneAvailable: "Aucun superviseur disponible",
          noAssociationSupervisors: "Aucun superviseur d'association trouvé.",
          availableSupervisorsLabel: "المشرفون المتاحون"
        },
        requiredField: "*",
        addError: {
          title: "Error",
          titleAssociation: "Error",
          generic: "Could not add supervisor. Please check the details and try again.",
          genericAssociation: "Could not add association supervisor. Please check the details and try again.",
          authRequired: "Authentication required.",
          genericDialog: "Échec de l'ajout du superviseur.",
          titleDialog: "Erreur",
          genericCenterDialog: "Échec de l'ajout du superviseur de centre.",
          titleCenterDialog: "Erreur d'ajout du superviseur de centre"
        },
        addSuccess: {
          title: "Succès",
          titleAssociation: "Succès lors de l'ajout du superviseur d'association",
          message: "Superviseur ajouté avec succès !",
          messageAssociation: "Superviseur d'association ajouté avec succès !",
          titleDialog: "Succès",
          messageDialog: "Superviseur ajouté avec succès !",
          messageCenterDialog: "Superviseur de centre ajouté avec succès !",
          titleCenterDialog: "Superviseur de centre ajouté"
        },
        // Dialog specific translations
        addNewDialogTitle: "Ajouter un Nouveau Superviseur d'Association",
        addNewDialogDescription: "Remplissez les détails pour créer un nouveau superviseur. L'email et le mot de passe seront auto-générés.",
        addNewCenterSupervisorDialogTitle: "Ajouter un Nouveau Superviseur de Centre",
        addNewCenterSupervisorDialogDescription: "Remplissez les détails pour créer un nouveau superviseur de centre. L'email et le mot de passe seront auto-générés."
      },
    },
    adminAssociationsPage: {
      title: "Gérer les Associations",
      addNewAssociationButton: "Ajouter une Nouvelle Association",
      searchPlaceholder: "Rechercher des associations...",
      filterByCity: "Ville",
      allCities: "Toutes les Villes",
      filterByStatus: "Statut",
      allStatuses: "Tous",
      statusActive: "Actif",
      statusInactive: "Inactif",
      filterByVerified: "Vérifié",
      allVerificationStatuses: "Tous",
      verifiedOnly: "Vérifié",
      unverifiedOnly: "Non Vérifié",
      clearFilters: "Effacer les Filtres",
      resultsCount: "Affichage de {{count}} sur {{total}} associations",
      loadingAssociations: "Chargement des associations...",
      confirmDeleteAssociation: "Êtes-vous sûr de vouloir supprimer l'association {{associationId}}?",
      errorDeletingAssociation: "Erreur lors de la suppression de l'association: {{message}}",
      logoAlt: "Logo de {{name}}",
      notAvailable: "N/D",
      openMenuSr: "Ouvrir le menu",
      actionViewDetails: "Voir les Détails",
      actionEdit: "Modifier",
      actionDelete: "Supprimer",
      noAssociationsMatchFilters: "Aucune association ne correspond à vos filtres actuels",
      noAssociationsFound: "Aucune association trouvée",
      adminAssociationDetailsPage: {
        errorNoAssociationId: 'ID association non fourni',
        errorAuthRequired: 'Authentification requise',
        errorFetchingDetails: 'Échec de la récupération des détails de l\'association',
        loadingDetails: 'Chargement des détails de l\'association...',
        backToAssociations: 'Retour aux Associations',
        associationNotFoundTitle: 'Association Non Trouvée',
        associationNotFoundDescription: 'L\'association demandée n\'a pas pu être trouvée.',
        editAssociation: 'Modifier l\'Association',
        deleteAssociation: 'Supprimer l\'Association',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette association ? Cette action ne peut pas être annulée.',
        errorDeleting: 'Échec de la suppression de l\'association',
        statusActive: 'Actif',
        statusInactive: 'Inactif',
        statusVerified: 'Vérifié',
        statusUnverified: 'Non Vérifié',
        notAvailable: 'N/D',
        
        // Tab names
        tabGeneral: 'Infos Générales',
        tabContact: 'Contact et Liens',
        tabCenters: 'Centres',
        tabContract: 'Contrat',
        
        // General Info section
        generalInfo: {
          title: 'Informations Générales',
          basicInfo: 'Informations de Base',
          id: 'ID',
          description: 'Description',
          registrationNumber: 'Numéro d\'Enregistrement',
          supervisor: 'Superviseur',
          supervisorName: 'Nom',
          supervisorEmail: 'Email',
          noSupervisor: 'Aucun superviseur assigné',
          statistics: 'Statistiques',
          centersCount: 'Centres',
          timestamps: 'Horodatages',
          createdAt: 'Créé le',
          updatedAt: 'Dernière mise à jour'
        },
        
        // Contact section
        contact: {
          title: 'Informations de Contact et Liens',
          contactInfo: 'Informations de Contact',
          email: 'Email',
          phone: 'Téléphone',
          address: 'Adresse',
          city: 'Ville',
          location: 'Emplacement',
          viewOnMap: 'Voir sur la Carte',
          socialLinks: 'Site Web et Réseaux Sociaux',
          website: 'Site Web',
          facebook: 'Facebook',
          instagram: 'Instagram',
          twitter: 'Twitter',
          noSocialLinks: 'Aucun site web ou lien de réseau social disponible'
        },
        
        // Centers section
        centers: {
          title: 'Centres Associés',
          description: 'Tous les centres affiliés à cette association',
          active: 'Actif',
          inactive: 'Inactif',
          verified: 'Vérifié',
          unverified: 'Non Vérifié',
          viewDetails: 'Voir les Détails',
          noCenters: 'Aucun centre trouvé pour cette association'
        },
        
        // Contract section
        contract: {
          title: 'Informations sur le Contrat',
          startDate: 'Date de Début du Contrat',
          endDate: 'Date de Fin du Contrat',
          noContractInfo: 'Aucune information de contrat disponible'
        }
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
      profilePictureUrlPlaceholder: "https://exemple.com/image.png",
      firstNameFrench: "Prénom (Français)",
      lastNameFrench: "Nom (Français)",
      firstNameArabic: "Prénom (Arabe)",
      lastNameArabic: "Nom (Arabe)",
      profilePictureOptional: "Photo de Profil (Optionnel)"
    },
    trainingPrograms: {
      title: "Programmes de Formation",
      addNew: "Ajouter un Nouveau Programme",
      noPrograms: "Aucun programme de formation trouvé.",
      error: {
        notAuthenticated: "Jeton d'authentification manquant. Veuillez vous connecter.",
        unknown: "Une erreur inconnue s'est produite lors de la récupération des programmes."
      }
    },
    adminAddTrainingProgram: {
      title: "Ajouter un Nouveau Programme de Formation",
      backButton: "Retour aux Programmes",
      labels: {
        name: "Nom du Programme",
        description: "Description",
        durationYears: "Durée (Années)",
        logo: "Logo (Optionnel)"
      },
      placeholders: {
        name: "Entrez le nom du programme",
        description: "Entrez la description du programme",
        durationYears: "ex: 2"
      },
      buttons: {
        create: "Créer le Programme",
        creating: "Création en cours..."
      },
      validation: {
        nameRequired: "Le nom du programme est requis.",
        descriptionRequired: "La description est requise.",
        durationRequired: "La durée est requise.",
        durationPositive: "La durée doit être un nombre positif."
      },
      messages: {
        success: "Programme de formation créé avec succès !",
        errorDefault: "Échec de la création du programme de formation. Veuillez vérifier les détails et réessayer.",
        errorConflict: "Un programme de formation avec ce nom existe déjà."
      }
    },
    centerInfoPage: {
      tabGeneralInfo: "Infos Générales",
      tabContactLinks: "Contact et Liens",
      tabRooms: "Salles",
      tabGroups: "Groupes",
      generalInfo: {
        title: "Informations Générales",
        affiliatedTo: "Affilié à :",
        association: "Association :",
        status: "Statut :",
        active: "Actif",
        inactive: "Inactif",
        verified: "(Vérifié)",
        notVerified: "(Non Vérifié)",
        registeredOn: "Inscrit le :",
        lastUpdated: "Mis à jour le"
      },
      contactLinks: {
        title: "Contact et Liens",
        email: "E-mail :",
        phone: "Téléphone :",
        address: "Adresse :",
        location: "Emplacement :",
        website: "Site Web :",
        facebook: "Facebook :",
        instagram: "Instagram :",
        twitter: "Twitter :",
        viewOnMap: "Voir sur la Carte",
        viewProfile: "Voir le Profil"
      },
      rooms: {
        title: "Salles ({{count}})",
        description: "Détails sur les salles disponibles du centre.",
        capacity: "Capacité :",
        available: "Disponible :",
        equipment: "Équipement",
        equipmentItems: "{{count}} article(s)",
        noRooms: "Aucune salle répertoriée pour ce centre.",
        created: "Créé le",
        updated: "Mis à jour le",
        type: "Type",
        noEquipment: "Aucun équipement répertorié pour cette salle."
      },
      equipment: { // Added section for shared equipment keys in tables (French)
        name: "Nom",
        quantityShort: "Qté",
        condition: "État"
      },
      groups: {
        title: "Groupes ({{count}})",
        description: "Détails sur les groupes d'étudiants du centre.",
        noGroups: "Aucun groupe répertorié pour ce centre."
      }
    },
    centerRoomsPage: {
      noCenterAssigned: "Aucun centre n'est actuellement attribué à ce compte superviseur, ou les données du centre n'ont pas pu être récupérées.",
      errorFetching: "Erreur lors de la récupération des informations sur les salles du centre pour le superviseur :",
      errorFetchingDetail: "Échec de la récupération des informations sur les salles du centre. Veuillez vous assurer que vous êtes affecté superviseur à un centre et que le centre dispose de salles.",
      accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
      loadingMessage: "Chargement des salles du centre...",
      noRoomsTitle: "Aucune Salle Trouvée à {{centerName}}",
      noCenterDataTitle: "Données du Centre Non Disponibles",
      noRoomsDescription: "Aucune salle n'est actuellement répertoriée pour ce centre. Vous pouvez ajouter des salles via le portail de gestion du centre.",
      noCenterDataDescription: "Impossible de charger les données du centre. Veuillez réessayer plus tard ou contacter le support.",
      pageTitle: "Salles à {{centerName}}",
      pageSubtitle: "Parcourez et gérez les {{count}} salles disponibles dans votre centre.",
      addNewRoomButton: "Ajouter Nouvelle Salle",
      viewDetailsButton: "Voir les détails"
    },
    centerAddRoomPage: {
      errorNoCenterSupervised: "Aucun centre supervisé par ce compte. Impossible d'ajouter une salle.",
      errorFetchingCenterId: "Échec de la récupération de l'ID du centre de supervision. Veuillez réessayer.",
      errorCenterIdNotSet: "L'ID du centre de supervision n'est pas défini. Impossible de soumettre le formulaire.",
      errorCreatingRoom: "Une erreur s'est produite lors de la création de la salle. Veuillez vérifier votre saisie et réessayer.",
      loadingCenterInfo: "Chargement des informations du centre...",
      errorCritical: "Erreur Critique",
      errorNoCenterAssociatedAccount: "Aucun centre n'est associé à ce compte superviseur. Veuillez contacter l'administration.",
      backToRoomsList: "Retour à la Liste des Salles",
      title: "Ajouter Nouvelle Salle",
      description: "Remplissez les détails ci-dessous pour ajouter une nouvelle salle à votre centre.",
      labels: {
        name: "Nom de la Salle",
        description: "Description",
        type: "Type de Salle",
        capacity: "Capacité",
        isAvailable: "Est Disponible",
        picture: "Image de la Salle"
      },
      placeholders: {
        selectType: "Sélectionner le type de salle"
      },
      buttons: {
        createRoom: "Créer la Salle"
      },
      validation: {
        nameRequired: "Le nom de la salle est requis.",
        typeRequired: "Le type de salle est requis.",
        capacityPositive: "La capacité doit être un nombre positif.",
        centerIdMissing: "L'ID du centre est manquant. Ceci est une erreur interne."
      }
    },
    roomTypes: {
      classroom: "Salle de Classe",
      meeting_room: "Salle de Réunion",
      auditorium: "Auditorium",
      lab: "Laboratoire",
      other: "Autre"
    },
    equipmentConditions: {
      new: "Neuf",
      excellent: "Excellent",
      good: "Bon",
      fair: "Passable",
      need_reparation: "Nécessite Réparation",
      damaged: "Endommagé"
    },
    centerRoomDetailsPage: {
      errorNoRoomId: "ID de la salle manquant. Impossible de récupérer les détails.",
      errorFetchingDetails: "Échec de la récupération des détails de la salle. Veuillez réessayer.",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer la salle \"{{roomName}}\" ? Cette action est irréversible.",
      errorDeletingRoom: "Échec de la suppression de la salle. Veuillez réessayer.",
      loadingRoomDetails: "Chargement des détails de la salle...",
      backToRoomsList: "Retour à la Liste des Salles",
      roomNotFoundTitle: "Salle Non Trouvée",
      roomNotFoundDescription: "La salle que vous recherchez n'existe pas ou n'a pas pu être chargée.",
      sectionTitles: {
        generalInfo: "Informations Générales",
        timestamps: "Horodatages",
        equipmentInRoom: "Équipement dans cette Salle"
      },
      fields: {
        type: "Type",
        capacity: "Capacité",
        isAvailable: "Disponibilité",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le",
        equipmentCondition: "État",
        equipmentQuantity: "Quantité",
        equipmentName: "Nom" // Added for table header
      },
      viewEquipmentPicture: "Voir l'Image",
      noEquipmentInRoom: "Aucun équipement répertorié pour cette salle."
    },
    centerEditRoomPage: {
      title: "Modifier la Salle : {{roomName}}",
      description: "Modifiez les détails de la salle ci-dessous.",
      loadingInitialData: "Chargement des données de la salle pour modification...",
      errorFetchingData: "Échec du chargement des données de la salle. Veuillez réessayer ou revenir en arrière.",
      errorUpdatingRoom: "Échec de la mise à jour de la salle. Veuillez vérifier votre saisie et réessayer.",
      errorNoRoomId: "Aucun ID de salle fourni. Impossible de charger les données pour modification.",
      errorRoomNotFound: "Salle Introuvable pour Modification",
      errorRoomNotFoundDescription: "La salle que vous essayez de modifier n'existe pas ou n'a pas pu être chargée.",
      backToRoomDetails: "Retour aux Détails de la Salle",
      currentImageAlt: "Image actuelle de la salle",
      currentImageNotice: "Image actuelle. Téléchargez un nouveau fichier pour la remplacer.",
      buttons: {
        saveChanges: "Enregistrer les Modifications"
      }
    },
    centerEquipmentPage: {
      pageTitle: "Équipement à {{centerName}}",
      pageSubtitle: "Gérez les {{count}} articles d'équipement dans votre centre.",
      addNewEquipmentButton: "Ajouter Nouvel Équipement",
      loadingMessage: "Chargement de l'équipement du centre...",
      errorFetching: "Erreur lors de la récupération des données d'équipement pour le superviseur du centre :",
      errorFetchingDetail: "Échec de la récupération des informations sur l'équipement. Veuillez vous assurer que votre centre existe et que l'équipement y est répertorié.",
      noEquipmentTitle: "Aucun Équipement Trouvé à {{centerName}}",
      noEquipmentDescription: "Aucun équipement n\\'est actuellement répertorié pour ce centre. Vous pouvez ajouter des articles via le portail de gestion de l'équipement.",
      fields: {
        quantity: "Quantité",
        condition: "État",
        assignedRoom: "Salle Assignée",
        assignedRoomId: "ID Salle Assignée"
      },
      actions: {
        addNotImplemented: "La fonctionnalité d\\'ajout d\\'équipement sera bientôt implémentée.",
        viewNotImplemented: "La fonctionnalité de consultation des détails de l\\'équipement sera bientôt implémentée.",
        editNotImplemented: "La fonctionnalité de modification de l\\'équipement sera bientôt implémentée.",
        deleteNotImplemented: "La fonctionnalité de suppression de l\\'équipement sera bientôt implémentée."
      }
    },
    centerAddEquipmentPage: {
      title: "Ajouter Nouvel Équipement",
      description: "Remplissez les détails ci-dessous pour ajouter un nouvel équipement à votre centre.",
      backToEquipmentList: "Retour à la Liste des Équipements",
      loadingInitialDataMessage: "Chargement des données du centre et des salles...",
      errorNoCenterSupervised: "No center supervised by this account. Cannot add equipment.",
      errorFetchingInitialData: "Failed to fetch initial data (center/rooms). Please try again.",
      errorCenterIdNotSet: "Supervising center ID is not set. Cannot submit form.",
      errorCreatingEquipment: "An error occurred while creating the equipment. Please check your input and try again.",
      errorCritical: "Critical Error",
      labels: {
        name: "Equipment Name",
        description: "Description",
        condition: "Condition",
        quantity: "Quantity",
        picture: "Equipment Picture",
        room: "Assign to Room"
      },
      placeholders: {
        selectCondition: "Select condition",
        selectRoom: "Select a room (optional)",
        noRoomAssigned: "No Room / Unassigned"
      },
      buttons: {
        createEquipment: "Add Equipment"
      },
      validation: {
        nameRequired: "Equipment name is required.",
        quantityPositive: "Quantity must be a positive number if provided.",
        centerIdMissing: "Center ID is missing. This is an internal error."
      }
    },
    centerGroupsPage: {
      pageTitle: "Groupes à {{centerName}}",
      pageSubtitle: "Gérez tous les {{count}} groupes de votre centre.",
      addNewGroupButton: "Ajouter Nouveau Groupe",
      loadingMessage: "Chargement des groupes du centre...",
      errorFetching: "Erreur lors de la récupération des données de groupe pour le superviseur du centre :",
      errorFetchingDetail: "Échec de la récupération des informations sur les groupes. Veuillez vous assurer que votre centre existe et que des groupes y sont répertoriés.",
      noGroupsTitle: "Aucun Groupe Trouvé à {{centerName}}",
      noGroupsDescription: "Aucun groupe n'est actuellement répertorié pour ce centre. Vous pouvez ajouter des groupes via le portail de gestion des groupes.",
      noCenterAssigned: "Aucun centre n'est actuellement attribué à ce compte superviseur, ou les données du centre n'ont pas pu être récupérées.",
      accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
      fields: {
        description: "Description",
        createdAt: "Créé le",
        updatedAt: "Mis à jour le"
      },
      actions: {
        viewDetails: "Voir les Détails",
        edit: "Modifier",
        delete: "Supprimer"
      }
    },
    centerAddGroupPage: {
      title: "Ajouter Nouveau Groupe",
      description: "Remplissez les détails ci-dessous pour ajouter un nouveau groupe à votre centre.",
      backToGroupsList: "Retour à la Liste des Groupes",
      loadingCenterInfo: "Chargement des informations du centre...",
      errorNoCenterSupervised: "Aucun centre supervisé par ce compte. Impossible d'ajouter un groupe.",
      errorFetchingCenterId: "Échec de la récupération de l'ID du centre de supervision. Veuillez réessayer.",
      errorCenterIdNotSet: "L'ID du centre de supervision n'est pas défini. Impossible de soumettre le formulaire.",
      errorCreatingGroup: "Une erreur s'est produite lors de la création du groupe. Veuillez vérifier votre saisie et réessayer.",
      errorCritical: "Erreur Critique",
      accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
      labels: {
        name: "Nom du Groupe",
        description: "Description"
      },
      placeholders: {
        name: "Entrez le nom du groupe",
        description: "Entrez la description du groupe"
      },
      buttons: {
        createGroup: "Créer le Groupe",
        creating: "Création en cours..."
      },
      validation: {
        nameRequired: "Le nom du groupe est requis.",
        descriptionRequired: "La description est requise.",
        centerIdMissing: "L'ID du centre est manquant. Ceci est une erreur interne."
      }
    },
    centerAddNewStudent: {
      errors: {
        authError: "Erreur d'authentification. Veuillez vous assurer que vous êtes connecté et que vous disposez d'un jeton valide.",
        fetchCenterError: "Échec de la récupération de votre centre supervisé. Veuillez réessayer.",
        noCenterAssigned: "Vous n'êtes actuellement affecté comme superviseur à aucun centre, ou les données du centre n'ont pas pu être récupérées.",
        fetchProgramsError: "Échec de la récupération des programmes de formation. Veuillez réessayer.",
        fetchGroupsError: "Échec de la récupération des groupes pour votre centre. Veuillez réessayer.",
        fetchCoursesError: "Échec de la récupération des cours de formation pour le programme et le centre sélectionnés. Veuillez réessayer.",
        centerNotLoaded: "Les informations du centre ne sont pas encore chargées. Veuillez patienter ou actualiser.",
        submitError: "Échec de la création de l'étudiant. Veuillez vérifier les détails et réessayer.",
        submitErrorUnknown: "Une erreur inconnue s'est produite lors de la soumission du formulaire."
      },
      successMessage: "Étudiant créé avec succès !",
      authPrompt: "Veuillez vous connecter pour ajouter un nouvel étudiant.",
      title: "Ajouter un Nouvel Étudiant",
      centerInfo: "Ajout de l'étudiant au centre : {{centerName}}",
      labels: {
        firstName: "Prénom (Français)",
        lastName: "Nom (Français)",
        arabicFirstName: "Prénom (Arabe)",
        arabicLastName: "Nom (Arabe)",
        examId: "N° d'Examen",
        academicYear: "Année Académique",
        joiningDate: "Date d'Inscription",
        centerCode: "Code du Centre (Optionnel)",
        program: "Programme de Formation",
        trainingCourse: "Cours de Formation (Optionnel)",
        group: "Groupe (Optionnel)",
        cinId: "CIN (Carte d'Identité Nationale)",
        phoneNumber: "Numéro de Téléphone",
        birthDate: "Date de Naissance",
        birthCity: "Ville de Naissance",
        address: "Adresse",
        city: "Ville"
      },
      placeholders: {
        optional: "Optionnel",
        selectProgram: "Sélectionnez un programme de formation",
        selectCourse: "Sélectionnez un cours de formation",
        selectGroup: "Sélectionnez un groupe",
        academicYear: "ex: 2023-2024",
        cinId: "ex: AB123456",
        phoneNumber: "ex: 0600000000",
        birthCity: "ex: Rabat",
        address: "ex: 123 Rue Principale, App 4B",
        city: "ex: Casablanca"
      },
      courseNameUnavailable: "Nom du cours non disponible",
      noCoursesForProgram: "Aucun cours de formation disponible pour le programme sélectionné, ou une erreur s'est produite.",
      buttons: {
        cancel: "Annuler",
        submitting: "Soumission en cours...",
        submit: "Créer l'Étudiant"
      }
    },
    centerUpdateStudent: { // Nouvelle section pour la page de mise à jour de l'étudiant
      title: "Mettre à Jour les Informations de l'Étudiant",
      editingFor: "Modification de l'étudiant : {{studentEmail}} (N° d'Examen : {{examId}})",
      loadingStudent: "Chargement des détails de l'étudiant...",
      errors: {
        missingInfo: "ID de l'étudiant ou jeton d'authentification manquant. Impossible de charger les détails.",
        fetchStudentError: "Échec de la récupération des détails de l'étudiant. Veuillez réessayer.",
        missingInfoSubmit: "ID de l'étudiant ou informations du centre manquantes. Impossible de soumettre la mise à jour.",
        submitError: "Échec de la mise à jour de l'étudiant. Veuillez vérifier les détails et réessayer.",
        submitErrorUnknown: "Une erreur inconnue s'est produite lors de l'enregistrement des modifications."
      },
      successMessage: "Étudiant mis à jour avec succès !",
      buttons: {
        saving: "Enregistrement...",
        saveChanges: "Enregistrer les Modifications"
      },
      displayOnly: {
        examIdLabel: "N° d'Examen (Auto-généré)",
        centerCodeLabel: "Code du Centre (Auto-généré)"
      }
    },
    centerStudentDetailsPage: { // Nouvelle section pour la page de détails de l'étudiant
      title: "Détails de l'Étudiant",
      description: "Consultation des détails pour l'étudiant : {{email}} (N° d'Examen : {{examId}})",
      loading: "Chargement des détails de l'étudiant...",
      noData: "Données de l'étudiant non trouvées ou n'ont pas pu être chargées.",
      errors: {
        missingInfo: "ID de l'étudiant ou jeton d'authentification manquant. Impossible de charger les détails.",
        fetchStudentError: "Échec de la récupération des détails de l'étudiant. Veuillez réessayer.",
        fetchStudentErrorUnknown: "Une erreur inconnue s'est produite lors de la récupération des détails de l'étudiant."
      }
    },
    centerTrainersPage: {
      pageTitle: "Formateurs à {{centerName}}",
      pageSubtitle: "Gérez tous les {{count}} formateurs de votre centre.",
      addNewTrainerButton: "Ajouter Nouveau Formateur",
      loadingMessage: "Chargement des formateurs du centre...",
      errorFetching: "Erreur lors de la récupération des données de formateurs pour le superviseur du centre :",
      errorFetchingDetail: "Échec de la récupération des informations sur les formateurs. Veuillez vous assurer que votre centre existe et que des formateurs y sont inscrits.",
      noTrainersTitle: "Aucun Formateur Trouvé à {{centerName}}",
      noTrainersDescription: "Aucun formateur n'est actuellement inscrit dans ce centre. Vous pouvez ajouter des formateurs via le portail de gestion des formateurs.",
      noTrainersFound: "Aucun formateur trouvé.",
      noTrainersMatchFilter: "Aucun formateur ne correspond aux filtres actuels.",
      noTrainersMatchFilters: "Aucun formateur ne correspond aux filtres actuels.",
      noCenterAssigned: "Aucun centre n'est actuellement attribué à ce compte superviseur, ou les données du centre n'ont pas pu être récupérées.",
      noCenterDataTitle: "Données du Centre Non Disponibles",
      noCenterDataDescription: "Impossible de charger les données du centre. Veuillez réessayer plus tard ou contacter le support.",
      accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
      errorAuthNotAvailable: "Utilisateur non authentifié ou token non disponible.",
      searchPlaceholder: "Rechercher des formateurs par nom, email ou spécialisation...",
      filterBySpecialization: "Filtrer par Spécialisation",
      filterByProgram: "Filtrer par Programme",
      filterByStatus: "Filtrer par Statut",
      allSpecializations: "Toutes les Spécialisations",
      allPrograms: "Tous les Programmes",
      allStatuses: "Tous les Statuts",
      allContracts: "Tous les Contrats",
      allCenters: "Tous les Centres",
      clearFilters: "Effacer les Filtres",
      trainersListTitle: "Liste des Formateurs",
      noSpecialization: "Aucune Spécialisation",
      openMenu: "Ouvrir le menu",
      tableHeaders: {
        trainer: "Formateur",
        specialization: "Spécialisation",
        program: "Programme",
        employmentStatus: "Statut d'Emploi",
        experience: "Expérience",
        actions: "Actions",
        contractWith: "Contrat Avec",
        contractStart: "Début de Contrat",
        contractEnd: "Fin de Contrat"
      },
      actions: {
        viewDetails: "Voir les Détails",
        edit: "Modifier",
        delete: "Supprimer",
        deactivate: "Désactiver",
        confirmDeactivate: "Êtes-vous sûr de vouloir désactiver ce formateur ? Il ne pourra plus accéder au système."
      },
      dialogDescription: "Informations détaillées sur le formateur.",
      dialogSections: {
        trainerInfo: "Informations du Formateur",
        personalInfo: "Informations Personnelles",
        contactInfo: "Coordonnées",
        profilePicture: "Photo de Profil"
      },
      dialogLabels: {
        specialization: "Spécialisation",
        program: "Programme",
        employmentStatus: "Statut d'Emploi",
        experience: "Années d'Expérience",
        centerCode: "Code du Centre",
        user: {
          email: "Email",
          username: "Nom d'utilisateur",
          arabicFirstName: "Prénom en Arabe",
          arabicLastName: "Nom en Arabe",
          birthDate: "Date de Naissance",
          birthCity: "Ville de Naissance",
          cin: "CIN",
          role: "Rôle",
          phoneNumber: "Numéro de Téléphone",
          address: "Adresse",
          city: "Ville"
        }
      },
      unknownProgram: "Programme Inconnu",
      errorTitleCritical: "Erreur Critique",
      checkAssignment: "Veuillez vérifier l'attribution de votre centre ou contacter l'administration.",
      errorFetchingTrainersTitle: "Erreur lors de la Récupération des Formateurs",
      errorFetchingTrainersForCenter: "Échec de la récupération des formateurs pour le centre {{centerName}}",
      contractEnds: "Le Contrat Se Termine"
    },
    centerAddNewTrainer: {
      errors: {
        authError: "Erreur d'authentification. Veuillez vous assurer que vous êtes connecté et que vous disposez d'un jeton valide.",
        fetchCenterError: "Échec de la récupération de votre centre supervisé. Veuillez réessayer.",
        noCenterAssigned: "Vous n'êtes actuellement affecté comme superviseur à aucun centre, ou les données du centre n'ont pas pu être récupérées.",
        fetchProgramsError: "Échec de la récupération des programmes de formation. Veuillez réessayer.",
        centerNotLoaded: "Les informations du centre ne sont pas encore chargées. Veuillez patienter ou actualiser.",
        submitError: "Échec de la création du formateur. Veuillez vérifier les détails et réessayer.",
        submitErrorUnknown: "Une erreur inconnue s'est produite lors de la soumission du formulaire."
      },
      successMessage: "Formateur créé avec succès !",
      authPrompt: "Veuillez vous connecter pour ajouter un nouveau formateur.",
      title: "Ajouter un Nouveau Formateur",
      centerInfo: "Ajout du formateur au centre : {{centerName}}",
      labels: {
        firstName: "Prénom (Français)",
        lastName: "Nom (Français)",
        arabicFirstName: "Prénom (Arabe)",
        arabicLastName: "Nom (Arabe)",
        program: "Programme de Formation",
        contractWith: "Contrat Avec",
        contractStartDate: "Date de Début de Contrat",
        contractEndDate: "Date de Fin de Contrat",
        cinId: "CIN (Carte d'Identité Nationale) (Optionnel)",
        phoneNumber: "Numéro de Téléphone (Optionnel)",
        birthDate: "Date de Naissance (Optionnel)",
        birthCity: "Ville de Naissance (Optionnel)",
        address: "Adresse (Optionnel)",
        city: "Ville (Optionnel)"
      },
      placeholders: {
        selectProgram: "Sélectionnez un programme de formation",
        selectContractWith: "Sélectionnez le type de contrat",
        cinId: "ex: AB123456",
        phoneNumber: "ex: 0600000000",
        birthCity: "ex: Rabat",
        address: "ex: 123 Rue Principale, App 4B",
        city: "ex: Casablanca"
      },
      contractChoices: {
        entraide: "Entraide Nationale",
        association: "Association"
      },
      buttons: {
        cancel: "Annuler",
        submitting: "Soumission en cours...",
        submit: "Créer le Formateur"
      }
    },
    centerEditTrainer: {
      errors: {
        authError: "Erreur d'authentification. Veuillez vous assurer que vous êtes connecté et que vous disposez d'un jeton valide.",
        fetchCenterError: "Échec de la récupération de votre centre supervisé. Veuillez réessayer.",
        noCenterAssigned: "Vous n'êtes actuellement affecté comme superviseur à aucun centre, ou les données du centre n'ont pas pu être récupérées.",
        fetchProgramsError: "Échec de la récupération des programmes de formation. Veuillez réessayer.",
        fetchTrainerError: "Échec de la récupération des détails du formateur. Veuillez réessayer.",
        missingInfo: "ID du formateur ou jeton d'authentification manquant. Impossible de charger les détails.",
        missingInfoSubmit: "ID du formateur ou informations du centre manquantes. Impossible de soumettre la mise à jour.",
        submitError: "Échec de la mise à jour du formateur. Veuillez vérifier les détails et réessayer.",
        submitErrorUnknown: "Une erreur inconnue s'est produite lors de l'enregistrement des modifications."
      },
      successMessage: "Formateur mis à jour avec succès !",
      authPrompt: "Veuillez vous connecter pour modifier le formateur.",
      loadingTrainer: "Chargement des détails du formateur...",
      title: "Modifier le Formateur",
      editingFor: "Modification du formateur : {{trainerEmail}}",
      buttons: {
        saving: "Enregistrement...",
        saveChanges: "Enregistrer les Modifications"
      }
    },
    centerSchedulesPage: {
      pageTitle: "Horaires à {{centerName}}",
      pageSubtitle: "Gérez {{trainersCount}} formateurs et {{groupsCount}} groupes.",
      loadingMessage: "Chargement des horaires du centre...",
      errorTitle: "Erreur",
      errorFetching: "Erreur lors de la récupération des données d'horaires pour le superviseur du centre :",
      errorAuthNotAvailable: "Utilisateur non authentifié ou token non disponible.",
      accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
      noCenterAssigned: "Aucun centre n'est actuellement attribué à ce compte superviseur, ou les données du centre n'ont pas pu être récupérées.",
      noCenterDataTitle: "Données du Centre Non Disponibles",
      noCenterDataDescription: "Impossible de charger les données du centre. Veuillez réessayer plus tard ou contacter le support.",
      
      // New tabs
      trainersSchedulesTab: "Horaires des Formateurs",
      groupsSchedulesTab: "Horaires des Groupes",
      
      // Trainers section
      trainersListTitle: "Liste des Formateurs",
      trainersListDescription: "Sélectionnez un formateur pour voir son emploi du temps.",
      searchTrainers: "Rechercher des formateurs...",
      noTrainersFound: "Aucun formateur trouvé.",
      selectTrainerTitle: "Sélectionner un Formateur",
      selectTrainerMessage: "Sélectionnez un formateur",
      selectTrainerDescription: "Choisissez un formateur dans la liste pour voir son emploi du temps hebdomadaire.",
      trainerScheduleTitle: "Emploi du temps de {{trainerName}}",
      
      // Groups section
      groupsListTitle: "Liste des Groupes",
      groupsListDescription: "Sélectionnez un groupe pour voir son emploi du temps.",
      searchGroups: "Rechercher des groupes...",
      noGroupsFound: "Aucun groupe trouvé.",
      selectGroupTitle: "Sélectionner un Groupe",
      selectGroupMessage: "Sélectionnez un groupe",
      selectGroupDescription: "Choisissez un groupe dans la liste pour voir son emploi du temps hebdomadaire.",
      groupScheduleTitle: "Emploi du temps de {{groupName}}",
      
      // Common schedule view
      weeklyScheduleDescription: "Emploi du temps hebdomadaire basé sur les modèles d'horaires.",
      loadingSchedule: "Chargement de l'emploi du temps...",
      noSchedulesFound: "Aucun horaire trouvé",
      noSchedulesDescription: "Aucun horaire n'est configuré pour cette sélection.",
      
      // Table headers
      day: "Jour",
      time: "Heure",
      program: "Programme",
      trainer: "Formateur",
      group: "Groupe",
      room: "Salle",
      status: "Statut",
      
      // Status badges
      active: "Actif",
      inactive: "Inactif",
      
      // Legacy fields (kept for compatibility)
      statusScheduled: "Programmé",
      statusCompleted: "Terminé",
      statusCancelled: "Annulé",
      statusRescheduled: "Reprogrammé",
      customTrainer: "Formateur Personnalisé",
      customRoom: "Salle Personnalisée",
      customTiming: "Horaire Personnalisé",
      notes: "Notes"
    },
    // Days of the week translations
    days: {
      monday: "Lundi",
      tuesday: "Mardi", 
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    },
    adminEditAssociationPage: {
      title: "Modifier l'Association",
      subtitle: "Modifiez les détails de l'association ci-dessous",
      backToDetails: "Retour aux Détails de l'Association",
      loadingData: "Chargement des données de l'association...",
      errorLoadingTitle: "Erreur lors du Chargement de l'Association",
      saving: "Enregistrement...",
      saveChanges: "Enregistrer les Modifications",
      cancel: "Annuler",
      basicInfoTitle: "Informations de Base",
      basicInfoDescription: "Mettre à jour les détails principaux de l'association",
      contactInfoTitle: "Informations de Contact", 
      contactInfoDescription: "Mettre à jour les coordonnées et les liens de réseaux sociaux",
      contractInfoTitle: "Informations sur le Contrat",
      contractInfoDescription: "Mettre à jour les dates et détails du contrat",
      socialMediaTitle: "Réseaux Sociaux et Liens",
      
      // Form labels
      associationName: "Nom de l'Association",
      registrationNumber: "Numéro d'Enregistrement", 
      description: "Description",
      supervisor: "Superviseur",
      email: "Email",
      phoneNumber: "Numéro de Téléphone",
      address: "Adresse",
      city: "Ville",
      websiteUrl: "URL du Site Web",
      mapsLink: "Lien Google Maps",
      facebookUrl: "URL Facebook",
      instagramUrl: "URL Instagram", 
      twitterUrl: "URL Twitter",
      contractStartDate: "Date de Début du Contrat",
      contractEndDate: "Date de Fin du Contrat",
      
      // Placeholders
      enterName: "Entrez le nom de l'association",
      enterRegistration: "Entrez le numéro d'enregistrement",
      enterDescription: "Entrez la description de l'association",
      selectSupervisor: "Sélectionner un superviseur",
      noSupervisor: "Aucun superviseur",
      enterEmail: "Entrez l'adresse email",
      enterPhone: "Entrez le numéro de téléphone", 
      enterAddress: "Entrez l'adresse",
      enterCity: "Entrez la ville",
      websitePlaceholder: "https://exemple.com",
      mapsPlaceholder: "URL Google Maps",
      facebookPlaceholder: "URL de la page Facebook",
      instagramPlaceholder: "URL du profil Instagram",
      twitterPlaceholder: "URL du profil Twitter",
      
      // Messages
      nameRequired: "Le nom de l'association est requis",
      authRequired: "Jeton d'authentification non trouvé", 
      unknownError: "Une erreur inconnue s'est produite",
      updateSuccess: "Association mise à jour avec succès !",
      updateError: "Échec de la mise à jour de l'association"
    },
    adminTrainersPage: {
      title: "Gérer les Formateurs",
      addNewTrainerButton: "Ajouter un Nouveau Formateur",
      searchPlaceholder: "Rechercher des formateurs par nom, email ou spécialisation...",
      filterBySpecialization: "Filtrer par Spécialisation",
      filterByProgram: "Filtrer par Programme",
      filterByStatus: "Filtrer par Statut",
      allSpecializations: "Toutes les Spécialisations",
      allPrograms: "Tous les Programmes",
      allStatuses: "Tous les Statuts",
      clearFilters: "Effacer les Filtres",
      resultsCount: "Affichage de {{count}} sur {{total}} formateurs",
      trainersListTitle: "Liste des Formateurs",
      loadingMessage: "Chargement des formateurs...",
      errorFetching: "Erreur lors de la récupération des données de formateurs :",
      errorFetchingDetail: "Échec de la récupération des informations sur les formateurs. Veuillez réessayer.",
      noTrainersTitle: "Aucun Formateur Trouvé",
      noTrainersDescription: "Aucun formateur n'est actuellement inscrit dans le système.",
      noTrainersFound: "Aucun formateur trouvé.",
      noTrainersMatchFilter: "Aucun formateur ne correspond aux filtres actuels.",
      noTrainersMatchFilters: "Aucun formateur ne correspond aux filtres actuels.",
      noCenterAssigned: "Aucun centre n'est actuellement attribué.",
      noCenterDataTitle: "Données Non Disponibles",
      noCenterDataDescription: "Impossible de charger les données. Veuillez réessayer plus tard.",
      accessDenied: "Accès refusé. Cette page est réservée aux administrateurs.",
      errorAuthNotAvailable: "Utilisateur non authentifié ou token non disponible.",
      noSpecialization: "Aucune Spécialisation",
      openMenu: "Ouvrir le menu",
      statusActive: "Actif",
      statusInactive: "Inactif",
      contractEntraide: "Entraide Nationale",
      contractAssociation: "Association",
      tableHeaders: {
        trainer: "Formateur",
        center: "Centre",
        specialization: "Spécialisation",
        program: "Programme",
        contractWith: "Contrat Avec",
        contractStart: "Début de Contrat",
        contractEnd: "Fin de Contrat",
        actions: "Actions"
      },
      actions: {
        viewDetails: "Voir les Détails",
        edit: "Modifier",
        delete: "Supprimer",
        confirmDelete: "Êtes-vous sûr de vouloir supprimer ce formateur ?"
      },
      dialogDescription: "Informations détaillées sur le formateur.",
      dialogSections: {
        trainerInfo: "Informations du Formateur",
        personalInfo: "Informations Personnelles",
        contactInfo: "Coordonnées",
        profilePicture: "Photo de Profil"
      },
      dialogLabels: {
        center: "Centre",
        specialization: "Spécialisation",
        program: "Programme",
        contractWith: "Contrat Avec",
        contractStart: "Début de Contrat",
        contractEnd: "Fin de Contrat",
        user: {
          email: "Email",
          username: "Nom d'utilisateur",
          arabicFirstName: "Prénom en Arabe",
          arabicLastName: "Nom en Arabe",
          birthDate: "Date de Naissance",
          birthCity: "Ville de Naissance",
          cin: "CIN",
          role: "Rôle",
          phoneNumber: "Numéro de Téléphone",
          address: "Adresse",
          city: "Ville"
        }
      },
      unknownProgram: "Programme Inconnu",
      contractEnds: "Le Contrat Se Termine"
    },
    // Trainer Students Page
    trainerStudentsPage: {
      title: "Mes Étudiants",
      subtitle: "Gérer et voir vos étudiants par groupe",
      authError: "Erreur d'authentification",
      errorTitle: "Erreur",
      noGroupsTitle: "Aucun Groupe Assigné",
      noGroupsDescription: "Vous n'êtes actuellement assigné à aucun groupe. Veuillez contacter votre superviseur de centre.",
      loadingTrainerData: "Chargement des données du formateur...",
      groupsTitle: "Groupes d'Étudiants",
      studentsCount: "étudiants",
      createdOn: "Créé le",
      loadingStudents: "Chargement des étudiants...",
      noStudentsFound: "Aucun étudiant trouvé",
      noStudentsInGroup: "Aucun étudiant dans ce groupe",
      tryDifferentSearch: "Essayez un terme de recherche différent",
      groupEmpty: "Ce groupe n'a actuellement aucun étudiant assigné",
      searchPlaceholder: "Rechercher des étudiants par nom, email, ou ID d'examen...",
      searchResults: "Trouvé {{found}} sur {{total}} étudiants correspondant à \"{{term}}\"",
      totalStudents: "{{count}} étudiants dans ce groupe",
      table: {
        student: "Étudiant",
        examId: "ID Examen",
        academicYear: "Année Académique",
        joiningDate: "Date d'Inscription",
        status: "Statut",
        actions: "Actions"
      },
      status: {
        active: "Actif",
        inactive: "Inactif"
      },
      actions: {
        viewDetails: "Voir Détails"
      }
    }
  }
}; 