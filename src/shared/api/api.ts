import type { ApartmentElement } from '../../entities/apartment/model/types';

export const fetchApartments = async (): Promise<ApartmentElement[]> => {
  const response = await fetch('/cadastrCurrent.json');
  if (!response.ok) {
    throw new Error('Failed to load cadastral registry data.');
  }
  return response.json();
};
