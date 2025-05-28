export const ar = {
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
      groups: "المجموعات",
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
    
    centerStudentsPage: {
      pageTitle: "الطلاب في {{centerName}}",
      pageSubtitle: "إدارة كل الـ {{count}} طلاب في مركزك.",
      addNewStudentButton: "إضافة طالب جديد",
      loadingMessage: "جارٍ تحميل طلاب المركز...",
      errorFetching: "خطأ في جلب بيانات الطلاب لمشرف المركز:",
      errorFetchingDetail: "فشل في جلب معلومات الطلاب. يرجى التأكد من وجود مركزك وأن لديه طلاب مسجلين.",
      noStudentsTitle: "لم يتم العثور على طلاب في {{centerName}}",
      noStudentsDescription: "لا يوجد حاليًا أي طلاب مسجلين في هذا المركز. يمكنك إضافة طلاب من خلال بوابة إدارة الطلاب.",
      noStudentsFound: "لم يتم العثور على طلاب.",
      noStudentsMatchFilter: "لا يوجد طلاب يطابقون المرشحات الحالية.",
      noCenterAssigned: "لا يوجد مركز معين حاليًا لحساب المشرف هذا، أو تعذر استرداد بيانات المركز.",
      noCenterDataTitle: "بيانات المركز غير متوفرة",
      noCenterDataDescription: "تعذر تحميل بيانات المركز. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم.",
      accessDenied: "الوصول مرفوض. هذه الصفحة مخصصة لمشرفي المراكز، أو أن معرّف المستخدم الخاص بك مفقود.",
      errorAuthNotAvailable: "المستخدم غير مصادق عليه أو الرمز المميز غير متوفر.",
      searchPlaceholder: "البحث عن الطلاب بالاسم أو البريد الإلكتروني أو رقم الامتحان...",
      filterByProgram: "تصفية حسب البرنامج",
      filterByGroup: "تصفية حسب المجموعة",
      allPrograms: "جميع البرامج",
      allGroups: "جميع المجموعات",
      studentsListTitle: "قائمة الطلاب",
      noGroup: "لا توجد مجموعة",
      noCourse: "لا يوجد مقرر",
      openMenu: "فتح القائمة",
      tableHeaders: {
        student: "الطالب",
        examId: "رقم الامتحان",
        program: "البرنامج",
        group: "المجموعة",
        academicYear: "السنة الأكاديمية",
        joiningDate: "تاريخ الالتحاق",
        actions: "الإجراءات"
      },
      actions: {
        viewDetails: "عرض التفاصيل",
        edit: "تعديل",
        delete: "حذف"
      },
      dialogDescription: "معلومات مفصلة عن الطالب.",
      dialogSections: {
        studentInfo: "معلومات الطالب",
        personalInfo: "المعلومات الشخصية",
        contactInfo: "معلومات الاتصال",
        profilePicture: "الصورة الشخصية"
      },
      dialogLabels: {
        examId: "رقم الامتحان",
        program: "البرنامج",
        group: "المجموعة",
        academicYear: "السنة الأكاديمية",
        joiningDate: "تاريخ الالتحاق",
        trainingCourse: "دورة التدريب",
        centerCode: "رمز المركز",
        user: {
          email: "البريد الإلكتروني",
          username: "اسم المستخدم",
          arabicFirstName: "الاسم الأول (بالعربية)",
          arabicLastName: "الاسم الأخير (بالعربية)",
          birthDate: "تاريخ الميلاد",
          birthCity: "مكان الميلاد",
          cin: "رقم البطاقة الوطنية",
          role: "الدور",
          phoneNumber: "رقم الهاتف",
          address: "العنوان",
          city: "المدينة"
        }
      }
    },
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
      equipment: { // Added section for shared equipment keys in tables (Arabic)
        name: "الاسم",
        quantityShort: "كمية",
        condition: "الحالة"
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
        selectType: "اختر نوع القاعة "
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
      auditorium: "قاعة الاعلاميات",
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
        equipmentQuantity: "الكمية",
        equipmentName: "الاسم" // Added for table header
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
    },
    centerGroupsPage: {
      pageTitle: "المجموعات في {{centerName}}",
      pageSubtitle: "إدارة كل الـ {{count}} مجموعات في مركزك.",
      addNewGroupButton: "إضافة مجموعة جديدة",
      loadingMessage: "جارٍ تحميل مجموعات المركز...",
      errorFetching: "خطأ في جلب بيانات المجموعات لمشرف المركز:",
      errorFetchingDetail: "فشل في جلب معلومات المجموعات. يرجى التأكد من وجود مركزك وأن لديه مجموعات مدرجة.",
      noGroupsTitle: "لم يتم العثور على مجموعات في {{centerName}}",
      noGroupsDescription: "لا توجد حاليًا أي مجموعات مدرجة لهذا المركز. يمكنك إضافة مجموعات من خلال بوابة إدارة المجموعات.",
      fields: {
        description: "الوصف",
        createdAt: "تاريخ الإنشاء",
        updatedAt: "آخر تحديث"
      },
      actions: {
        viewDetails: "عرض التفاصيل",
        edit: "تعديل",
        delete: "حذف"
      }
    },
    centerAddGroupPage: {
      title: "إضافة مجموعة جديدة",
      description: "املأ التفاصيل أدناه لإضافة مجموعة جديدة إلى مركزك.",
      backToGroupsList: "العودة إلى قائمة المجموعات",
      loadingCenterInfo: "جارٍ تحميل معلومات المركز...",
      errorNoCenterSupervised: "لا يوجد مركز يشرف عليه هذا الحساب. لا يمكن إضافة مجموعة.",
      errorFetchingCenterId: "فشل في جلب معرّف مركز الإشراف. يرجى المحاولة مرة أخرى.",
      errorCenterIdNotSet: "معرّف مركز الإشراف غير معين. لا يمكن إرسال النموذج.",
      errorCreatingGroup: "حدث خطأ أثناء إنشاء المجموعة. يرجى التحقق من مدخلاتك والمحاولة مرة أخرى.",
      errorCritical: "خطأ جسيم",
      accessDenied: "الوصول مرفوض. هذه الصفحة مخصصة لمشرفي المراكز، أو أن معرّف المستخدم الخاص بك مفقود.",
      labels: {
        name: "اسم المجموعة",
        description: "الوصف"
      },
      placeholders: {
        name: "أدخل اسم المجموعة",
        description: "أدخل وصف المجموعة"
      },
      buttons: {
        createGroup: "إنشاء المجموعة",
        creating: "جاري الإنشاء..."
      },
      validation: {
        nameRequired: "اسم المجموعة مطلوب.",
        descriptionRequired: "الوصف مطلوب.",
        centerIdMissing: "معرّف المركز مفقود. هذا خطأ داخلي."
      }
    },
    centerAddNewStudent: {
      errors: {
        authError: "خطأ في المصادقة. يرجى التأكد من تسجيل الدخول وأن لديك رمزًا صالحًا.",
        fetchCenterError: "فشل في جلب المركز الذي تشرف عليه. يرجى المحاولة مرة أخرى.",
        noCenterAssigned: "أنت غير معين حاليًا كمشرف على أي مركز، أو تعذر استرداد بيانات المركز.",
        fetchProgramsError: "فشل في جلب برامج التدريب. يرجى المحاولة مرة أخرى.",
        fetchGroupsError: "فشل في جلب المجموعات لمركزك. يرجى المحاولة مرة أخرى.",
        fetchCoursesError: "فشل في جلب دورات التدريب للبرنامج والمركز المختارين. يرجى المحاولة مرة أخرى.",
        centerNotLoaded: "لم يتم تحميل معلومات المركز بعد. يرجى الانتظار أو التحديث.",
        submitError: "فشل في إنشاء الطالب. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
        submitErrorUnknown: "حدث خطأ غير معروف أثناء إرسال النموذج."
      },
      successMessage: "تم إنشاء الطالب بنجاح!",
      authPrompt: "يرجى تسجيل الدخول لإضافة طالب جديد.",
      title: "إضافة طالب جديد",
      centerInfo: "إضافة طالب إلى المركز: {{centerName}}",
      labels: {
        firstName: "(يالفرنسية) الاسم الأول",
        lastName: "(يالفرنسية) الاسم الأخير",
        arabicFirstName: "الاسم الأول (بالعربية)",
        arabicLastName: "الاسم الأخير (بالعربية)",
        examId: "رقم الامتحان",
        academicYear: "السنة الأكاديمية",
        joiningDate: "تاريخ الالتحاق",
        centerCode: "رمز المركز (اختياري)",
        program: "برنامج التدريب",
        trainingCourse: "دورة التدريب (اختياري)",
        group: "المجموعة (اختياري)",
        cinId: "رقم البطاقة الوطنية",
        phoneNumber: "رقم الهاتف",
        birthDate: "تاريخ الميلاد",
        birthCity: "مكان الميلاد",
        address: "العنوان",
        city: "المدينة"
      },
      placeholders: {
        optional: "اختياري",
        selectProgram: "اختر برنامج تدريب",
        selectCourse: "اختر دورة تدريبية",
        selectGroup: "اختر مجموعة",
        academicYear: "مثال: 2023-2024",
        cinId: "مثال: AB123456",
        phoneNumber: "مثال: 0600000000",
        birthCity: "مثال: الرباط",
        address: "مثال: 123 الشارع الرئيسي، شقة 4ب",
        city: "مثال: الدار البيضاء"
      },
      courseNameUnavailable: "اسم الدورة غير متوفر",
      noCoursesForProgram: "لا توجد دورات تدريبية متاحة للبرنامج المختار، أو حدث خطأ.",
      buttons: {
        cancel: "إلغاء",
        submitting: "جارٍ الإرسال...",
        submit: "إنشاء الطالب"
      }
    },
    centerUpdateStudent: { // قسم جديد لصفحة تحديث الطالب
      title: "تحديث معلومات الطالب",
      editingFor: "تعديل الطالب: {{studentEmail}} (رقم الامتحان: {{examId}})",
      loadingStudent: "جارٍ تحميل تفاصيل الطالب...",
      errors: {
        missingInfo: "معرّف الطالب أو رمز المصادقة مفقود. لا يمكن تحميل التفاصيل.",
        fetchStudentError: "فشل في جلب تفاصيل الطالب. يرجى المحاولة مرة أخرى.",
        missingInfoSubmit: "معرّف الطالب أو معلومات المركز مفقودة. لا يمكن إرسال التحديث.",
        submitError: "فشل في تحديث الطالب. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
        submitErrorUnknown: "حدث خطأ غير معروف أثناء حفظ التغييرات."
      },
      successMessage: "تم تحديث الطالب بنجاح!",
      buttons: {
        saving: "جارٍ الحفظ...",
        saveChanges: "حفظ التغييرات"
      },
      displayOnly: {
        examIdLabel: "رقم الامتحان (مولّد تلقائيًا)",
        centerCodeLabel: "رمز المركز (مولّد تلقائيًا)"
      }
    },
    centerStudentDetailsPage: { // قسم جديد لصفحة تفاصيل الطالب
      title: "تفاصيل الطالب",
      description: "عرض التفاصيل للطالب: {{email}} (رقم الامتحان: {{examId}})",
      loading: "جارٍ تحميل تفاصيل الطالب...",
      noData: "بيانات الطالب غير موجودة أو تعذر تحميلها.",
      errors: {
        missingInfo: "معرّف الطالب أو رمز المصادقة مفقود. لا يمكن تحميل التفاصيل.",
        fetchStudentError: "فشل في جلب تفاصيل الطالب. يرجى المحاولة مرة أخرى.",
        fetchStudentErrorUnknown: "حدث خطأ غير معروف أثناء جلب تفاصيل الطالب."
      }
    },
    centerTrainersPage: {
      pageTitle: "المدربين في {{centerName}}",
      pageSubtitle: "إدارة كل الـ {{count}} مدربين في مركزك.",
      addNewTrainerButton: "إضافة مدرب جديد",
      loadingMessage: "جارٍ تحميل مدربي المركز...",
      errorFetching: "خطأ في جلب بيانات المدربين لمشرف المركز:",
      errorFetchingDetail: "فشل في جلب معلومات المدربين. يرجى التأكد من وجود مركزك وأن لديه مدربين مسجلين.",
      noTrainersTitle: "لم يتم العثور على مدربين في {{centerName}}",
      noTrainersDescription: "لا يوجد حاليًا أي مدربين مسجلين في هذا المركز. يمكنك إضافة مدربين من خلال بوابة إدارة المدربين.",
      noTrainersFound: "لم يتم العثور على مدربين.",
      noTrainersMatchFilter: "لا يوجد مدربين يطابقون المرشحات الحالية.",
      noCenterAssigned: "لا يوجد مركز معين حاليًا لحساب المشرف هذا، أو تعذر استرداد بيانات المركز.",
      noCenterDataTitle: "بيانات المركز غير متوفرة",
      noCenterDataDescription: "تعذر تحميل بيانات المركز. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم.",
      accessDenied: "الوصول مرفوض. هذه الصفحة مخصصة لمشرفي المراكز، أو أن معرّف المستخدم الخاص بك مفقود.",
      errorAuthNotAvailable: "المستخدم غير مصادق عليه أو الرمز المميز غير متوفر.",
      searchPlaceholder: "البحث عن المدربين بالاسم أو البريد الإلكتروني أو التخصص...",
      filterBySpecialization: "تصفية حسب التخصص",
      filterByProgram: "تصفية حسب البرنامج",
      allSpecializations: "جميع التخصصات",
      allPrograms: "جميع البرامج",
      trainersListTitle: "قائمة المدربين",
      noSpecialization: "لا يوجد تخصص",
      openMenu: "فتح القائمة",
      tableHeaders: {
        trainer: "المدرب",
        specialization: "التخصص",
        program: "البرنامج",
        employmentStatus: "حالة التوظيف",
        experience: "سنوات الخبرة",
        actions: "الإجراءات",
        contractWith: "العقد مع",
        contractStart: "بداية العقد",
        contractEnd: "ينتهي العقد"
      },
      actions: {
        viewDetails: "عرض التفاصيل",
        edit: "تعديل",
        delete: "حذف",
        deactivate: "إلغاء التفعيل",
        confirmDeactivate: "هل أنت متأكد أنك تريد إلغاء تفعيل هذا المدرب؟ لن يتمكن من الوصول إلى النظام بعد الآن."
      },
      unknownProgram: "برنامج غير معروف",
      errorTitleCritical: "خطأ جسيم",
      checkAssignment: "يرجى التحقق من تعيين المركز الخاص بك أو الاتصال بالإدارة.",
      errorFetchingTrainersTitle: "خطأ في جلب المدربين",
      errorFetchingTrainersForCenter: "فشل في جلب المدربين للمركز {{centerName}}",
      contractEnds: "ينتهي العقد",
      dialogDescription: "معلومات مفصلة عن المدرب.",
      dialogSections: {
        trainerInfo: "معلومات المدرب",
        personalInfo: "المعلومات الشخصية",
        contactInfo: "معلومات الاتصال",
        profilePicture: "الصورة الشخصية"
      },
      dialogLabels: {
        specialization: "التخصص",
        program: "البرنامج",
        employmentStatus: "حالة التوظيف",
        experience: "سنوات الخبرة",
        centerCode: "رمز المركز",
        user: {
          email: "البريد الإلكتروني",
          username: "اسم المستخدم",
          arabicFirstName: "الاسم الأول (بالعربية)",
          arabicLastName: "الاسم الأخير (بالعربية)",
          birthDate: "تاريخ الميلاد",
          birthCity: "مكان الميلاد",
          cin: "رقم البطاقة الوطنية",
          role: "الدور",
          phoneNumber: "رقم الهاتف",
          address: "العنوان",
          city: "المدينة"
        }
      }
    },
    centerAddNewTrainer: {
      errors: {
        authError: "خطأ في المصادقة. يرجى التأكد من تسجيل الدخول وأن لديك رمزًا صالحًا.",
        fetchCenterError: "فشل في جلب المركز الذي تشرف عليه. يرجى المحاولة مرة أخرى.",
        noCenterAssigned: "أنت غير معين حاليًا كمشرف على أي مركز، أو تعذر استرداد بيانات المركز.",
        fetchProgramsError: "فشل في جلب برامج التدريب. يرجى المحاولة مرة أخرى.",
        centerNotLoaded: "لم يتم تحميل معلومات المركز بعد. يرجى الانتظار أو التحديث.",
        submitError: "فشل في إنشاء المدرب. يرجى التحقق من التفاصيل والمحاولة مرة أخرى.",
        submitErrorUnknown: "حدث خطأ غير معروف أثناء إرسال النموذج."
      },
      successMessage: "تم إنشاء المدرب بنجاح!",
      authPrompt: "يرجى تسجيل الدخول لإضافة مدرب جديد.",
      title: "إضافة مدرب جديد",
      centerInfo: "إضافة مدرب إلى المركز: {{centerName}}",
      labels: {
        firstName: "(بالفرنسية) الاسم الأول",
        lastName: "(بالفرنسية) الاسم الأخير",
        arabicFirstName: "الاسم الأول (بالعربية)",
        arabicLastName: "الاسم الأخير (بالعربية)",
        program: "برنامج التدريب",
        contractWith: "العقد مع",
        contractStartDate: "تاريخ بداية العقد",
        contractEndDate: "تاريخ نهاية العقد",
        cinId: "رقم البطاقة الوطنية (اختياري)",
        phoneNumber: "رقم الهاتف (اختياري)",
        birthDate: "تاريخ الميلاد (اختياري)",
        birthCity: "مكان الميلاد (اختياري)",
        address: "العنوان (اختياري)",
        city: "المدينة (اختياري)"
      },
      placeholders: {
        selectProgram: "اختر برنامج تدريب",
        selectContractWith: "اختر نوع العقد",
        cinId: "مثال: AB123456",
        phoneNumber: "مثال: 0600000000",
        birthCity: "مثال: الرباط",
        address: "مثال: 123 الشارع الرئيسي، شقة 4ب",
        city: "مثال: الدار البيضاء"
      },
      contractChoices: {
        entraide: "التعاون الوطني",
        association: "الجمعية"
      },
      buttons: {
        cancel: "إلغاء",
        submitting: "جارٍ الإرسال...",
        submit: "إنشاء المدرب"
      }
    }
  }
}; 