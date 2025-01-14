import React from 'react';

const Container = () => {
  return (
    <section id="hero" className="hero section dark-background">
    <img src="assets/img/hero-bg.jpg" alt="" data-aos="fade-in" />

    <div className="container">
      <div className="row">
        <div className="col-lg-8 d-flex flex-column align-items-center align-items-lg-start">
          <h2 data-aos="fade-up" data-aos-delay="100">
            Chào mừng đến với <span>TIẾN ĐẠT</span>
          </h2>
          <p data-aos="fade-up" data-aos-delay="200">
            Nơi cung cấp những món ăn tuyệt vời trong hơn 10 năm!
          </p>
          <div
            className="d-flex mt-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <a href="#menu" className="cta-btn">
              Menu
            </a>
            <a href="#book-a-table" className="cta-btn">
              Đặt Bàn Ngay
            </a>
          </div>
        </div>
        <div className="col-lg-4 d-flex align-items-center justify-content-center mt-5 mt-lg-0">
          <a
            href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
            className="glightbox pulsating-play-btn"
          ></a>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Container;