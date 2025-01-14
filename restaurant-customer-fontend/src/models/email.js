import Api from "./Axios";

class Email{
    static async sendEmail(payload){
        try{
            const URL = '/email/sendemail';
            const response = await Api.post(URL, payload);
            return response;
        }
        catch(e){
            console.error('Lỗi gửi mail');
            throw e; 
        }
    }
}

export default Email