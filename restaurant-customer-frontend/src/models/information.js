import Api from './Axios';

class Information{
    static async getinformation(id){
        try{
            const URL = '/information/listinformation';
            const {data} = await Api.get(URL, {id: id})
            return data.data;
        }
        catch(e){
            console.error('Lỗi khi lấy danh sách:', e);
            throw e; 
        }
    }
}

export default Information;