import axios from 'axios';

const API_BASE_URL = 'https://api.meshy.ai/v1';
const API_KEY = 'msy_pdyMaQiqfm2f8jKXtWUTCZvke6fleai0CC7h';

const headers = { 
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

export const createImageTo3DTask = async (imageUrl) => {
  const payload = {
    image_url: imageUrl,
    enable_pbr: true,
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/image-to-3d`,
      payload,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getImageTo3DTask = async (taskId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/image-to-3d/${taskId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting task:', error.response ? error.response.data : error.message);
    throw error;
  }
};