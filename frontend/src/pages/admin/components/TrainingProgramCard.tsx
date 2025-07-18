import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Eye, Edit, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';


export interface Course {
  id: number;
  name: string;
  description?: string;
  cover_image?: string | null;
  is_active: boolean;
  order: number;
  units_count?: number;
  created_at: string;
  updated_at: string;
}

interface TrainingProgramCardProps {
  course: Course;
}

const TrainingProgramCard: React.FC<TrainingProgramCardProps> = ({ course }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full sm:w-[350px] flex flex-col hover:shadow-lg transition-shadow">
      {course.cover_image ? (
        <img 
          src={course.cover_image} 
          alt={`${course.name} cover`} 
          className="w-full h-40 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-t-lg">
          <BookOpen className="w-16 h-16 text-white" />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
          <Badge variant={course.is_active ? "default" : "secondary"} className="ml-2">
            {course.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        {course.description && (
          <CardDescription className="mt-2 text-sm line-clamp-3">
            {course.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="mt-auto space-y-4">
        {/* Course Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.units_count || 0} units</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Updated {formatDate(course.updated_at)}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/admin/courses/${course.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-2" />
              View Content
            </Button>
          </Link>
          <Link to={`/admin/courses/${course.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingProgramCard; 