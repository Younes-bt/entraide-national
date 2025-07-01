export const en = {
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
      groups: "Groups",
      schedules: "Schedules",
      attendance: "Attendance",
      trainingPrograms: "Training Programs",
      trainingCourses: "Training Courses",
      annualCourseDistribution: "Annual Course Distribution",
      courses: "Courses",
      // Added for Trainer
      myClasses: "My Classes",
      schedule: "Schedule",
      materials: "Materials",
      exams: {
        comingSoon: "Coming Soon"
      },
      sections: {
        overview: "Overview",
        hr: "HR Management",
        center: "Center Management",
        programme: "Programme Management",
        trainings: "Trainings",
        exams: "Exams",
        classes: "Classes",
        students: "Students",
        courses: "Courses"
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
    
    // Trainer Students Page
    trainerStudentsPage: {
      title: "My Students",
      subtitle: "Manage and view your students by group",
      authError: "Authentication error",
      errorTitle: "Error",
      noGroupsTitle: "No Groups Assigned",
      noGroupsDescription: "You are not currently assigned to any groups. Please contact your center supervisor.",
      loadingTrainerData: "Loading trainer data...",
      groupsTitle: "Student Groups",
      studentsCount: "students",
      createdOn: "Created",
      loadingStudents: "Loading students...",
      noStudentsFound: "No students found",
      noStudentsInGroup: "No students in this group",
      tryDifferentSearch: "Try a different search term",
      groupEmpty: "This group currently has no students assigned",
      searchPlaceholder: "Search students by name, email, or exam ID...",
      searchResults: "Found {{found}} of {{total}} students matching \"{{term}}\"",
      totalStudents: "{{count}} students in this group",
      table: {
        student: "Student",
        examId: "Exam ID",
        academicYear: "Academic Year",
        joiningDate: "Joining Date",
        status: "Status",
        actions: "Actions"
      },
      status: {
        active: "Active",
        inactive: "Inactive"
      },
      actions: {
        viewDetails: "View Details"
      }
    },
    studentDashboardTitle: 'Student Dashboard',
    welcomeStudent: 'Welcome, Student!',
    // Center Students Page
    centerStudentsPageTitle: 'Manage Center Students',
    manageCenterStudentsMessage: 'Here you can manage all students registered in your center.',
    
    centerStudentsPage: {
      pageTitle: "Students at {{centerName}}",
      pageSubtitle: "Manage all {{count}} students in your center.",
      addNewStudentButton: "Add New Student",
      bulkImportButton: "Bulk Import",
      loadingMessage: "Loading center students...",
      errorFetching: "Error fetching student data for center supervisor:",
      errorFetchingDetail: "Failed to fetch student information. Please ensure your center exists and has students enrolled.",
      noStudentsTitle: "No Students Found at {{centerName}}",
      noStudentsDescription: "There are currently no students enrolled in this center. You can add students through the student management portal.",
      noStudentsFound: "No students found.",
      noStudentsMatchFilter: "No students match the current filters.",
      noCenterAssigned: "No center is currently assigned to this supervisor account, or the center data could not be retrieved.",
      noCenterDataTitle: "Center Data Not Available",
      noCenterDataDescription: "Could not load center data. Please try again later or contact support.",
      accessDenied: "Access denied. This page is for center supervisors, or your user ID is missing.",
      errorAuthNotAvailable: "User not authenticated or token not available.",
      searchPlaceholder: "Search students by name, email, or exam ID...",
      filterByProgram: "Filter by Program",
      filterByGroup: "Filter by Group",
      allPrograms: "All Programs",
      allGroups: "All Groups",
      studentsListTitle: "Students List",
      noGroup: "No Group",
      noCourse: "No Course",
      openMenu: "Open menu",
      tableHeaders: {
        student: "Student",
        examId: "Exam ID",
        program: "Program",
        group: "Group",
        academicYear: "Academic Year",
        joiningDate: "Joining Date",
        actions: "Actions"
      },
      actions: {
        viewDetails: "View Details",
        edit: "Edit",
        delete: "Delete",
        confirmDeactivate: "Are you sure you want to deactivate this student? They will no longer be able to access the system."
      },
      dialogDescription: "Detailed information about the student.",
      dialogSections: {
        studentInfo: "Student Information",
        personalInfo: "Personal Information",
        contactInfo: "Contact Information",
        profilePicture: "Profile Picture"
      },
      dialogLabels: {
        examId: "Exam ID",
        program: "Program",
        group: "Group",
        academicYear: "Academic Year",
        joiningDate: "Joining Date",
        trainingCourse: "Training Course",
        centerCode: "Center Code",
        user: {
          email: "Email",
          username: "Username",
          arabicFirstName: "Arabic First Name",
          arabicLastName: "Arabic Last Name",
          birthDate: "Birth Date",
          birthCity: "Birth City",
          cin: "National ID (CIN)",
          role: "Role",
          phoneNumber: "Phone Number",
          address: "Address",
          city: "City"
        }
      }
    },
    // Not Found Page
    notFoundTitle: '404 - Page Not Found',
    goHome: 'Go Home',

    // AdminCenterDetailsPage translations
    adminCenterDetailsPage: {
      errorNoCenterId: 'Center ID not provided',
      errorAuthRequired: 'Authentication required',
      errorFetchingDetails: 'Failed to fetch center details',
      loadingDetails: 'Loading center details...',
      backToCenters: 'Back to Centers',
      centerNotFoundTitle: 'Center Not Found',
      centerNotFoundDescription: 'The requested center could not be found.',
      editCenter: 'Edit Center',
      deleteCenter: 'Delete Center',
      confirmDelete: 'Are you sure you want to delete this center? This action cannot be undone.',
      errorDeleting: 'Failed to delete center',
      
      // Tab names
      tabGeneral: 'General Info',
      tabContact: 'Contact & Links',
      tabRooms: 'Rooms',
      tabGroups: 'Groups',
      tabStudents: 'Students',
      tabTrainers: 'Trainers',
      
      // General Info section
      generalInfo: {
        title: 'General Information',
        basicInfo: 'Basic Information',
        id: 'ID',
        affiliation: 'Affiliation',
        association: 'Association',
        otherAffiliation: 'Other Affiliation',
        supervisor: 'Supervisor',
        supervisorName: 'Name',
        supervisorUsername: 'Username',
        noSupervisor: 'No supervisor assigned',
        statistics: 'Statistics',
        roomsCount: 'Rooms',
        groupsCount: 'Groups',
        timestamps: 'Timestamps',
        createdAt: 'Created At',
        updatedAt: 'Last Updated'
      },
      
      // Contact section
      contact: {
        title: 'Contact Information & Links',
        contactInfo: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        location: 'Location',
        viewOnMap: 'View on Map',
        socialLinks: 'Website & Social Media',
        website: 'Website',
        facebook: 'Facebook',
        instagram: 'Instagram',
        twitter: 'Twitter',
        viewProfile: 'View Profile',
        noSocialLinks: 'No website or social media links available'
      },
      
      // Rooms section
      rooms: {
        description: 'All available rooms in this center',
        capacity: 'Capacity',
        available: 'Available',
        equipment: 'Equipment',
        items: 'items',
        viewDetails: 'View Details',
        noRooms: 'No rooms found for this center'
      },
      
      // Groups section
      groups: {
        description: 'All student groups in this center',
        createdAt: 'Created At',
        updatedAt: 'Updated At',
        viewDetails: 'View Details',
        noGroups: 'No groups found for this center'
      },

      // Students section
      students: {
        description: 'All students enrolled in this center',
        searchPlaceholder: 'Search students by name, email or exam ID...',
        filterByStatus: 'Filter by Status',
        filterByProgram: 'Filter by Program',
        allStatuses: 'All Statuses',
        allPrograms: 'All Programs',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        clearFilters: 'Clear Filters',
        resultsCount: 'Showing {{count}} of {{total}} students',
        noStudents: 'No students found for this center',
        noStudentsMatchFilters: 'No students match the current filters',
        tableHeaders: {
          examId: 'Exam ID',
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          program: 'Program',
          joiningDate: 'Joining Date',
          status: 'Status'
        }
      },

      // Trainers section
      trainers: {
        description: 'All trainers assigned to this center',
        searchPlaceholder: 'Search trainers by name or email...',
        filterByStatus: 'Filter by Status',
        filterByContract: 'Filter by Contract',
        filterByProgram: 'Filter by Program',
        allStatuses: 'All Statuses',
        allContracts: 'All Contracts',
        allPrograms: 'All Programs',
        statusActive: 'Active',
        statusInactive: 'Inactive',
        contractEntraide: 'Entraide National',
        contractAssociation: 'Association',
        clearFilters: 'Clear Filters',
        resultsCount: 'Showing {{count}} of {{total}} trainers',
        noTrainers: 'No trainers found for this center',
        noTrainersMatchFilters: 'No trainers match the current filters',
        tableHeaders: {
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          program: 'Program',
          contractWith: 'Contract With',
          contractPeriod: 'Contract Period',
          status: 'Status'
        }
      }
    },

    // Added for AdminCentersPage
    common: {
      yes: "Yes",
      no: "No",
      closeButton: "Close",
      loading: "Loading...",
      cancelButton: "Cancel",
      optional: "Optional",
      backToList: "Back to List",
      back: "Back"
    },
    adminCentersPage: {
      title: "Manage Centers",
      addNewCenterButton: "Add New Center",
      searchPlaceholder: "Search centers...",
      filterByCity: "City",
      allCities: "All Cities",
      filterByAffiliation: "Affiliation",
      allAffiliations: "All Affiliations",
      affiliationOther: "Other",
      filterByStatus: "Status",
      allStatuses: "All",
      statusActive: "Active",
      statusInactive: "Inactive",
      filterByVerified: "Verified",
      allVerificationStatuses: "All",
      verifiedOnly: "Verified",
      unverifiedOnly: "Unverified",
      clearFilters: "Clear Filters",
      resultsCount: "Showing {{count}} of {{total}} centers",
      noCentersMatchFilters: "No centers match your current filters",
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
          titleDialog: "Success",
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
    },
    adminAssociationsPage: {
      title: "Manage Associations",
      addNewAssociationButton: "Add New Association",
      searchPlaceholder: "Search associations...",
      filterByCity: "City",
      allCities: "All Cities",
      filterByStatus: "Status",
      allStatuses: "All",
      statusActive: "Active",
      statusInactive: "Inactive",
      filterByVerified: "Verified",
      allVerificationStatuses: "All",
      verifiedOnly: "Verified",
      unverifiedOnly: "Unverified",
      clearFilters: "Clear Filters",
      resultsCount: "Showing {{count}} of {{total}} associations",
      loadingAssociations: "Loading associations...",
      confirmDeleteAssociation: "Are you sure you want to delete association {{associationId}}?",
      errorDeletingAssociation: "Error deleting association: {{message}}",
      logoAlt: "{{name}} logo",
      notAvailable: "N/A",
      openMenuSr: "Open menu",
      actionViewDetails: "View Details",
      actionEdit: "Edit",
      actionDelete: "Delete",
      noAssociationsMatchFilters: "No associations match your current filters",
      noAssociationsFound: "No associations found"
    },
    adminAssociationDetailsPage: {
      errorNoAssociationId: 'Association ID not provided',
      errorAuthRequired: 'Authentication required',
      errorFetchingDetails: 'Failed to fetch association details',
      loadingDetails: 'Loading association details...',
      backToAssociations: 'Back to Associations',
      associationNotFoundTitle: 'Association Not Found',
      associationNotFoundDescription: 'The requested association could not be found.',
      editAssociation: 'Edit Association',
      deleteAssociation: 'Delete Association',
      confirmDelete: 'Are you sure you want to delete this association? This action cannot be undone.',
      errorDeleting: 'Failed to delete association',
      statusActive: 'Active',
      statusInactive: 'Inactive',
      statusVerified: 'Verified',
      statusUnverified: 'Unverified',
      notAvailable: 'N/A',
      
      // Tab names
      tabGeneral: 'General Info',
      tabContact: 'Contact & Links',
      tabCenters: 'Centers',
      tabContract: 'Contract',
      
      // General Info section
      generalInfo: {
        title: 'General Information',
        basicInfo: 'Basic Information',
        id: 'ID',
        description: 'Description',
        registrationNumber: 'Registration Number',
        supervisor: 'Supervisor',
        supervisorName: 'Name',
        supervisorEmail: 'Email',
        noSupervisor: 'No supervisor assigned',
        statistics: 'Statistics',
        centersCount: 'Centers',
        timestamps: 'Timestamps',
        createdAt: 'Created At',
        updatedAt: 'Last Updated'
      },
      
      // Contact section
      contact: {
        title: 'Contact Information & Links',
        contactInfo: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        location: 'Location',
        viewOnMap: 'View on Map',
        socialLinks: 'Website & Social Media',
        website: 'Website',
        facebook: 'Facebook',
        instagram: 'Instagram',
        twitter: 'Twitter',
        noSocialLinks: 'No website or social media links available'
      },
      
      // Centers section
      centers: {
        title: 'Associated Centers',
        description: 'All centers affiliated with this association',
        active: 'Active',
        inactive: 'Inactive',
        verified: 'Verified',
        unverified: 'Unverified',
        viewDetails: 'View Details',
        noCenters: 'No centers found for this association'
      },
      
      // Contract section
      contract: {
        title: 'Contract Information',
        startDate: 'Contract Start Date',
        endDate: 'Contract End Date',
        noContractInfo: 'No contract information available'
      }
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
        description: "Details about the center's available rooms.",
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
      equipment: { // Added section for shared equipment keys in tables
        name: "Name",
        quantityShort: "Qty",
        condition: "Condition"
      },
      groups: {
        title: "Groups ({{count}})",
        description: "Details about the center's student groups.",
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
        equipmentQuantity: "Quantity",
        equipmentName: "Name" // Added for table header
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
    },
    centerGroupsPage: {
      pageTitle: "Groups at {{centerName}}",
      pageSubtitle: "Manage all {{count}} groups in your center.",
      addNewGroupButton: "Add New Group",
      loadingMessage: "Loading center groups...",
      errorFetching: "Error fetching group data for center supervisor:",
      errorFetchingDetail: "Failed to fetch group information. Please ensure your center exists and has groups listed.",
      noGroupsTitle: "No Groups Found at {{centerName}}",
      noGroupsDescription: "There are currently no groups listed for this center. You can add groups through the group management portal.",
      noCenterAssigned: "No center is currently assigned to this supervisor account, or the center data could not be retrieved.",
      accessDenied: "Access denied. This page is for center supervisors, or your user ID is missing.",
      fields: {
        description: "Description",
        createdAt: "Created",
        updatedAt: "Updated"
      },
      actions: {
        viewDetails: "View Details",
        edit: "Edit",
        delete: "Delete"
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
        authError: "Authentication error. Please ensure you are logged in and have a valid token.",
        fetchCenterError: "Failed to fetch your supervised center. Please try again.",
        noCenterAssigned: "You are not currently assigned as a supervisor to any center, or the center data could not be retrieved.",
        fetchProgramsError: "Failed to fetch training programs. Please try again.",
        fetchGroupsError: "Failed to fetch groups for your center. Please try again.",
        fetchCoursesError: "Failed to fetch training courses for the selected program and center. Please try again.",
        centerNotLoaded: "Center information is not loaded yet. Please wait or refresh.",
        submitError: "Failed to create student. Please check the details and try again.",
        submitErrorUnknown: "An unknown error occurred while submitting the form."
      },
      successMessage: "Student created successfully!",
      authPrompt: "Please log in to add a new student.",
      title: "Add New Student",
      centerInfo: "Adding student to center: {{centerName}}",
      labels: {
        firstName: "First Name (French)",
        lastName: "Last Name (French)",
        arabicFirstName: "First Name (Arabic)",
        arabicLastName: "Last Name (Arabic)",
        examId: "Exam ID",
        academicYear: "Academic Year",
        joiningDate: "Joining Date",
        centerCode: "Center Code (Optional)",
        program: "Training Program",
        trainingCourse: "Training Course (Optional)",
        group: "Group (Optional)",
        cinId: "National ID (CIN)",
        phoneNumber: "Phone Number",
        birthDate: "Birth Date",
        birthCity: "Birth City",
        address: "Address",
        city: "City"
      },
      placeholders: {
        optional: "Optional",
        selectProgram: "Select a training program",
        selectCourse: "Select a training course",
        selectGroup: "Select a group",
        academicYear: "e.g., 2023-2024",
        cinId: "e.g., AB123456",
        phoneNumber: "e.g., 0600000000",
        birthCity: "e.g., Rabat",
        address: "e.g., 123 Main St, Apt 4B",
        city: "e.g., Casablanca"
      },
      courseNameUnavailable: "Course name unavailable",
      noCoursesForProgram: "No training courses available for the selected program, or an error occurred.",
      buttons: {
        cancel: "Cancel",
        submitting: "Submitting...",
        submit: "Create Student"
      }
    },
    centerUpdateStudent: { // New section for update student page
      title: "Update Student Information",
      editingFor: "Editing student: {{studentEmail}} (Exam ID: {{examId}})",
      loadingStudent: "Loading student details...",
      errors: {
        missingInfo: "Student ID or authentication token missing. Cannot load details.",
        fetchStudentError: "Failed to fetch student details. Please try again.",
        missingInfoSubmit: "Student ID or center information is missing. Cannot submit update.",
        submitError: "Failed to update student. Please check details and try again.",
        submitErrorUnknown: "An unknown error occurred while saving changes."
      },
      successMessage: "Student updated successfully!",
      buttons: {
        saving: "Saving...",
        saveChanges: "Save Changes"
      },
      displayOnly: {
        examIdLabel: "Exam ID (Auto-generated)",
        centerCodeLabel: "Center Code (Auto-generated)"
      }
    },
    centerStudentDetailsPage: { // New section for student details page
      title: "Student Details",
      description: "Viewing details for student: {{email}} (Exam ID: {{examId}})",
      loading: "Loading student details...",
      noData: "Student data not found or could not be loaded.",
      errors: {
        missingInfo: "Student ID or authentication token missing. Cannot load details.",
        fetchStudentError: "Failed to fetch student details. Please try again.",
        fetchStudentErrorUnknown: "An unknown error occurred while fetching student details."
      }
    },
    centerTrainersPage: {
      pageTitle: "Trainers at {{centerName}}",
      pageSubtitle: "Manage all {{count}} trainers in your center.",
      addNewTrainerButton: "Add New Trainer",
      loadingMessage: "Loading center trainers...",
      errorFetching: "Error fetching trainer data for center supervisor:",
      errorFetchingDetail: "Failed to fetch trainer information. Please ensure your center exists and has trainers enrolled.",
      noTrainersTitle: "No Trainers Found",
      noTrainersDescription: "There are currently no trainers registered in the system.",
      noTrainersFound: "No trainers found.",
      noTrainersMatchFilter: "No trainers match the current filters.",
      noTrainersMatchFilters: "No trainers match the current filters.",
      noCenterAssigned: "No center is currently assigned.",
      noCenterDataTitle: "Center Data Not Available",
      noCenterDataDescription: "Could not load center data. Please try again later or contact support.",
      accessDenied: "Access denied. This page is for center supervisors, or your user ID is missing.",
      errorAuthNotAvailable: "User not authenticated or token not available.",
      searchPlaceholder: "Search trainers by name, email, or specialization...",
      filterBySpecialization: "Filter by Specialization",
      filterByProgram: "Filter by Program",
      filterByStatus: "Filter by Status",
      allSpecializations: "All Specializations",
      allPrograms: "All Programs",
      allStatuses: "All Statuses",
      allContracts: "All Contracts",
      allCenters: "All Centers",
      clearFilters: "Clear Filters",
      trainersListTitle: "Trainers List",
      noSpecialization: "No Specialization",
      openMenu: "Open menu",
      tableHeaders: {
        trainer: "Trainer",
        specialization: "Specialization",
        program: "Program",
        employmentStatus: "Employment Status",
        experience: "Experience",
        actions: "Actions",
        contractWith: "Contract With",
        contractStart: "Contract Start",
        contractEnd: "Contract End"
      },
      actions: {
        viewDetails: "View Details",
        edit: "Edit",
        delete: "Delete",
        deactivate: "Deactivate",
        confirmDeactivate: "Are you sure you want to deactivate this trainer? They will no longer be able to access the system."
      },
      unknownProgram: "Unknown Program",
      errorTitleCritical: "Critical Error",
      checkAssignment: "Please check your center assignment or contact administration.",
      errorFetchingTrainersTitle: "Error Fetching Trainers",
      errorFetchingTrainersForCenter: "Failed to fetch trainers for center {{centerName}}",
      contractEnds: "Contract Ends",
      dialogDescription: "Detailed information about the trainer.",
      dialogSections: {
        trainerInfo: "Trainer Information",
        personalInfo: "Personal Information",
        contactInfo: "Contact Information",
        profilePicture: "Profile Picture"
      },
      dialogLabels: {
        specialization: "Specialization",
        program: "Program",
        employmentStatus: "Employment Status",
        experience: "Years of Experience",
        centerCode: "Center Code",
        user: {
          email: "Email",
          username: "Username",
          arabicFirstName: "Arabic First Name",
          arabicLastName: "Arabic Last Name",
          birthDate: "Birth Date",
          birthCity: "Birth City",
          cin: "National ID (CIN)",
          role: "Role",
          phoneNumber: "Phone Number",
          address: "Address",
          city: "City"
        }
      }
    },
    centerAddNewTrainer: {
      errors: {
        authError: "Authentication error. Please ensure you are logged in and have a valid token.",
        fetchCenterError: "Failed to fetch your supervised center. Please try again.",
        noCenterAssigned: "You are not currently assigned as a supervisor to any center, or the center data could not be retrieved.",
        fetchProgramsError: "Failed to fetch training programs. Please try again.",
        centerNotLoaded: "Center information is not loaded yet. Please wait or refresh.",
        submitError: "Failed to create trainer. Please check the details and try again.",
        submitErrorUnknown: "An unknown error occurred while submitting the form."
      },
      successMessage: "Trainer created successfully!",
      authPrompt: "Please log in to add a new trainer.",
      title: "Add New Trainer",
      centerInfo: "Adding trainer to center: {{centerName}}",
      labels: {
        firstName: "First Name (French)",
        lastName: "Last Name (French)",
        arabicFirstName: "First Name (Arabic)",
        arabicLastName: "Last Name (Arabic)",
        program: "Training Program",
        contractWith: "Contract With",
        contractStartDate: "Contract Start Date",
        contractEndDate: "Contract End Date",
        cinId: "National ID (CIN) (Optional)",
        phoneNumber: "Phone Number (Optional)",
        birthDate: "Birth Date (Optional)",
        birthCity: "Birth City (Optional)",
        address: "Address (Optional)",
        city: "City (Optional)"
      },
      placeholders: {
        selectProgram: "Select a training program",
        selectContractWith: "Select contract type",
        cinId: "e.g., AB123456",
        phoneNumber: "e.g., 0600000000",
        birthCity: "e.g., Rabat",
        address: "e.g., 123 Main St, Apt 4B",
        city: "e.g., Casablanca"
      },
      contractChoices: {
        entraide: "Entraide National",
        association: "Association"
      },
      buttons: {
        cancel: "Cancel",
        submitting: "Submitting...",
        submit: "Create Trainer"
      }
    },
    centerEditTrainer: {
      errors: {
        authError: "Authentication error. Please ensure you are logged in and have a valid token.",
        fetchCenterError: "Failed to fetch your supervised center. Please try again.",
        noCenterAssigned: "You are not currently assigned as a supervisor to any center, or the center data could not be retrieved.",
        fetchProgramsError: "Failed to fetch training programs. Please try again.",
        fetchTrainerError: "Failed to fetch trainer details. Please try again.",
        missingInfo: "Trainer ID or authentication token missing. Cannot load details.",
        missingInfoSubmit: "Trainer ID or center information is missing. Cannot submit update.",
        submitError: "Failed to update trainer. Please check details and try again.",
        submitErrorUnknown: "An unknown error occurred while saving changes."
      },
      successMessage: "Trainer updated successfully!",
      authPrompt: "Please log in to edit trainer.",
      loadingTrainer: "Loading trainer details...",
      title: "Edit Trainer",
      editingFor: "Editing trainer: {{trainerEmail}}",
      buttons: {
        saving: "Saving...",
        saveChanges: "Save Changes"
      }
    },
    adminEditAssociationPage: {
      title: "Edit Association",
      subtitle: "Modify the association details below",
      backToDetails: "Back to Association Details",
      loadingData: "Loading association data...",
      errorLoadingTitle: "Error Loading Association",
      saving: "Saving...",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      basicInfoTitle: "Basic Information",
      basicInfoDescription: "Update the core details of the association",
      contactInfoTitle: "Contact Information", 
      contactInfoDescription: "Update contact details and social media links",
      contractInfoTitle: "Contract Information",
      contractInfoDescription: "Update contract dates and details",
      socialMediaTitle: "Social Media & Links",
      
      // Form labels
      associationName: "Association Name",
      registrationNumber: "Registration Number", 
      description: "Description",
      supervisor: "Supervisor",
      email: "Email",
      phoneNumber: "Phone Number",
      address: "Address",
      city: "City",
      websiteUrl: "Website URL",
      mapsLink: "Google Maps Link",
      facebookUrl: "Facebook URL",
      instagramUrl: "Instagram URL", 
      twitterUrl: "Twitter URL",
      contractStartDate: "Contract Start Date",
      contractEndDate: "Contract End Date",
      
      // Placeholders
      enterName: "Enter association name",
      enterRegistration: "Enter registration number",
      enterDescription: "Enter association description",
      selectSupervisor: "Select supervisor",
      noSupervisor: "No supervisor",
      enterEmail: "Enter email address",
      enterPhone: "Enter phone number", 
      enterAddress: "Enter address",
      enterCity: "Enter city",
      websitePlaceholder: "https://example.com",
      mapsPlaceholder: "Google Maps URL",
      facebookPlaceholder: "Facebook page URL",
      instagramPlaceholder: "Instagram profile URL",
      twitterPlaceholder: "Twitter profile URL",
      
      // Messages
      nameRequired: "Association name is required",
      authRequired: "Authentication token not found", 
      unknownError: "An unknown error occurred",
      updateSuccess: "Association updated successfully!",
      updateError: "Failed to update association"
    },
    adminTrainersPage: {
      title: "Manage Trainers",
      addNewTrainerButton: "Add New Trainer",
      searchPlaceholder: "Search trainers by name, email, or specialization...",
      filterBySpecialization: "Filter by Specialization",
      filterByProgram: "Filter by Program",
      filterByStatus: "Filter by Status",
      allSpecializations: "All Specializations",
      allPrograms: "All Programs",
      allStatuses: "All Statuses",
      allContracts: "All Contracts",
      allCenters: "All Centers",
      clearFilters: "Clear Filters",
      resultsCount: "Showing {{count}} of {{total}} trainers",
      trainersListTitle: "Trainers List",
      loadingMessage: "Loading trainers...",
      errorFetching: "Error fetching trainer data:",
      errorFetchingDetail: "Failed to fetch trainer information. Please try again.",
      noTrainersTitle: "No Trainers Found",
      noTrainersDescription: "There are currently no trainers registered in the system.",
      noTrainersFound: "No trainers found.",
      noTrainersMatchFilter: "No trainers match the current filters.",
      noTrainersMatchFilters: "No trainers match the current filters.",
      noCenterAssigned: "No center is currently assigned.",
      noCenterDataTitle: "Data Not Available",
      noCenterDataDescription: "Could not load data. Please try again later.",
      accessDenied: "Access denied. This page is for administrators only.",
      errorAuthNotAvailable: "User not authenticated or token not available.",
      noSpecialization: "No Specialization",
      openMenu: "Open menu",
      statusActive: "Active",
      statusInactive: "Inactive",
      contractEntraide: "Entraide National",
      contractAssociation: "Association",
      tableHeaders: {
        trainer: "Trainer",
        center: "Center",
        specialization: "Specialization",
        program: "Program",
        contractWith: "Contract With",
        contractStart: "Contract Start",
        contractEnd: "Contract End",
        actions: "Actions"
      },
      actions: {
        viewDetails: "View Details",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete this trainer?"
      },
      dialogDescription: "Detailed information about the trainer.",
      dialogSections: {
        trainerInfo: "Trainer Information",
        personalInfo: "Personal Information",
        contactInfo: "Contact Information",
        profilePicture: "Profile Picture"
      },
      dialogLabels: {
        center: "Center",
        specialization: "Specialization",
        program: "Program",
        contractWith: "Contract With",
        contractStart: "Contract Start",
        contractEnd: "Contract End",
        user: {
          email: "Email",
          username: "Username",
          arabicFirstName: "Arabic First Name",
          arabicLastName: "Arabic Last Name",
          birthDate: "Birth Date",
          birthCity: "Birth City",
          cin: "National ID",
          role: "Role",
          phoneNumber: "Phone Number",
          address: "Address",
          city: "City"
        }
      },
      unknownProgram: "Unknown Program",
      contractEnds: "Contract Ends"
    },
    centerSchedulesPage: {
      pageTitle: "Schedules at {{centerName}}",
      pageSubtitle: "Manage {{trainersCount}} trainers and {{groupsCount}} groups.",
      loadingMessage: "Loading center schedules...",
      errorTitle: "Error",
      errorFetching: "Error fetching schedule data for center supervisor:",
      errorAuthNotAvailable: "User not authenticated or token not available.",
      accessDenied: "Access denied. This page is for center supervisors only, or your user ID is missing.",
      noCenterAssigned: "No center is currently assigned to this supervisor account, or the center data could not be retrieved.",
      noCenterDataTitle: "Center Data Not Available",
      noCenterDataDescription: "Unable to load center data. Please try again later or contact support.",
      
      // New tabs
      trainersSchedulesTab: "Trainers Schedules",
      groupsSchedulesTab: "Groups Schedules",
      
      // Trainers section
      trainersListTitle: "Trainers List",
      trainersListDescription: "Select a trainer to view their timetable.",
      searchTrainers: "Search trainers...",
      noTrainersFound: "No trainers found.",
      selectTrainerTitle: "Select a Trainer",
      selectTrainerMessage: "Select a trainer",
      selectTrainerDescription: "Choose a trainer from the list to view their weekly timetable.",
      trainerScheduleTitle: "{{trainerName}}'s Timetable",
      
      // Groups section
      groupsListTitle: "Groups List",
      groupsListDescription: "Select a group to view their timetable.",
      searchGroups: "Search groups...",
      noGroupsFound: "No groups found.",
      selectGroupTitle: "Select a Group",
      selectGroupMessage: "Select a group",
      selectGroupDescription: "Choose a group from the list to view their weekly timetable.",
      groupScheduleTitle: "{{groupName}}'s Timetable",
      
      // Common schedule view
      weeklyScheduleDescription: "Weekly timetable based on schedule templates.",
      loadingSchedule: "Loading timetable...",
      noSchedulesFound: "No schedules found",
      noSchedulesDescription: "No schedules are configured for this selection.",
      
      // Table headers
      day: "Day",
      time: "Time",
      program: "Program",
      trainer: "Trainer",
      group: "Group",
      room: "Room",
      status: "Status",
      
      // Status badges
      active: "Active",
      inactive: "Inactive",
      
      // Legacy fields (kept for compatibility)
      statusScheduled: "Scheduled",
      statusCompleted: "Completed",
      statusCancelled: "Cancelled",
      statusRescheduled: "Rescheduled",
      customTrainer: "Custom Trainer",
      customRoom: "Custom Room",
      customTiming: "Custom Timing",
      notes: "Notes"
    },
    // Days of the week translations
    days: {
      monday: "Monday",
      tuesday: "Tuesday", 
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    },
    
    // Bulk Import translations
    bulkImport: {
      title: "Bulk Import Students",
      description: "Import multiple students from an Excel file. First select program/group assignments, then download the template and upload your data.",
      authRequired: "Authentication required to import students.",
      template: {
        title: "Download Excel Template",
        description: "Download the Excel template with proper columns and sample data. Fields marked with (*) are required. Program and group assignment are handled above.",
        download: "Download Excel Template"
      },
      assignment: {
        title: "Assignment Settings",
        description: "Select the program and optionally a group/training course that will be assigned to all imported students.",
        program: "Training Program",
        group: "Group",
        trainingCourse: "Training Course",
        selectProgram: "Select a program",
        selectGroup: "Select a group",
        selectCourse: "Select a course",
        selectProgramFirst: "Select a program first"
      },
      selectFile: "Select Excel File",
      fileRequirements: "Accepted formats: .xlsx, .xls (max 10MB)",
      selectedFile: "Selected file",
      upload: "Import Students", 
      uploading: "Importing...",
      progress: "Upload Progress",
      success: "Import Completed Successfully!",
      partialSuccess: "Import Completed with Some Errors",
      error: "Import Failed",
      errorDetails: "Error Details",
      viewStudents: "View Students",
      results: {
        total: "Total Rows",
        successful: "Successfully Created",
        failed: "Failed"
      },
      errors: {
        invalidFileType: "Please select an Excel file (.xlsx or .xls)",
        fileTooLarge: "File size must be less than 10MB",
        noFileSelected: "Please select a file to upload",
        noProgramSelected: "Please select a training program",
        uploadFailed: "Upload failed. Please try again."
      }
    },
    
    trainerSchedulePage: {
      title: "My Weekly Schedule",
      subtitle: "Overview of your sessions",
      selectYear: "Select Year",
      takeAttendance: "Take Attendance",
      exitAttendance: "Exit Attendance",
      weeklyScheduleDescription: "Weekly schedule",
      day: "Day",
      fetchError: "Error fetching schedules",
      fetchStudentsError: "Failed to load students",
      saveAttendanceError: "Failed to save attendance",
      noSchedules: "No schedules found",
      takeAttendanceFor: "Attendance for"
    },
    trainerAttendancePage: {
      title: "Attendance",
      subtitle: "Select a date to view attendance",
      searchPlaceholder: "Search notes / session",
      errorTitle: "Error",
      noSession: "No session",
      noSessions: "No sessions",
      noRecords: "No records found"
    },
    attendance: {
      status: {
        present: "Present",
        absent: "Absent",
        late: "Late"
      }
    },
    save: "Save",
    saving: "Saving...",
    
    // Course Management Pages
    courses: {
      title: "Course Management",
      details: "Course Details",
      addCourse: "Add Course",
      editCourse: "Edit Course",
      deleteCourse: "Delete Course",
      noCourses: "No courses found",
      loading: "Loading courses...",
      courseHierarchy: "Course Hierarchy",
      
      // Course structure
      units: "Units",
      sections: "Sections", 
      lessons: "Lessons",
      practices: "Practices",
      
      // Actions
      addUnit: "Add Unit",
      addSection: "Add Section",
      addLesson: "Add Lesson",
      addPractice: "Add Practice",
      editUnit: "Edit Unit",
      editSection: "Edit Section",
      editLesson: "Edit Lesson",
      viewLesson: "View Lesson",
      
      // Form labels
      courseName: "Course Name",
      courseDescription: "Course Description",
      unitName: "Unit Name",
      unitDescription: "Unit Description",
      sectionName: "Section Name",
      sectionDescription: "Section Description",
      lessonTitle: "Lesson Title",
      lessonDescription: "Lesson Description",
      lessonContent: "Lesson Content",
      lessonFile: "Lesson File (PDF)",
      lessonVideo: "Lesson Video",
      
      // Course details page
      courseInfo: "Course Information",
      duration: "Duration",
      instructor: "Instructor",
      students: "Students",
      progress: "Progress",
      
      // Unit management
      unitOrder: "Unit Order",
      totalSections: "Total Sections",
      totalLessons: "Total Lessons",
      
      // Section management
      sectionOrder: "Section Order",
      lessonsInSection: "Lessons in Section",
      
      // Lesson viewer
      lessonViewer: "Lesson Viewer",
      openPdfLesson: "Open PDF Lesson",
      downloadLesson: "Download Lesson",
      lessonNotAvailable: "Lesson content not available",
      openInNewTab: "Open in New Tab",
      securityNote: "Due to security restrictions, PDF lessons open in a new tab for the best viewing experience.",
      
      // Messages
      success: {
        courseCreated: "Course created successfully!",
        courseUpdated: "Course updated successfully!",
        courseDeleted: "Course deleted successfully!",
        unitCreated: "Unit created successfully!",
        unitUpdated: "Unit updated successfully!",
        unitDeleted: "Unit deleted successfully!",
        sectionCreated: "Section created successfully!",
        sectionUpdated: "Section updated successfully!",
        sectionDeleted: "Section deleted successfully!",
        lessonCreated: "Lesson created successfully!",
        lessonUpdated: "Lesson updated successfully!",
        lessonDeleted: "Lesson deleted successfully!"
      },
      
      errors: {
        fetchCourses: "Failed to fetch courses",
        fetchCourseDetails: "Failed to fetch course details",
        createCourse: "Failed to create course",
        updateCourse: "Failed to update course",
        deleteCourse: "Failed to delete course",
        createUnit: "Failed to create unit",
        updateUnit: "Failed to update unit",
        deleteUnit: "Failed to delete unit",
        createSection: "Failed to create section",
        updateSection: "Failed to update section",
        deleteSection: "Failed to delete section",
        createLesson: "Failed to create lesson",
        updateLesson: "Failed to update lesson",
        deleteLesson: "Failed to delete lesson",
        invalidFile: "Invalid file format. Please upload a PDF file.",
        fileTooLarge: "File size too large. Maximum size is 10MB.",
        required: "This field is required"
      },
      
      // Confirmations
      confirmations: {
        deleteCourse: "Are you sure you want to delete this course? This action cannot be undone.",
        deleteUnit: "Are you sure you want to delete this unit? All sections and lessons within it will be deleted.",
        deleteSection: "Are you sure you want to delete this section? All lessons within it will be deleted.",
        deleteLesson: "Are you sure you want to delete this lesson? This action cannot be undone."
      },
      
      // Empty states
      emptyStates: {
        noUnits: "No units found. Add your first unit to get started.",
        noSections: "No sections in this unit. Add a section to organize lessons.",
        noLessons: "No lessons in this section. Add lessons to provide content.",
        emptySection: "This section is empty"
      },
      
      // Placeholders
      placeholders: {
        courseName: "Enter course name",
        courseDescription: "Enter course description",
        unitName: "Enter unit name",
        unitDescription: "Enter unit description", 
        sectionName: "Enter section name",
        sectionDescription: "Enter section description",
        lessonTitle: "Enter lesson title",
        lessonDescription: "Enter lesson description",
        searchCourses: "Search courses...",
        searchLessons: "Search lessons..."
      }
    }
  }
}; 