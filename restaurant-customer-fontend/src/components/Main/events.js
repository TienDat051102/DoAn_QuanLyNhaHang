import React from 'react';

const Events = () => {
  return (
    <section id="events" className="events section">
        <img
          className="slider-bg"
          src="assets/img/events-bg.jpg"
          alt=""
          data-aos="fade-in"
        />

        <div className="container">
          <div
            className="swiper init-swiper"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <script type="application/json" className="swiper-config">
              {JSON.stringify({
                loop: true,
                speed: 600,
                autoplay: {
                  delay: 5000,
                },
                slidesPerView: "auto",
                pagination: {
                  el: ".swiper-pagination",
                  type: "bullets",
                  clickable: true,
                },
              })}
            </script>
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div className="row gy-4 event-item">
                  <div className="col-lg-6">
                    <img
                      src="assets/img/events-slider/events-slider-1.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="col-lg-6 pt-4 pt-lg-0 content">
                    <h3>Tiệc Sinh Nhật</h3>
                    <div className="price">
                      <p>
                        <span>4.500.000 VNĐ</span>
                      </p>
                    </div>
                    <p className="fst-italic">
                      Tận hưởng buổi tiệc sinh nhật đáng nhớ với không gian sang trọng và ẩm thực đặc sắc.
                    </p>
                    <ul>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Không gian thoải mái, phù hợp cho mọi lứa tuổi.
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Thực đơn đa dạng và hấp dẫn, phù hợp với yêu cầu riêng.
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Dịch vụ chuyên nghiệp và tận tâm.
                        </span>
                      </li>
                    </ul>
                    <p>
                      Hãy để chúng tôi biến ngày đặc biệt của bạn trở nên thật ý nghĩa và đáng nhớ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="row gy-4 event-item">
                  <div className="col-lg-6">
                    <img
                      src="assets/img/events-slider/events-slider-2.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="col-lg-6 pt-4 pt-lg-0 content">
                    <h3>Tiệc Riêng Tư</h3>
                    <div className="price">
                      <p>
                        <span>7.000.000 VNĐ</span>
                      </p>
                    </div>
                    <p className="fst-italic">
                      Dành riêng không gian riêng tư cho bạn và những người thân yêu.
                    </p>
                    <ul>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Không gian ấm cúng, đầy đủ tiện nghi.
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Thực đơn phong phú, chất lượng hàng đầu.
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Phù hợp cho các buổi họp mặt gia đình hoặc sự kiện nhỏ.
                        </span>
                      </li>
                    </ul>
                    <p>
                      Chúng tôi sẽ giúp bạn tạo nên những khoảnh khắc khó quên.
                    </p>
                  </div>
                </div>
              </div>

              <div className="swiper-slide">
                <div className="row gy-4 event-item">
                  <div className="col-lg-6">
                    <img
                      src="assets/img/events-slider/events-slider-3.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="col-lg-6 pt-4 pt-lg-0 content">
                    <h3>Tiệc Theo Yêu Cầu</h3>
                    <div className="price">
                      <p>
                        <span>2.300.000 VNĐ</span>
                      </p>
                    </div>
                    <p className="fst-italic">
                      Dịch vụ tổ chức tiệc linh hoạt, tùy chỉnh theo ý muốn của bạn.
                    </p>
                    <ul>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Tạo nên sự kiện độc đáo và ấn tượng.
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Đội ngũ nhân viên tận tâm, chuyên nghiệp.
                        </span>
                      </li>
                      <li>
                        <i className="bi bi-check2-circle"></i>{" "}
                        <span>
                          Sẵn sàng phục vụ mọi nhu cầu đặc biệt.
                        </span>
                      </li>
                    </ul>
                    <p>
                      Liên hệ ngay để chúng tôi tư vấn và hỗ trợ bạn.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>
  );
};

export default Events;
