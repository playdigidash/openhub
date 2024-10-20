import axios from 'axios';

const API_URL = 'https://api.meshy.ai/v1/image-to-3d';

// Create 3D task with an image URL
export const create3DTask = async (imageUrl) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        image_url: imageUrl,
        enable_pbr: true,
        surface_mode: 'hard',
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_MESHY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    // Log the whole response for debugging purposes if needed
    console.log('3D Task created:', response.data);

    return response.data.result;
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error creating 3D task:', error.response.data);
      throw new Error(`Server Error: ${error.response.data.message}`);
    } else if (error.request) {
      // Request was made, but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened setting up the request
      console.error('Error setting up the request:', error.message);
      throw new Error('Error setting up the request.');
    }
  }
};

// Retrieve the status of an existing 3D task
export const get3DTask = async (taskId) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_MESHY_API_KEY}`,
      },
    });

    // Log the response for debugging if needed
    console.log('3D Task retrieved:', response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error retrieving 3D task:', error.response.data);
      throw new Error(`Server Error: ${error.response.data.message}`);
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server when checking task status.');
    } else {
      console.error('Error setting up the request:', error.message);
      throw new Error('Error checking task status.');
    }
  }
};
