import { useState, useEffect, useMemo } from 'react';
import type { ApartmentElement } from './types';
import { fetchApartments } from '../../../shared/api/api';

export const useApartments = () => {
  const [apartments, setApartments] = useState<ApartmentElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchApartments()
      .then((data) => {
        if (isMounted) {
          setApartments(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error fetching data');
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    let totalValid = 0;
    let totalArea = 0;
    let totalOwners = 0;
    let totalCost = 0;

    apartments.forEach((elem, index) => {
      // Index 40 is apartment 41 (which is empty in the raw data)
      if (index === 40 || !elem.cadNumber) return;

      totalValid++;
      
      const parsedArea = parseFloat(elem.area || '0');
      totalArea += parsedArea;

      const rightsCount = elem.rights?.length || 0;
      totalOwners += rightsCount;

      const parsedCost = parseFloat(elem.cadCost || '0');
      totalCost += parsedCost;
    });

    const averageArea = totalValid > 0 ? totalArea / totalValid : 0;
    const averageCost = totalValid > 0 ? totalCost / totalValid : 0;

    // Add commercial area of Flat 41 (KB store = 74.8 sq.m)
    totalArea += 74.8;

    return {
      totalSlots: apartments.length,
      totalValid,
      totalArea: parseFloat(totalArea.toFixed(2)),
      averageArea: parseFloat(averageArea.toFixed(2)),
      totalOwners,
      totalCost: parseFloat(totalCost.toFixed(2)),
      averageCost: parseFloat(averageCost.toFixed(2)),
    };
  }, [apartments]);

  return {
    apartments,
    isLoading,
    error,
    metrics,
  };
};
