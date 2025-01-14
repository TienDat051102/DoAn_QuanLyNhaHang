import React from 'react';

const specialsData = [
  {
    id: 1,
    title: "Món ăn đặc biệt",
    description: [
      "Khám phá sự tinh tế trong từng món ăn",
      "Tận hưởng hương vị độc đáo, được chế biến từ các nguyên liệu tươi ngon nhất.",
      "Chúng tôi tự hào mang đến cho bạn những món ăn không chỉ ngon miệng mà còn đẹp mắt. Từng món ăn là sự kết hợp hoàn hảo giữa phong cách hiện đại và truyền thống."
    ],
    image: "/assets/img/specials-1.png"
  },
  {
    id: 2,
    title: "Thực phẩm tươi ngon",
    description: [
      "Thực phẩm tươi ngon, chất lượng cao",
      "Chỉ sử dụng nguyên liệu được chọn lọc cẩn thận, đảm bảo tươi ngon và an toàn.",
      "Từ rau củ đến thịt cá, mọi thứ đều được chuẩn bị kỹ lưỡng để mang lại trải nghiệm ẩm thực tốt nhất."
    ],
    image: "/assets/img/specials-2.png"
  },
  {
    id: 3,
    title: "Hương vị độc đáo",
    description: [
      "Hương vị độc đáo chỉ có tại nhà hàng chúng tôi",
      "Bí quyết chế biến riêng tạo nên sự khác biệt trong từng món ăn.",
      "Chúng tôi luôn tìm tòi và sáng tạo để đem đến cho thực khách những hương vị khó quên."
    ],
    image: "/assets/img/specials-3.png"
  },
  {
    id: 4,
    title: "Phong cách chế biến riêng",
    description: [
      "Phong cách chế biến riêng biệt",
      "Sự kết hợp hài hòa giữa nghệ thuật và ẩm thực.",
      "Đội ngũ đầu bếp của chúng tôi không ngừng sáng tạo, mang đến cho bạn những món ăn không chỉ ngon mà còn đẹp mắt."
    ],
    image: "/assets/img/specials-4.png"
  },
  {
    id: 5,
    title: "Thực đơn theo mùa",
    description: [
      "Thực đơn theo mùa",
      "Mỗi mùa, một câu chuyện ẩm thực.",
      "Hãy thưởng thức những món ăn được thiết kế phù hợp với từng mùa trong năm, mang đến cảm giác tươi mới và hài hòa."
    ],
    image: "/assets/img/specials-5.png"
  }
];

const Specials = () => {
  return (
    <section id="specials" className="specials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Đặc biệt</h2>
        <p>Khám phá món ăn đặc sắc của chúng tôi</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-3">
            <ul className="nav nav-tabs flex-column">
              {specialsData.map((special, index) => (
                <li key={special.id} className="nav-item">
                  <a
                    className={`nav-link ${index === 0 ? "active show" : ""}`}
                    data-bs-toggle="tab"
                    href={`#specials-tab-${special.id}`}
                  >
                    {special.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-9 mt-4 mt-lg-0">
            <div className="tab-content">
              {specialsData.map((special, index) => (
                <div
                  key={special.id}
                  className={`tab-pane ${index === 0 ? "active show" : ""}`}
                  id={`specials-tab-${special.id}`}
                >
                  <div className="row">
                    <div className="col-lg-8 details order-2 order-lg-1">
                      <h3>{special.description[0]}</h3>
                      <p className="fst-italic">{special.description[1]}</p>
                      <p>{special.description[2]}</p>
                    </div>
                    <div className="col-lg-4 text-center order-1 order-lg-2">
                      <img
                        src={special.image}
                        alt={special.title}
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specials;