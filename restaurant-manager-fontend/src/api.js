// axios.js
import axios from 'axios';
import { showLoading, hideLoading } from './loading'; // Import các hàm showLoading và hideLoading

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  showLoading();
  return config;
}, (error) => {
  hideLoading();
  return Promise.reject(error);
});

api.interceptors.response.use( async (response) => {
  hideLoading(); 
//   setTimeout(() => {
//     hideLoading();
// }, 2000);
return response;
}, (error) => {
  hideLoading();
  //   setTimeout(() => {
//     hideLoading();
// }, 2000);
if (error.response && error.response.status === 401) {
  alert('Token của bạn đã quá hạn')
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = '/'; 
}
else{
  alert('Server đang từ chối')
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = '/'; 
}
  return Promise.reject(error);
});
async function checkAndUpdateIngredients() {
  try {
    const response = await api.get('/ingredients/checkAndUpdateIngredients'); 
    console.log('Kiểm tra và update nguyên liệu và menu thành công');
  } catch (error) {
    console.error('Lỗi khi update nguyên liệu:', error);
  }
}

export default api;
