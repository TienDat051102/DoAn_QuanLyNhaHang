import React, { useEffect, useState } from 'react';
import { useInformation} from "../../context/InformationContext";

const Contact = () => {
  const {info, loading, error} = useInformation();
  console.log('infotest',info)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <section id="contact" className="contact section">
    <div className="container section-title" data-aos="fade-up">
      <h2>Contact</h2>
      <p>Contact Us</p>
    </div>
    <div className="mb-5" data-aos="fade-up" data-aos-delay="200">
      <iframe
        style={{ border: 0, width: "100%", height: "400px" }}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.239039589745!2d105.81554933294494!3d21.010450711817946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac9d60ea8f67%3A0x6d5e66e3bb3f40da!2zMTA0IFAuWcOqbiBMw6NuZw!5e0!3m2!1svi!2s!4v1729671215471!5m2!1svi!2s"
        frameBorder="0"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <div className="container" data-aos="fade-up" data-aos-delay="100">
      <div className="row gy-4">
        <div className="col-lg-4">
          <div
            className="info-item d-flex"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <i className="bi bi-geo-alt flex-shrink-0"></i>
            <div>
              <h3>Địa Chỉ</h3>
              <p>{info?.location}</p>
            </div>
          </div>
          <div
            className="info-item d-flex"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <i className="bi bi-telephone flex-shrink-0"></i>
            <div>
              <h3>Giờ Mở Cửa</h3>
              <p dangerouslySetInnerHTML={{ __html: info?.openhours }}>
              </p>
            </div>
          </div>
          <div
            className="info-item d-flex"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <i className="bi bi-telephone flex-shrink-0"></i>
            <div>
              <h3>Liên Hệ</h3>
              <p>{info?.sdt}</p>
            </div>
          </div>
          <div
            className="info-item d-flex"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <i className="bi bi-envelope flex-shrink-0"></i>
            <div>
              <h3>Email Của Chúng Tôi</h3>
              <p>{info?.email}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <form
            action="forms/contact.php"
            method="post"
            className="php-email-form"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="row gy-4">
              <div className="col-md-6">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="col-md-12">
                <input
                  type="text"
                  className="form-control"
                  name="subject"
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="col-md-12">
                <textarea
                  className="form-control"
                  name="message"
                  rows="6"
                  placeholder="Message"
                  required
                ></textarea>
              </div>
              <div className="col-md-12 text-center">
                <div className="loading">Loading</div>
                <div className="error-message"></div>
                <div className="sent-message">
                Tin nhắn của bạn đã được gửi. Cảm ơn!
                </div>
                <button type="submit">Gửi tin nhắn</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Contact;
