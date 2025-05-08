import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Updated import path
import { Button } from '@/components/ui/button'; // Updated import path
import { Edit3, Trash2 } from 'lucide-react'; // Example icons, adjust if needed
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Assuming you have an API service or use fetch/axios directly
// import { apiService } from '../../lib/apiService'; // Example

interface Association {
  id: number;
  logo?: string; // Assuming logo is a URL
  name: string;
  city?: string;
  supervisor?: {
    id: number; // Assuming supervisor object has an id
    first_name: string;
    last_name: string;
    // Add other relevant User fields if needed for display or linking
  }; // Assuming supervisor is an object with name fields
  phone_number?: string;
  // Add other fields from your Association model as needed
  // e.g. email, address, website, is_active, is_verified etc.
}

const AdminAssociationsPage: React.FC = () => {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth(); // Use accessToken directly from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAssociations = async () => {
      if (!accessToken) { // Check if accessToken is available
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/associations/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Use accessToken
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Try to parse error if it's JSON, otherwise use status text
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            // Not JSON, or empty response
          }
          const errorMessage = errorData?.detail || response.statusText || `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("API Response Data for Associations:", data); // Log the data
        setAssociations(data.results || Array.isArray(data) ? data : []); // Ensure we always set an array
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch associations');
        console.error("Failed to fetch associations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociations();
  }, [accessToken]); // Add accessToken to dependency array

  const handleEdit = (id: number) => {
    console.log("Edit association with id:", id);
    // Navigate to edit page or open modal
  };

  const handleDelete = (id: number) => {
    console.log("Delete association with id:", id);
    // Implement delete logic, possibly with confirmation
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading associations...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 border border-red-500 rounded-md">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Associations Management</h1>
        <Button onClick={() => navigate('/admin/associations/add')} > 
          Add Association
        </Button>
      </div>
      
      {associations.length === 0 && !loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No associations found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {associations.map((assoc) => (
              <TableRow key={assoc.id}>
                <TableCell>
                  {assoc.logo ? (
                    <img 
                      src={assoc.logo} 
                      alt={assoc.name} 
                      className="w-10 h-10 object-cover rounded-full" // Adjusted styling
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
                      N/A
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{assoc.name}</TableCell>
                <TableCell>{assoc.city || 'N/A'}</TableCell>
                <TableCell>
                  {assoc.supervisor
                    ? `${assoc.supervisor.first_name} ${assoc.supervisor.last_name}`
                    : 'N/A'}
                </TableCell>
                <TableCell>{assoc.phone_number || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(assoc.id)} className="mr-2">
                    <Edit3 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(assoc.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminAssociationsPage; 