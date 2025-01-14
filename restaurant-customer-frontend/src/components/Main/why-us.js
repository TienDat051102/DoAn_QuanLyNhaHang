import React from 'react';

const WhyUs = () => {
  return (
    <section id="why-us" className="why-us section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Tại sao chọn chúng tôi</h2>
        <p>Lý do bạn nên chọn nhà hàng của chúng tôi</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
            <div className="card-item">
              <span>01</span>
              <h4>
                <a href="#" className="stretched-link">
                  Nguyên liệu tươi ngon
                </a>
              </h4>
              <p>
                Chúng tôi cam kết sử dụng nguyên liệu tươi ngon nhất, được chọn lọc kỹ càng để mang lại hương vị tự nhiên và an toàn.
              </p>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div className="card-item">
              <span>02</span>
              <h4>
                <a href="#" className="stretched-link">
                  Phong cách phục vụ chuyên nghiệp
                </a>
              </h4>
              <p>
                Đội ngũ nhân viên tận tâm, chu đáo luôn sẵn sàng mang đến cho bạn trải nghiệm ẩm thực tuyệt vời.
              </p>
            </div>
          </div>

          <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
            <div className="card-item">
              <span>03</span>
              <h4>
                <a href="#" className="stretched-link">
                  Không gian ấm cúng
                </a>
              </h4>
              <p>
                Nhà hàng được thiết kế với không gian ấm cúng, phù hợp cho mọi dịp từ họp mặt gia đình đến tổ chức sự kiện.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
