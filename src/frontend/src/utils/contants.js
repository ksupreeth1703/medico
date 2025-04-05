// const API_URL = "http://23319330-book-doctor-lb-1389235972.eu-central-1.elb.amazonaws.com";
const API_URL = "http://localhost:8080";
const API_VERSION = "/api/v1";
const API_BASE_URL = `${API_URL}${API_VERSION}`;
const API_MASTER_DATA_URL = `${API_BASE_URL}/master`;
const API_REGISTER_URL = `${API_BASE_URL}/auth/register`;
const API_LOGIN_URL = `${API_BASE_URL}/auth/login`;
const API_DOCTORS_URL = `${API_BASE_URL}/doctor`;
const API_BOOKING_URL = `${API_BASE_URL}/booking`;
const APP_NAME = 'Medico'

export {
  API_URL,
  API_VERSION,
  API_LOGIN_URL,
  API_BASE_URL,
  API_MASTER_DATA_URL,
  API_REGISTER_URL,
  API_DOCTORS_URL,
  API_BOOKING_URL,
  APP_NAME
};
