import React from 'react';
const chefsData = [
    {
      name: "Walter White",
      title: "Master Chef",
      image: "assets/img/chefs/chefs-1.jpg",
      socialLinks: [
        { icon: "bi bi-twitter-x", url: "#" },
        { icon: "bi bi-facebook", url: "#" },
        { icon: "bi bi-instagram", url: "#" },
        { icon: "bi bi-linkedin", url: "#" },
      ],
    },
    {
      name: "Sarah Jhonson",
      title: "Patissier",
      image: "assets/img/chefs/chefs-2.jpg",
      socialLinks: [
        { icon: "bi bi-twitter-x", url: "#" },
        { icon: "bi bi-facebook", url: "#" },
        { icon: "bi bi-instagram", url: "#" },
        { icon: "bi bi-linkedin", url: "#" },
      ],
    },
    {
      name: "William Anderson",
      title: "Cook",
      image: "assets/img/chefs/chefs-3.jpg",
      socialLinks: [
        { icon: "bi bi-twitter-x", url: "#" },
        { icon: "bi bi-facebook", url: "#" },
        { icon: "bi bi-instagram", url: "#" },
        { icon: "bi bi-linkedin", url: "#" },
      ],
    },
  ];
const Chefs = () => {
  return (
    <section id="chefs" className="chefs section">
    <div className="container section-title" data-aos="fade-up">
      <h2>Team</h2>
      <p>Đội ngũ của Chúng Tôi</p>
    </div>
    <div className="container">
      <div className="row gy-4">
        {chefsData.map((chef, index) => (
          <div
            className="col-lg-4"
            data-aos="fade-up"
            data-aos-delay={100 * (index + 1)}
            key={index}
          >
            <div className="member">
              <img src={chef.image} className="img-fluid" alt="" />
              <div className="member-info">
                <div className="member-info-content">
                  <h4>{chef.name}</h4>
                  <span>{chef.title}</span>
                </div>
                <div className="social">
                  {chef.socialLinks.map((link, idx) => (
                    <a href={link.url} key={idx}>
                      <i className={link.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Chefs;
