export type POI = {
  id: string;
  title: string;
  description: string;
  address?: string;
  coordinate: { latitude: number; longitude: number };
  rating?: number;
  averageRating?: number;
  comments?: any[];
  image?: string;
};
