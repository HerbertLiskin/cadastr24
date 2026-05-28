export interface Right {
  rightType?: string;
  rightRegDate?: number;
  rightNumber?: string;
  part?: string | null;
  ownershipType?: string | null;
  rightTypeDesc?: string;
  sharedOwnershipType?: boolean;
}

export interface Encumbrance {
  startDate?: number;
  encumbranceNumber?: string;
  encumbranceDate?: number | null;
  type?: string;
  typeDesc?: string;
  rightNum?: string | null;
}

export interface Address {
  region?: string;
  district?: string | null;
  city?: string | null;
  street?: string;
  streetType?: string;
  house?: string;
  houseType?: string;
  structure?: string;
  structureType?: string;
  apartment?: string;
  apartmentType?: string;
  readableAddress?: string;
}

export interface MainCharacter {
  code?: string;
  description?: string;
  value?: number;
  unitCode?: string;
  unitDescription?: string;
}

export interface ApartmentElement {
  id?: string | null;
  objectId?: string | null;
  databaseName?: string | null;
  regionKey?: string | null;
  cadNumber?: string;
  cadQuarter?: string;
  status?: string;
  objType?: string;
  area?: string;
  address?: Address;
  regDate?: number;
  cancelDate?: number | null;
  rights?: Right[];
  encumbrances?: Encumbrance[];
  oldNumbers?: Array<{ numType: string; numValue: string }>;
  cadCost?: string;
  levelFloor?: string;
  mainCharacters?: MainCharacter[];
}
