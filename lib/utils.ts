import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


const CLOUD_NAME = "jeereq"
const CLOUDINARY_API_KEY = "465374689445937"
const UPLOAD_PRESET = "oumm8jyh"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const DEFAULT_ERROR_MESSAGE = "Erreur de connexion"

export const uploadChunk = async (file: any) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('cloud_name', CLOUD_NAME);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('api_key', CLOUDINARY_API_KEY);
  formData.append("folder", "kenny");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if (!response.ok) {
      console.log(response)
    } else {
      return response.json()
    }

  } catch (error) {
    console.error('Error uploading chunk:', error);
    return error
  }
};