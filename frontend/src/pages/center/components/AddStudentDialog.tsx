import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Student } from '@/pages/center/CenterStudentsPage'; // Assuming Student type is exported

interface AddStudentDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onStudentCreated: (newStudent: Student) => void;
  centerId: number | null; // ID of the current center
  // TODO: Add props for programs, courses, groups if we fetch them for dropdowns
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const initialFormData = {
  first_name: '',
  last_name: '',
  Arabic_first_name: '',
  arabic_last_name: '',
  exam_id: '',
  center_code: '', // Clarify if this is manual or derived
  // center: to be added from prop
  // program: to be added (ForeignKey)
  academic_year: '', // e.g., "2023-2024"
  joining_date: '', // Date
  // training_course: to be added (ForeignKey, optional)
  // group: to be added (ForeignKey, optional)
  program_id: '', // Placeholder for Program FK
  training_course_id: '', // Placeholder for TrainingCourse FK
  group_id: '', // Placeholder for Group FK
};

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onStudentCreated,
  centerId
}) => {
  const { t } = useTranslation();
  const { accessToken } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow dialog close animation
      setTimeout(resetForm, 300); 
    } else {
      // Reset form when dialog opens, in case it had previous data
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // TODO: Add handleChange for Select components when program/course/group are implemented

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accessToken) {
      setError(t('centerStudentsPage.addStudentDialog.errorAuthRequired', "Authentication required."));
      return;
    }
    if (!centerId) {
      setError(t('centerStudentsPage.addStudentDialog.errorCenterMissing', "Current center ID is missing. Cannot add student."));
      return;
    }
    // TODO: Validate required fields like program_id
    if (!formData.program_id) {
        setError(t('centerStudentsPage.addStudentDialog.errorProgramRequired', "Program is required."));
        return;
    }


    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const submissionData = {
      ...formData,
      center: centerId,
      program: formData.program_id, // Send program ID
      training_course: formData.training_course_id || null, // Send ID or null
      group: formData.group_id || null, // Send ID or null
    };
    
    // Remove placeholder IDs from the root of submissionData if they were just for the form state
    const { program_id, training_course_id, group_id, ...finalSubmissionData } = submissionData;


    try {
      const response = await fetch(`${API_BASE_URL}/students/students/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json', // Sending JSON data now
        },
        body: JSON.stringify(finalSubmissionData), // Serialize data to JSON
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData && typeof responseData === 'object') {
          // Construct a detailed error message from the backend response
          const errorMessages = Object.entries(responseData)
            .map(([key, value]) => {
              const fieldName = t(`centerStudentsPage.addStudentDialog.formLabels.${key}`, key); // Attempt to translate field name
              return `${fieldName}: ${(Array.isArray(value) ? value.join(', ') : String(value))}`;
            })
            .join('; ');
          throw new Error(errorMessages || t('centerStudentsPage.addStudentDialog.errorGeneric', 'Failed to add student. Please check the details.'));
        }
        throw new Error(t('centerStudentsPage.addStudentDialog.errorGeneric', 'Failed to add student. Please check the details.'));
      }
      
      setSuccessMessage(t('centerStudentsPage.addStudentDialog.successMessage', 'Student added successfully!'));
      onStudentCreated(responseData as Student); // Pass the full student object

    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!isLoading) { // Prevent closing while loading
        onOpenChange(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('centerStudentsPage.addStudentDialog.title', 'Add New Student')}</DialogTitle>
          <DialogDescription>
            {t('centerStudentsPage.addStudentDialog.description', 'Fill in the details to create a new student. Email and password will be auto-generated.')}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertTitle>{t('centerStudentsPage.addStudentDialog.errorTitle', 'Error')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && !error && (
            <Alert variant="default" className="my-4 bg-green-100 border-green-400 text-green-700">
              <AlertTitle>{t('centerStudentsPage.addStudentDialog.successTitle', 'Success')}</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
        )}

        <form onSubmit={handleSubmit} id="add-student-dialog-form" className="space-y-3 py-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dialog_stud_first_name">{t('centerStudentsPage.addStudentDialog.formLabels.first_name')} <span className="text-red-500">*</span></Label>
              <Input id="dialog_stud_first_name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dialog_stud_last_name">{t('centerStudentsPage.addStudentDialog.formLabels.last_name')} <span className="text-red-500">*</span></Label>
              <Input id="dialog_stud_last_name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dialog_stud_Arabic_first_name">{t('centerStudentsPage.addStudentDialog.formLabels.Arabic_first_name')} <span className="text-red-500">*</span></Label>
              <Input id="dialog_stud_Arabic_first_name" name="Arabic_first_name" type="text" value={formData.Arabic_first_name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dialog_stud_arabic_last_name">{t('centerStudentsPage.addStudentDialog.formLabels.arabic_last_name')} <span className="text-red-500">*</span></Label>
              <Input id="dialog_stud_arabic_last_name" name="arabic_last_name" type="text" value={formData.arabic_last_name} onChange={handleChange} required />
            </div>
          </div>
          
          <div>
            <Label htmlFor="dialog_stud_exam_id">{t('centerStudentsPage.addStudentDialog.formLabels.exam_id')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_stud_exam_id" name="exam_id" type="text" value={formData.exam_id} onChange={handleChange} required />
          </div>

          {/* Placeholder for Program Select */}
          <div>
            <Label htmlFor="dialog_stud_program_id">{t('centerStudentsPage.addStudentDialog.formLabels.program')} <span className="text-red-500">*</span></Label>
            <Input id="dialog_stud_program_id" name="program_id" type="text" placeholder={t('centerStudentsPage.addStudentDialog.placeholders.program_id')} value={formData.program_id} onChange={handleChange} required />
            {/* Replace with <Select> component later */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dialog_stud_academic_year">{t('centerStudentsPage.addStudentDialog.formLabels.academic_year')} <span className="text-red-500">*</span></Label>
              <Input id="dialog_stud_academic_year" name="academic_year" type="text" placeholder="YYYY-YYYY" value={formData.academic_year} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="dialog_stud_joining_date">{t('centerStudentsPage.addStudentDialog.formLabels.joining_date')} <span className="text-red-500">*</span></Label>
              <Input id="dialog_stud_joining_date" name="joining_date" type="date" value={formData.joining_date} onChange={handleChange} required />
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <Label htmlFor="dialog_stud_center_code">{t('centerStudentsPage.addStudentDialog.formLabels.center_code')}</Label>
            <Input id="dialog_stud_center_code" name="center_code" type="text" value={formData.center_code} onChange={handleChange} />
          </div>

          {/* Placeholder for Training Course Select */}
          <div>
            <Label htmlFor="dialog_stud_training_course_id">{t('centerStudentsPage.addStudentDialog.formLabels.training_course')}</Label>
            <Input id="dialog_stud_training_course_id" name="training_course_id" type="text" placeholder={t('centerStudentsPage.addStudentDialog.placeholders.training_course_id')} value={formData.training_course_id} onChange={handleChange} />
            {/* Replace with <Select> component later */}
          </div>

          {/* Placeholder for Group Select */}
          <div>
            <Label htmlFor="dialog_stud_group_id">{t('centerStudentsPage.addStudentDialog.formLabels.group')}</Label>
            <Input id="dialog_stud_group_id" name="group_id" type="text" placeholder={t('centerStudentsPage.addStudentDialog.placeholders.group_id')} value={formData.group_id} onChange={handleChange} />
            {/* Replace with <Select> component later */}
          </div>

        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} disabled={isLoading}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" form="add-student-dialog-form" disabled={isLoading || (!!successMessage && !error)}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (!!successMessage && !error) ? t('actions.added') : t('centerStudentsPage.addStudentDialog.submitButton', 'Add Student')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog; 