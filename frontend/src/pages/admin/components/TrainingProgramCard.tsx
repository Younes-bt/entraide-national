import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react'; // Import the GraduationCap icon

export interface TrainingProgram {
  id: number; // Or string, depending on your API
  name: string;
  description?: string;
  logo?: string | null; // Added for the program logo
  // Add other relevant fields from your API as needed
}

interface TrainingProgramCardProps {
  program: TrainingProgram;
}

const DEFAULT_ABSTRACT_IMAGE_URL = 'https://via.placeholder.com/350x150?text=Abstract+Program'; // Replace with your desired abstract image URL

const TrainingProgramCard: React.FC<TrainingProgramCardProps> = ({ program }) => {
  console.log(program);
  return (
    <Card className="w-full sm:w-[350px] flex flex-col">
      {program.logo ? (
        <img 
          src={program.logo} 
          alt={`${program.name} logo`} 
          className="w-full h-40 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-40 bg-muted flex items-center justify-center rounded-t-lg">
          <GraduationCap className="w-16 h-16 text-muted-foreground" />
        </div>
      )}
      <CardHeader>
        <CardTitle>{program.name}</CardTitle>
        {program.description && (
          <CardDescription className="mt-1 text-sm text-muted-foreground truncate-3-lines">
            {program.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto">
        {/* Program ID display removed */}
        {/* Example: Add a button or link here */}
        {/* <Button variant="outline" size="sm" className="mt-4">View Details</Button> */}
      </CardContent>
    </Card>
  );
};

export default TrainingProgramCard; 