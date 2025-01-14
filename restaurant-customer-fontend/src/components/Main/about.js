import React from 'react';

const About = () => {
  return (
    <section id="about" className="about section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-4">
          <div className="col-lg-6 order-1 order-lg-2">
            <img
              src="/assets/img/about.jpg"
              className="img-fluid about-img"
              alt="Về chúng tôi"
            />
          </div>
          <div className="col-lg-6 order-2 order-lg-1 content">
            <h3>Giới thiệu về nhà hàng của chúng tôi</h3>
            <p className="fst-italic">
              Chào mừng bạn đến với nhà hàng của chúng tôi, nơi mang đến trải nghiệm ẩm thực tinh tế và đẳng cấp.
            </p>
            <ul>
              <li>
                <i className="bi bi-check2-all"></i>{" "}
                <span>
                  Chúng tôi chỉ sử dụng nguyên liệu tươi sạch và đảm bảo chất lượng cao nhất.
                </span>
              </li>
              <li>
                <i className="bi bi-check2-all"></i>{" "}
                <span>
                  Đội ngũ đầu bếp chuyên nghiệp với nhiều năm kinh nghiệm trong ngành ẩm thực.
                </span>
              </li>
              <li>
                <i className="bi bi-check2-all"></i>{" "}
                <span>
                  Không gian sang trọng, ấm cúng, phù hợp cho cả các buổi gặp mặt gia đình và sự kiện quan trọng.
                </span>
              </li>
            </ul>
            <p>
              Chúng tôi luôn nỗ lực để mang đến những món ăn không chỉ ngon miệng mà còn đẹp mắt, với sự phục vụ tận tình và chuyên nghiệp nhất.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
