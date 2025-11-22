import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});
const fetchData = async (url, method = "GET", data = null,userId) => {
  try {
    const response = await api.request({
      url,
      method,
      data,
      headers:{
        user_id:userId
      }
    });
    return response.data;
  } catch (error) {
    console.error(error.response?.data?.message || error.message);
  }
};

export default fetchData;
