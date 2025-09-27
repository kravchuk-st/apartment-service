import { Types } from 'mongoose';

export const isMongoDbId = (value: string) => {
  return Types.ObjectId.isValid(value);
};

export const isMongoDbInteger = (value: number) => {
  return (
    typeof value === 'number' &&
    !isNaN(value) &&
    isFinite(value) &&
    value > 0 &&
    Number.isInteger(value)
  );
};

export const isMongoDbNumber = (value: number) => {
  return (
    typeof value === 'number' && !isNaN(value) && isFinite(value) && value > 0
  );
};
