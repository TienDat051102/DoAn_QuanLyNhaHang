import Api from "./Axios";
class Reservations {
    static async createReservations(payload){
        try{
            const URL = '/reservations/createreservations';
            const response = await Api.post(URL, payload);
            return response.data.data;
        }
        catch(e){
            console.error('Lỗi khi tạo đặt bàn:', e.response ? e.response.data : e.message);
            throw e; 
        }
    }
}


export default Reservations