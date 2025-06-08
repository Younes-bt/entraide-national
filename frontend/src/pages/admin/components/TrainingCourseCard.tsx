import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Building, UserCog, Eye, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

export interface TrainingCourse {
  id: number;
  program: {
    id: number;
    name: string;
    description?: string;
    logo?: string | null;
    duration_years: number;
  };
  center: {
    id: number;
    name: string;
    city?: string;
  };
  trainer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string | null;
  };
  academic_year: string;
  created_at: string;
  updated_at: string;
}

interface TrainingCourseCardProps {
  course: TrainingCourse;
  onViewDetails?: (course: TrainingCourse) => void;
  onEdit?: (course: TrainingCourse) => void;
  onDelete?: (course: TrainingCourse) => void;
}

const TrainingCourseCard: React.FC<TrainingCourseCardProps> = ({ 
  course, 
  onViewDetails, 
  onEdit, 
  onDelete 
}) => {
  const { t } = useTranslation();

  const getTrainerInitials = () => {
    return `${course.trainer.first_name?.charAt(0) || ''}${course.trainer.last_name?.charAt(0) || ''}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full sm:w-[380px] flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/* Program Logo/Icon */}
      <div className="relative">
        {course.program.logo ? (
          <img 
            src={course.program.logo} 
            alt={`${course.program.name} logo`} 
            className="w-full h-32 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-32 bg-muted flex items-center justify-center rounded-t-lg">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Actions Menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(course)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t('actions.viewDetails', 'View Details')}
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(course)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('actions.edit', 'Edit')}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(course)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('actions.delete', 'Delete')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight">{course.program.name}</CardTitle>
        <CardDescription className="text-sm">
          {course.program.description && course.program.description.length > 100 
            ? `${course.program.description.substring(0, 100)}...` 
            : course.program.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Center Information */}
        <div className="flex items-center space-x-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{course.center.name}</p>
            {course.center.city && (
              <p className="text-xs text-muted-foreground">{course.center.city}</p>
            )}
          </div>
        </div>

        {/* Trainer Information */}
        <div className="flex items-center space-x-2">
          <UserCog className="h-4 w-4 text-muted-foreground" />
          <Avatar className="h-6 w-6">
            <AvatarImage src={course.trainer.profile_picture || undefined} />
            <AvatarFallback className="text-xs">{getTrainerInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {course.trainer.first_name} {course.trainer.last_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">{course.trainer.email}</p>
          </div>
        </div>

        {/* Course Details */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {course.program.duration_years} {course.program.duration_years === 1 ? 'Year' : 'Years'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {course.academic_year}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('common.created', 'Created')}: {formatDate(course.created_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingCourseCard; 