import React, { useState } from 'react';
import Reservations from '../../models/reservations';
import Email from '../../models/email';
import { useInformation } from '../../context/InformationContext';

const BookTable = () => {
  const {info} = useInformation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    people: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const  bookTable = async(e) =>{
    e.preventDefault();
    const [hour] = formData.time.split(':');
    const dateTime = `${formData.date}T${hour}:00+07:00`;
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      time: dateTime,
      people: formData.people,
      note: formData.note,
    };
    try {
      const response = await Reservations.createReservations(payload);
      if(response){
        const payload2 = {
          to: 'tiendat0000155@gmail.com',
          subject: 'Có Khách Hàng Đặt Bàn Mới',
          html:`
          Thông tin đặt bàn mới:
          Tên khách hàng: ${formData.name}
          Số điện thoại: ${formData.phone}
          Email: ${formData.email}
          Số Lượng người: ${formData.people}
          Ngày giờ đặt bàn: ${dateTime}
          `,
        }
        await Email.sendEmail(payload2)
        alert('Yêu cầu đặt bàn của bạn đã được gửi. Chúng tôi sẽ gọi lại hoặc gửi email để xác nhận đặt chỗ của bạn. Cảm ơn bạn!');
      }
     else{
      const payload2 = {
        to: `${formData.email}`,
        subject: `Nhà Hàng Tiến Đạt`,
        html:`
        Xin chào bạn: ${formData.name}
        Rất xin lỗi vì sự bất tiện này. Nhà hàng chúng tôi rất tiếc phải thông báo cho bạn vào thời gian bạn đặt bàn nhà hàng chúng tôi đã không còn bàn để đáp ứng yêu cầu của bạn!
        Bạn có thể chọn vào 1 khoảng thời gian khác. Chúng tôi xin chân thành xin lỗi
        `,
      }
      await Email.sendEmail(payload2)
      alert('Yêu cầu đặt bàn của bạn đã được gửi. Chúng tôi sẽ gọi lại hoặc gửi email để xác nhận đặt chỗ của bạn. Cảm ơn bạn!');
     }
    } catch (error) {
      console.error('Lỗi khi đặt bàn:', error);
      setSuccessMessage('Có lỗi xảy ra khi đặt bàn. Xin lỗi vì sự bất tiện này!');
    }
  }
  return (
    <section id="book-a-table" className="book-a-table section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Đặt Bàn Ngay</h2>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <form onSubmit={bookTable} className="php-email-form">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Tên của bạn"
                required = "Không được để trống tên"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                required = "Bạn phải nhập đúng định dạng email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Số liên hệ"
                required = "Vui lòng để lại số liên hệ"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <input
                type="date"
                name="date"
                className="form-control"
                required = "Vui lòng nhập ngày"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <input
                type="time"
                name="time"
                className="form-control"
                required = "Vui lòng để lại thời gian"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <input
                type="number"
                name="people"
                className="form-control"
                placeholder="Số người"
                required = "Vui lòng để lại số người tham gia"
                value={formData.people}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group mt-3">
            <textarea
              className="form-control"
              name="note"
              rows="5"
              placeholder="Ghi chú"
              value={formData.note}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="text-center mt-3">
            <button type="submit">Đặt Bàn</button>
           
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookTable;
