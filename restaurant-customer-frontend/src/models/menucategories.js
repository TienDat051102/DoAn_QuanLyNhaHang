import Api from './Axios';

class MenuCategories{
    static async getmenucateandmenuitems(id){
        try{
            const URL = '/menucategories/listmenucategories';
            const {data} = await Api.get(URL, {id: id})
            return data.data;
        }
        catch(e){
            console.error('Lỗi khi lấy danh sách:', e);
            throw e; 
        }
    }
}

export default MenuCategories;