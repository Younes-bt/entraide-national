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
        students: "Students",
        // Added for Center Supervisor
        centerInfo: "Center Info",
        rooms: "Rooms",
        equipment: "Equipment",
        schedules: "Schedules",
        attendance: "Attendance",
        trainingPrograms: "Training Programs",
        trainingCourses: "Training Courses",
        annualCourseDistribution: "Annual Course Distribution",
        courses: "Courses",
        exams: {
          comingSoon: "Coming Soon"
        },
        sections: {
          overview: "Overview",
          hr: "HR Management",
          center: "Center Management",
          programme: "Programme Management",
          trainings: "Trainings",
          exams: "Exams"
        }
      },
      table: {
        avatar: "Avatar",
        fullName: "Full Name",
        center: "Center",
        association: "Association",
        phone: "Phone",
        actions: "Actions",
        attendance: "Attendance",
        trainingPrograms: "Training Programs",
        trainingCourses: "Training Courses",
        annualCourseDistribution: "Annual Course Distribution",
        courses: "Courses",
        exams: {
          comingSoon: "Coming Soon"
        },
        sections: {
          overview: "Overview",
          hr: "HR Management",
          center: "Center Management",
          programme: "Programme Management",
          trainings: "Trainings",
          exams: "Exams"
        }
      },
      actions: {
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        addSupervisor: "Add Supervisor",
        addAssociationSupervisor: "Add Association Supervisor",
        added: "Added"
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
          genericAssociation: "Could not add association supervisor. Please check the details and try again.",
          authRequired: "Authentication required.",
          genericDialog: "Failed to add supervisor.",
          titleDialog: "Error",
          genericCenterDialog: "Failed to add center supervisor.",
          titleCenterDialog: "Error Adding Center Supervisor"
        },
        addSuccess: {
          title: "Success",
          titleAssociation: "Success Adding Association Supervisor",
          message: "Supervisor added successfully!",
          messageAssociation: "Association supervisor added successfully!",
          titleDialog: "Succès",
          messageDialog: "Supervisor added successfully!",
          messageCenterDialog: "Center supervisor added successfully!",
          titleCenterDialog: "Center Supervisor Added"
        },
        // Dialog specific translations
        addNewDialogTitle: "Add New Association Supervisor",
        addNewDialogDescription: "Fill in the details to create a new supervisor. Email and password will be auto-generated.",
        addNewCenterSupervisorDialogTitle: "Add New Center Supervisor",
        addNewCenterSupervisorDialogDescription: "Fill in the details to create a new center supervisor. Email and password will be auto-generated."
      },
      // Dashboards (generic)
      adminDashboardTitle: 'Admin Dashboard',
      welcomeAdmin: 'Welcome, Admin!',
      centerDashboardTitle: 'Center Dashboard',
      welcomeCenterSupervisor: 'Welcome, Center Supervisor! Manage your center from here.',
      associationDashboardTitle: 'Association Supervisor Dashboard',
      welcomeAssociationSupervisor: 'Welcome, Association Supervisor!',
      trainerDashboardTitle: 'Trainer Dashboard',
      welcomeTrainer: 'Welcome, Trainer!',
      studentDashboardTitle: 'Student Dashboard',
      welcomeStudent: 'Welcome, Student!',
      // Center Students Page
      centerStudentsPageTitle: 'Manage Center Students',
      manageCenterStudentsMessage: 'Here you can manage all students registered in your center.',
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
        tableHeaderSupervisorName: "Supervisor Name",
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
          successMessage: "Center created successfully!",
          selectCityPlaceholder: "Select City",
          labelLogo: "Center Logo",
          buttons: {
            addSupervisorShort: "Add New Supervisor"
          },
          messages: {
            centerSupervisorAddedSuccessfully: "New center supervisor added and selected."
          }
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
            createAssociation: "Create Association",
            addSupervisorShort: "Add New"
          },
          messages: {
            loadingSupervisorsError: "Failed to load potential supervisors.",
            authTokenNotFound: "Authentication token not found. Please log in.",
            supervisorNotSelected: "Please select a supervisor.",
            creationSuccess: "Association created successfully! Redirecting...",
            creationErrorDefault: "Failed to create association. Server response not JSON.",
            unknownError: "An unknown error occurred.",
            supervisorNameDisplay: "{{firstName}} {{lastName}} (ID: {{id}})",
            supervisorNameDisplayWithArabic: "{{firstName}} {{lastName}} ({{arabicFirstName}} {{arabicLastName}})",
            supervisorAddedSuccessfully: "New supervisor added and selected."
          },
          supervisorDropdown: {
            select: "Select Supervisor",
            loading: "Loading supervisors...",
            noneAvailable: "No supervisors available",
            noAssociationSupervisors: "No association supervisors found.",
            availableSupervisorsLabel: "Available Supervisors"
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
      },
      trainingPrograms: {
        title: "Training Programs",
        addNew: "Add New Training Program",
        noPrograms: "No training programs found.",
        error: {
          notAuthenticated: "Authentication token is missing. Please log in.",
          unknown: "An unknown error occurred while fetching programs."
        }
      },
      adminAddTrainingProgram: {
        title: "Add New Training Program",
        backButton: "Back to Programs",
        labels: {
          name: "Program Name",
          description: "Description",
          durationYears: "Duration (Years)",
          logo: "Logo (Optional)"
        },
        placeholders: {
          name: "Enter program name",
          description: "Enter program description",
          durationYears: "e.g., 2"
        },
        buttons: {
          create: "Create Program",
          creating: "Creating..."
        },
        validation: {
          nameRequired: "Program name is required.",
          descriptionRequired: "Description is required.",
          durationRequired: "Duration is required.",
          durationPositive: "Duration must be a positive number."
        },
        messages: {
          success: "Training program created successfully!",
          errorDefault: "Failed to create training program. Please check the details and try again.",
          errorConflict: "A training program with this name already exists."
        }
      },
      centerInfoPage: {
        tabGeneralInfo: "General Info",
        tabContactLinks: "Contact & Links",
        tabRooms: "Rooms",
        tabGroups: "Groups",
        generalInfo: {
          title: "General Information",
          affiliatedTo: "Affiliated To:",
          association: "Association:",
          status: "Status:",
          active: "Active",
          inactive: "Inactive",
          verified: "(Verified)",
          notVerified: "(Not Verified)",
          registeredOn: "Registered On:",
          lastUpdated: "Last Updated:"
        },
        contactLinks: {
          title: "Contact & Links",
          email: "Email:",
          phone: "Phone:",
          address: "Address:",
          location: "Location:",
          website: "Website:",
          facebook: "Facebook:",
          instagram: "Instagram:",
          twitter: "Twitter:",
          viewOnMap: "View on Map",
          viewProfile: "View Profile"
        },
        rooms: {
          title: "Rooms ({{count}})",
          description: "Details about the center\\\'s available rooms.",
          capacity: "Capacity:",
          available: "Available:",
          equipment: "Equipment",
          equipmentItems: "{{count}} item(s)",
          noRooms: "No rooms listed for this center.",
          created: "Created",
          updated: "Updated",
          type: "Type",
          noEquipment: "No equipment listed for this room."
        },
        groups: {
          title: "Groups ({{count}})",
          description: "Details about the center\'s student groups.",
          noGroups: "No groups listed for this center."
        }
      },
      centerRoomsPage: {
        noCenterAssigned: "No center is currently assigned to this supervisor account, or the center data could not be retrieved.",
        errorFetching: "Error fetching center room information for supervisor:",
        errorFetchingDetail: "Failed to fetch center room information. Please ensure you are assigned as a supervisor to a center and that the center has rooms.",
        accessDenied: "Access denied. This page is for center supervisors, or your user ID is missing.",
        loadingMessage: "Loading center rooms...",
        noRoomsTitle: "No Rooms Found at {{centerName}}",
        noCenterDataTitle: "Center Data Not Available",
        noRoomsDescription: "There are currently no rooms listed for this center. You can add rooms through the center management portal.",
        noCenterDataDescription: "Could not load center data. Please try again later or contact support.",
        pageTitle: "Rooms at {{centerName}}",
        pageSubtitle: "Browse and manage all {{count}} rooms available in your center.",
        addNewRoomButton: "Add New Room",
        viewDetailsButton: "View Details"
      },
      centerAddRoomPage: {
        errorNoCenterSupervised: "No center supervised by this account. Cannot add a room.",
        errorFetchingCenterId: "Failed to fetch supervising center ID. Please try again.",
        errorCenterIdNotSet: "Supervising center ID is not set. Cannot submit form.",
        errorCreatingRoom: "An error occurred while creating the room. Please check your input and try again.",
        loadingCenterInfo: "Loading center information...",
        errorCritical: "Critical Error",
        errorNoCenterAssociatedAccount: "No center is associated with this supervisor account. Please contact administration.",
        backToRoomsList: "Back to Rooms List",
        title: "Add New Room",
        description: "Fill in the details below to add a new room to your center.",
        labels: {
          name: "Room Name",
          description: "Description",
          type: "Room Type",
          capacity: "Capacity",
          isAvailable: "Is Available",
          picture: "Room Picture"
        },
        placeholders: {
          selectType: "Select room type"
        },
        buttons: {
          createRoom: "Create Room"
        },
        validation: {
          nameRequired: "Room name is required.",
          typeRequired: "Room type is required.",
          capacityPositive: "Capacity must be a positive number.",
          centerIdMissing: "Center ID is missing. This is an internal error."
        }
      },
      roomTypes: {
        classroom: "Classroom",
        meeting_room: "Meeting Room",
        auditorium: "Auditorium",
        lab: "Lab",
        other: "Other"
      },
      equipmentConditions: {
        new: "New",
        excellent: "Excellent",
        good: "Good",
        fair: "Fair",
        need_reparation: "Needs Repair",
        damaged: "Damaged"
      },
      centerRoomDetailsPage: {
        errorNoRoomId: "Room ID is missing. Cannot fetch details.",
        errorFetchingDetails: "Failed to fetch room details. Please try again.",
        confirmDelete: "Are you sure you want to delete the room \"{{roomName}}\"? This action cannot be undone.",
        errorDeletingRoom: "Failed to delete room. Please try again.",
        loadingRoomDetails: "Loading room details...",
        backToRoomsList: "Back to Rooms List",
        roomNotFoundTitle: "Room Not Found",
        roomNotFoundDescription: "The room you are looking for does not exist or could not be loaded.",
        sectionTitles: {
          generalInfo: "General Information",
          timestamps: "Timestamps",
          equipmentInRoom: "Equipment in this Room"
        },
        fields: {
          type: "Type",
          capacity: "Capacity",
          isAvailable: "Availability",
          createdAt: "Created At",
          updatedAt: "Last Updated",
          equipmentCondition: "Condition",
          equipmentQuantity: "Quantity"
        },
        viewEquipmentPicture: "View Picture",
        noEquipmentInRoom: "No equipment listed for this room."
      },
      centerEditRoomPage: {
        title: "Edit Room: {{roomName}}",
        description: "Modify the details of the room below.",
        loadingInitialData: "Loading room data for editing...",
        errorFetchingData: "Failed to load room data. Please try again or go back.",
        errorUpdatingRoom: "Failed to update room. Please check your input and try again.",
        errorNoRoomId: "No Room ID provided. Cannot load data for editing.",
        errorRoomNotFound: "Room Not Found for Editing",
        errorRoomNotFoundDescription: "The room you are trying to edit does not exist or could not be loaded.",
        backToRoomDetails: "Back to Room Details",
        currentImageAlt: "Current room image",
        currentImageNotice: "Current image. Upload a new file to replace it.",
        buttons: {
          saveChanges: "Save Changes"
        }
      },
      centerEquipmentPage: {
        pageTitle: "Equipment at {{centerName}}",
        pageSubtitle: "Manage all {{count}} equipment items in your center.",
        addNewEquipmentButton: "Add New Equipment",
        loadingMessage: "Loading center equipment...",
        errorFetching: "Error fetching equipment data for center supervisor:",
        errorFetchingDetail: "Failed to fetch equipment information. Please ensure your center exists and has equipment listed.",
        noEquipmentTitle: "No Equipment Found at {{centerName}}",
        noEquipmentDescription: "There is currently no equipment listed for this center. You can add items through the equipment management portal.",
        fields: {
          quantity: "Quantity",
          condition: "Condition",
          assignedRoom: "Assigned Room",
          assignedRoomId: "Assigned Room ID"
        },
        actions: {
          addNotImplemented: "Add equipment functionality will be implemented soon.",
          viewNotImplemented: "View equipment details functionality will be implemented soon.",
          editNotImplemented: "Edit equipment functionality will be implemented soon.",
          deleteNotImplemented: "Delete equipment functionality will be implemented soon."
        }
      },
      centerAddEquipmentPage: {
        title: "Add New Equipment",
        description: "Fill in the details below to add new equipment to your center.",
        backToEquipmentList: "Back to Equipment List",
        loadingInitialDataMessage: "Loading center and room data...",
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
        students: "Étudiants",
        // Added for Center Supervisor (French)
        centerInfo: "Infos du Centre",
        rooms: "Salles",
        equipment: "Équipement",
        schedules: "Horaires",
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
        groups: {
          title: "Groupes ({{count}})",
          description: "Détails sur les groupes d\'étudiants du centre.",
          noGroups: "Aucun groupe répertorié pour ce centre."
        }
      },
      centerRoomsPage: {
        noCenterAssigned: "Aucun centre n\'est actuellement attribué à ce compte superviseur, ou les données du centre n\'ont pas pu être récupérées.",
        errorFetching: "Erreur lors de la récupération des informations sur les salles du centre pour le superviseur :",
        errorFetchingDetail: "Échec de la récupération des informations sur les salles du centre. Veuillez vous assurer que vous êtes affecté superviseur à un centre et que le centre dispose de salles.",
        accessDenied: "Accès refusé. Cette page est réservée aux superviseurs de centre, ou votre ID utilisateur est manquant.",
        loadingMessage: "Chargement des salles du centre...",
        noRoomsTitle: "Aucune Salle Trouvée à {{centerName}}",
        noCenterDataTitle: "Données du Centre Non Disponibles",
        noRoomsDescription: "Aucune salle n\'est actuellement répertoriée pour ce centre. Vous pouvez ajouter des salles via le portail de gestion du centre.",
        noCenterDataDescription: "Impossible de charger les données du centre. Veuillez réessayer plus tard ou contacter le support.",
        pageTitle: "Salles à {{centerName}}",
        pageSubtitle: "Parcourez et gérez les {{count}} salles disponibles dans votre centre.",
        addNewRoomButton: "Ajouter Nouvelle Salle",
        viewDetailsButton: "Voir les détails"
      },
      centerAddRoomPage: {
        errorNoCenterSupervised: "Aucun centre supervisé par ce compte. Impossible d\'ajouter une salle.",
        errorFetchingCenterId: "Échec de la récupération de l\'ID du centre de supervision. Veuillez réessayer.",
        errorCenterIdNotSet: "L\'ID du centre de supervision n\'est pas défini. Impossible de soumettre le formulaire.",
        errorCreatingRoom: "Une erreur s\'est produite lors de la création de la salle. Veuillez vérifier votre saisie et réessayer.",
        loadingCenterInfo: "Chargement des informations du centre...",
        errorCritical: "Erreur Critique",
        errorNoCenterAssociatedAccount: "Aucun centre n\'est associé à ce compte superviseur. Veuillez contacter l\'administration.",
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
          centerIdMissing: "L\'ID du centre est manquant. Ceci est une erreur interne."
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
        roomNotFoundDescription: "La salle que vous recherchez n\'existe pas ou n\'a pas pu être chargée.",
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
          equipmentQuantity: "Quantité"
        },
        viewEquipmentPicture: "Voir l\'Image",
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
        errorRoomNotFoundDescription: "La salle que vous essayez de modifier n\\'existe pas ou n\\'a pas pu être chargée.",
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
        students: "الطلاب",
        centerInfo: "معلومات المركز",
        rooms: "القاعات",
        equipment: "المعدات",
        schedules: "الجداول الزمنية",
        attendance: "الحاضرين",
        trainingPrograms: "التكوينات",
        trainingCourses: "البرامج التكوينية",
        annualCourseDistribution: "التوزيع السنوي للدورات",
        courses: "الدروس و البرامج",
        exams: {
          comingSoon: "قريباً"
        },
        sections: {
          overview: "نظرة عامة",
          hr: "إدارة الموارد البشرية",
          center: "إدارة المركز",
          programme: "إدارة التكوينات",
          trainings: "التكوينات",
          exams: "الامتحانات"
        }
      },
      table: {
        avatar: "الصورة الرمزية",
        fullName: "الاسم الكامل",
        center: "المركز",
        association: "الجمعية",
        phone: "الهاتف",
        actions: "الإجراءات",
        attendance: "الحاضرين",
        trainingPrograms: "برامج التدريب",
        trainingCourses: "دورات تدريبية",
        annualCourseDistribution: "التوزيع السنوي للدورات",
        courses: "الدورات",
        exams: {
          comingSoon: "قريباً"
        },
        sections: {
          overview: "نظرة عامة",
          hr: "إدارة الموارد البشرية",
          center: "إدارة المركز",
          programme: "إدارة البرامج",
          trainings: "التدريبات",
          exams: "الامتحانات"
        }
      },
      actions: {
        edit: "تعديل",
        delete: "حذف",
        cancel: "إلغاء",
        addSupervisor: "إضافة مشرف",
        addAssociationSupervisor: "إضافة مشرف جمعية",
        added: "تمت الإضافة"
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
          genericAssociation: "تعذر إضافة مشرف الجمعية. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
          authRequired: "المصادقة مطلوبة.",
          genericDialog: "فشل إضافة المشرف.",
          titleDialog: "خطأ",
          genericCenterDialog: "فشل إضافة مشرف المركز.",
          titleCenterDialog: "خطأ في إضافة مشرف المركز"
        },
        addSuccess: {
          title: "نجاح",
          titleAssociation: "نجاح إضافة مشرف الجمعية",
          message: "تمت إضافة المشرف بنجاح!",
          messageAssociation: "تمت إضافة مشرف الجمعية بنجاح!",
          titleDialog: "نجاح",
          messageDialog: "تمت إضافة المشرف بنجاح!",
          messageCenterDialog: "تمت إضافة مشرف المركز بنجاح!",
          titleCenterDialog: "تمت إضافة مشرف المركز"
        },
        addNewDialogTitle: "إضافة مشرف جمعية جديد",
        addNewDialogDescription: "املأ التفاصيل لإنشاء مشرف جديد. سيتم إنشاء البريد الإلكتروني وكلمة المرور تلقائيًا.",
        addNewCenterSupervisorDialogTitle: "إضافة مشرف مركز جديد",
        addNewCenterSupervisorDialogDescription: "املأ التفاصيل لإنشاء مشرف مركز جديد. سيتم إنشاء البريد الإلكتروني وكلمة المرور تلقائيًا."
      },
      adminDashboardTitle: 'لوحة تحكم المسؤول',
      welcomeAdmin: 'مرحباً، أيها المسؤول!',
      centerDashboardTitle: 'لوحة تحكم مشرف المركز',
      welcomeCenterSupervisor: 'مرحباً مشرف المركز! قم بإدارة مركزك من هنا.',
      associationDashboardTitle: 'لوحة تحكم مشرف الجمعية',
      welcomeAssociationSupervisor: 'مرحباً، مشرف الجمعية!',
      trainerDashboardTitle: 'لوحة تحكم المدرب',
      welcomeTrainer: 'مرحباً، أيها المدرب!',
      studentDashboardTitle: 'لوحة تحكم الطالب',
      welcomeStudent: 'مرحباً، أيها الطالب!',
      centerStudentsPageTitle: 'إدارة طلاب المركز',
      manageCenterStudentsMessage: 'هنا يمكنك إدارة جميع الطلاب المسجلين في مركزك.',
      notFoundTitle: '404 - الصفحة غير موجودة',
      goHome: 'العودة إلى الرئيسية',
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
        tableHeaderSupervisorName: "اسم المشرف",
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
          successMessage: "تم إنشاء المركز بنجاح!",
          selectCityPlaceholder: "اختر مدينة",
          labelLogo: "شعار المركز",
          buttons: {
            addSupervisorShort: "إضافة مشرف جديد"
          },
          messages: {
            centerSupervisorAddedSuccessfully: "تمت إضافة مشرف مركز جديد وتم اختياره."
          }
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
            createAssociation: "إنشاء الجمعية",
            addSupervisorShort: "إضافة جديد"
          },
          messages: {
            loadingSupervisorsError: "فشل تحميل المشرفين المحتملين.",
            authTokenNotFound: "لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.",
            supervisorNotSelected: "يرجى اختيار مشرف.",
            creationSuccess: "تم إنشاء الجمعية بنجاح! جارٍ إعادة التوجيه...",
            creationErrorDefault: "فشل إنشاء الجمعية. استجابة الخادم ليست بتنسيق JSON.",
            unknownError: "حدث خطأ غير معروف.",
            supervisorNameDisplay: "{{firstName}} {{lastName}} (المعرف: {{id}})",
            supervisorNameDisplayWithArabic: "{{firstName}} {{lastName}} ({{arabicFirstName}} {{arabicLastName}})",
            supervisorAddedSuccessfully: "تمت إضافة مشرف جديد وتم اختياره."
          },
          supervisorDropdown: {
            select: "اختر مشرفًا",
            loading: "جارٍ تحميل المشرفين...",
            noneAvailable: "لا يوجد مشرفون متاحون",
            noAssociationSupervisors: "لم يتم العثور على مشرفي جمعيات.",
            availableSupervisorsLabel: "المشرفون المتاحون"
          },
          requiredField: "*",
          addError: {
            title: "خطأ",
            titleAssociation: "خطأ",
            generic: "تعذر إضافة المشرف. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
            genericAssociation: "تعذر إضافة مشرف الجمعية. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
            authRequired: "المصادقة مطلوبة.",
            genericDialog: "فشل إضافة المشرف.",
            titleDialog: "خطأ",
            genericCenterDialog: "فشل إضافة مشرف المركز.",
            titleCenterDialog: "خطأ في إضافة مشرف المركز"
          },
          addSuccess: {
            title: "نجاح",
            titleAssociation: "نجاح إضافة مشرف الجمعية",
            message: "تمت إضافة المشرف بنجاح!",
            messageAssociation: "تمت إضافة مشرف الجمعية بنجاح!",
            titleDialog: "نجاح",
            messageDialog: "تمت إضافة المشرف بنجاح!",
            messageCenterDialog: "تمت إضافة مشرف المركز بنجاح!",
            titleCenterDialog: "تمت إضافة مشرف المركز"
          },
          addNewDialogTitle: "إضافة مشرف جمعية جديد",
          addNewDialogDescription: "املأ التفاصيل لإنشاء مشرف جديد. سيتم إنشاء البريد الإلكتروني وكلمة المرور تلقائيًا.",
          addNewCenterSupervisorDialogTitle: "إضافة مشرف مركز جديد",
          addNewCenterSupervisorDialogDescription: "املأ التفاصيل لإنشاء مشرف مركز جديد. سيتم إنشاء البريد الإلكتروني وكلمة المرور تلقائيًا."
        },
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
      },
      trainingPrograms: {
        title: "التكوينات",
        addNew: "إضافة تكوين جديد",
        noPrograms: "لم يتم العثور على برامج تكوين.",
        error: {
          notAuthenticated: "رمز المصادقة مفقود. يرجى تسجيل الدخول.",
          unknown: "حدث خطأ غير معروف أثناء جلب برامج التكوين."
        }
      },
      adminAddTrainingProgram: {
        title: "إضافة برنامج تكوين جديد",
        backButton: "العودة إلى البرامج",
        labels: {
          name: "اسم البرنامج",
          description: "الوصف",
          durationYears: "المدة (سنوات)",
          logo: "الشعار (اختياري)"
        },
        placeholders: {
          name: "أدخل اسم البرنامج",
          description: "أدخل وصف البرنامج",
          durationYears: "مثال: 2"
        },
        buttons: {
          create: "إنشاء البرنامج",
          creating: "جاري الإنشاء..."
        },
        validation: {
          nameRequired: "اسم البرنامج مطلوب.",
          descriptionRequired: "الوصف مطلوب.",
          durationRequired: "المدة مطلوبة.",
          durationPositive: "يجب أن تكون المدة رقمًا موجبًا."
        },
        messages: {
          success: "تم إنشاء برنامج التكوين بنجاح!",
          errorDefault: "فشل إنشاء برنامج التكوين. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
          errorConflict: "يوجد برنامج تكوين بهذا الاسم بالفعل."
        }
      },
      centerInfoPage: {
        tabGeneralInfo: "معلومات عامة",
        tabContactLinks: "الاتصال والروابط",
        tabRooms: "القاعات",
        tabGroups: "المجموعات",
        generalInfo: {
          title: "معلومات عامة",
          affiliatedTo: "تابع لـ :",
          association: "الجمعية :",
          status: "الحالة :",
          active: "نشط",
          inactive: "غير نشط",
          verified: "(موثق)",
          notVerified: "(غير موثق)",
          registeredOn: "مسجل في :",
          lastUpdated: "آخر تحديث :"
        },
        contactLinks: {
          title: "الاتصال والروابط",
          email: "البريد الإلكتروني :",
          phone: "الهاتف :",
          address: "العنوان :",
          location: "الموقع :",
          website: "الموقع الإلكتروني :",
          facebook: "فيسبوك :",
          instagram: "انستجرام :",
          twitter: "تويتر :",
          viewOnMap: "عرض على الخريطة",
          viewProfile: "عرض الملف الشخصي"
        },
        rooms: {
          title: "القاعات ({{count}})",
          description: "تفاصيل حول القاعات المتاحة في المركز.",
          capacity: "السعة :",
          available: "متاح :",
          equipment: "المعدات",
          equipmentItems: "{{count}} عنصر(عناصر)",
          noRooms: "لا توجد قاعات مدرجة لهذا المركز.",
          created: "تاريخ الإنشاء",
          updated: "آخر تحديث",
          type: "النوع",
          noEquipment: "لا توجد معدات مدرجة لهذه القاعة."
        },
        groups: {
          title: "المجموعات ({{count}})",
          description: "تفاصيل حول مجموعات الطلاب في المركز.",
          noGroups: "لا توجد مجموعات مدرجة لهذا المركز."
        }
      },
      centerRoomsPage: {
        noCenterAssigned: "لا يوجد مركز معين حاليًا لحساب المشرف هذا، أو تعذر استرداد بيانات المركز.",
        errorFetching: "خطأ في جلب معلومات قاعات المركز للمشرف:",
        errorFetchingDetail: "فشل في جلب معلومات قاعات المركز. يرجى التأكد من أنك معين كمشرف على مركز وأن المركز يحتوي على قاعات.",
        accessDenied: "الوصول مرفوض. هذه الصفحة مخصصة لمشرفي المراكز، أو أن معرّف المستخدم الخاص بك مفقود.",
        loadingMessage: "جارٍ تحميل قاعات المركز...",
        noRoomsTitle: "لم يتم العثور على قاعات في {{centerName}}",
        noCenterDataTitle: "بيانات المركز غير متوفرة",
        noRoomsDescription: "لا توجد حاليًا أي قاعات مدرجة لهذا المركز. يمكنك إضافة قاعات من خلال بوابة إدارة المركز.",
        noCenterDataDescription: "تعذر تحميل بيانات المركز. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم.",
        pageTitle: "قاعات في {{centerName}}",
        pageSubtitle: "تصفح وأدر كل الـ {{count}} قاعات المتاحة في مركزك.",
        addNewRoomButton: "إضافة قاعة جديدة",
        viewDetailsButton: "عرض التفاصيل"
      },
      centerAddRoomPage: {
        errorNoCenterSupervised: "لا يوجد مركز يشرف عليه هذا الحساب. لا يمكن إضافة قاعة.",
        errorFetchingCenterId: "فشل في جلب معرّف مركز الإشراف. يرجى المحاولة مرة أخرى.",
        errorCenterIdNotSet: "معرّف مركز الإشراف غير معين. لا يمكن إرسال النموذج.",
        errorCreatingRoom: "حدث خطأ أثناء إنشاء القاعة. يرجى التحقق من مدخلاتك والمحاولة مرة أخرى.",
        loadingCenterInfo: "جارٍ تحميل معلومات المركز...",
        errorCritical: "خطأ جسيم",
        errorNoCenterAssociatedAccount: "لا يوجد مركز مرتبط بحساب المشرف هذا. يرجى الاتصال بالإدارة.",
        backToRoomsList: "العودة إلى قائمة القاعات",
        title: "إضافة قاعة جديدة",
        description: "املأ التفاصيل أدناه لإضافة قاعة جديدة إلى مركزك.",
        labels: {
          name: "اسم القاعة",
          description: "الوصف",
          type: "نوع القاعة",
          capacity: "السعة",
          isAvailable: "هل هي متاحة",
          picture: "صورة القاعة"
        },
        placeholders: {
          selectType: "اختر نوع القاعة"
        },
        buttons: {
          createRoom: "إنشاء القاعة"
        },
        validation: {
          nameRequired: "اسم القاعة مطلوب.",
          typeRequired: "نوع القاعة مطلوب.",
          capacityPositive: "يجب أن تكون السعة عددًا موجبًا.",
          centerIdMissing: "معرّف المركز مفقود. هذا خطأ داخلي."
        }
      },
      roomTypes: {
        classroom: "قاعة دراسية",
        meeting_room: "قاعة اجتماعات",
        auditorium: "قاعة محاضرات",
        lab: "مختبر",
        other: "أخرى"
      },
      equipmentConditions: {
        new: "جديد",
        excellent: "ممتاز",
        good: "جيد",
        fair: "مقبول",
        need_reparation: "يحتاج إصلاح",
        damaged: "تالف"
      },
      centerRoomDetailsPage: {
        errorNoRoomId: "معرّف القاعة مفقود. لا يمكن جلب التفاصيل.",
        errorFetchingDetails: "فشل في جلب تفاصيل القاعة. يرجى المحاولة مرة أخرى.",
        confirmDelete: "هل أنت متأكد أنك تريد حذف القاعة \"{{roomName}}\"؟ هذا الإجراء لا يمكن التراجع عنه.",
        errorDeletingRoom: "فشل في حذف القاعة. يرجى المحاولة مرة أخرى.",
        loadingRoomDetails: "جارٍ تحميل تفاصيل القاعة...",
        backToRoomsList: "العودة إلى قائمة القاعات",
        roomNotFoundTitle: "القاعة غير موجودة",
        roomNotFoundDescription: "القاعة التي تبحث عنها غير موجودة أو تعذر تحميلها.",
        sectionTitles: {
          generalInfo: "معلومات عامة",
          timestamps: "الطوابع الزمنية",
          equipmentInRoom: "المعدات في هذه القاعة"
        },
        fields: {
          type: "النوع",
          capacity: "السعة",
          isAvailable: "التوفر",
          createdAt: "تاريخ الإنشاء",
          updatedAt: "آخر تحديث",
          equipmentCondition: "الحالة",
          equipmentQuantity: "الكمية"
        },
        viewEquipmentPicture: "عرض الصورة",
        noEquipmentInRoom: "لا توجد معدات مدرجة لهذه القاعة."
      },
      centerEditRoomPage: {
        title: "تعديل القاعة: {{roomName}}",
        description: "قم بتعديل تفاصيل القاعة أدناه.",
        loadingInitialData: "جارٍ تحميل بيانات القاعة للتعديل...",
        errorFetchingData: "فشل تحميل بيانات القاعة. يرجى المحاولة مرة أخرى أو العودة.",
        errorUpdatingRoom: "فشل تحديث القاعة. يرجى التحقق من مدخلاتك والمحاولة مرة أخرى.",
        errorNoRoomId: "لم يتم توفير معرّف للقاعة. لا يمكن تحميل البيانات للتعديل.",
        errorRoomNotFound: "القاعة غير موجودة للتعديل",
        errorRoomNotFoundDescription: "القاعة التي تحاول تعديلها غير موجودة أو تعذر تحميلها.",
        backToRoomDetails: "العودة إلى تفاصيل القاعة",
        currentImageAlt: "الصورة الحالية للقاعة",
        currentImageNotice: "الصورة الحالية. قم بتحميل ملف جديد لاستبدالها.",
        buttons: {
          saveChanges: "حفظ التغييرات"
        }
      },
      centerEquipmentPage: {
        pageTitle: "المعدات في {{centerName}}",
        pageSubtitle: "إدارة كل الـ {{count}} من المعدات في مركزك.",
        addNewEquipmentButton: "إضافة معدات جديدة",
        loadingMessage: "جارٍ تحميل معدات المركز...",
        errorFetching: "خطأ في جلب بيانات المعدات لمشرف المركز:",
        errorFetchingDetail: "فشل في جلب معلومات المعدات. يرجى التأكد من وجود مركزك وأن لديه معدات مدرجة.",
        noEquipmentTitle: "لم يتم العثور على معدات في {{centerName}}",
        noEquipmentDescription: "لا توجد حاليًا أي معدات مدرجة لهذا المركز. يمكنك إضافة عناصر من خلال بوابة إدارة المعدات.",
        fields: {
          quantity: "الكمية",
          condition: "الحالة",
          assignedRoom: "القاعة المعينة",
          assignedRoomId: "معرّف القاعة المعينة"
        },
        actions: {
          addNotImplemented: "سيتم تنفيذ وظيفة إضافة المعدات قريبًا.",
          viewNotImplemented: "سيتم تنفيذ وظيفة عرض تفاصيل المعدات قريبًا.",
          editNotImplemented: "سيتم تنفيذ وظيفة تعديل المعدات قريبًا.",
          deleteNotImplemented: "سيتم تنفيذ وظيفة حذف المعدات قريبًا."
        }
      },
      centerAddEquipmentPage: {
        title: "إضافة معدات جديدة",
        description: "املأ التفاصيل أدناه لإضافة معدات جديدة إلى مركزك.",
        backToEquipmentList: "العودة إلى قائمة المعدات",
        loadingInitialDataMessage: "جارٍ تحميل بيانات المركز والغرف...",
        errorNoCenterSupervised: "لا يوجد مركز يشرف عليه هذا الحساب. لا يمكن إضافة معدات.",
        errorFetchingInitialData: "فشل في جلب البيانات الأولية (المركز/الغرف). يرجى المحاولة مرة أخرى.",
        errorCenterIdNotSet: "معرّف مركز الإشراف غير معين. لا يمكن إرسال النموذج.",
        errorCreatingEquipment: "حدث خطأ أثناء إنشاء المعدات. يرجى التحقق من مدخلاتك والمحاولة مرة أخرى.",
        errorCritical: "خطأ جسيم",
        labels: {
          name: "اسم المعدات",
          description: "الوصف",
          condition: "الحالة",
          quantity: "الكمية",
          picture: "صورة المعدات",
          room: "تعيين إلى غرفة"
        },
        placeholders: {
          selectCondition: "اختر الحالة",
          selectRoom: "اختر غرفة (اختياري)",
          noRoomAssigned: "لا توجد غرفة / غير معين"
        },
        buttons: {
          createEquipment: "إضافة المعدات"
        },
        validation: {
          nameRequired: "اسم المعدات مطلوب.",
          quantityPositive: "يجب أن تكون الكمية عددًا موجبًا إذا تم توفيرها.",
          centerIdMissing: "معرّف المركز مفقود. هذا خطأ داخلي."
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