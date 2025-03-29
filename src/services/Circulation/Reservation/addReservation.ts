import { createApiClient } from "../../api/apiClient";
import { Reservation } from "../../../types";

const addReservation = async (reservation: Reservation): Promise<Reservation> => {
    const apiClient = createApiClient("adminuser/reservations")

    try {
        const response = await apiClient.post("/add", reservation, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        return response.data;
    } catch (e) {
        console.error("Error recording loan:", e.response?.data || e.message);
        throw e;
    }
}

export default addReservation