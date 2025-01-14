import Api from "./Axios"
class NavMenu{
    static async getNavmenu(){
        try{
            const URL ='/navmenu/listnavmenu';
            const {data} = await Api.get(URL)
            return{
                adminData: data.adminData,
                customerData: data.customerData,
            }
        }
        catch(e){
            console.error('Lỗi khi lấy danh sách:', e);
            throw e; 
        }
    }
}
export default NavMenu