import axios from 'axios';

const BASE_URL = "http://localhost:8080/sru/loc"; // Adjust based on your backend setup

const searchLibraryOfCongress = async (query: string, token: string) => {
    const response = await axios.get(`${BASE_URL}/search`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export default searchLibraryOfCongress;
