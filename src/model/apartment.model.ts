import { PROPERTY } from './property.model';

export interface ApartmentType {
  id: string;
  title: string;
  password: string;
  firstName: string;
  lastName: string;
  propertyType: PROPERTY;
  createAt: string;
  updateAt: string;
}
