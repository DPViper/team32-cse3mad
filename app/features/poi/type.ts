export type POI = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
  rating?: number;
  averageRating?: number;
  image?: string;
};
