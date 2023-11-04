import {v2 as cloudinary} from 'cloudinary';
import { environmentalVariables } from './EnvironmentalVariables';
          
 cloudinary.config({ 
  cloud_name: environmentalVariables.CLOUD_NAME, 
  api_key: environmentalVariables.CLOUD_API_KEY, 
  api_secret: environmentalVariables.CLOUD_API_SECRET,
  secure: true
});

export default cloudinary