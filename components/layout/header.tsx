'use client';

import { useLocationStore } from '@/store/use-location-store';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Location } from '@/types';

export function Header() {
  const { selectedLocationId, setSelectedLocationId } = useLocationStore();
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetch('/api/locations')
      .then((res) => res.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">
        Business Account Manager
      </h1>
      <div className="flex items-center space-x-4">
        <Select
          value={selectedLocationId?.toString() || 'all'}
          onValueChange={(value) =>
            setSelectedLocationId(value === 'all' ? null : parseInt(value))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id.toString()}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}