import React, { useEffect, useState } from "react";
import MenuCategories from "../../models/menucategories";

const Menu = () => {
  const [info, setInfo] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null); 
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const data = await MenuCategories.getmenucateandmenuitems();
        setInfo(data);
        setFilteredMenuItems(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchInformation();
  }, []);
  const handleCategoryClick = (categoryId) => {
    const filteredItems = info.map(category => {
      if (category.id === categoryId) {
        return category; // Chỉ giữ lại danh mục được chọn
      }
      return { ...category, menuitems: [] }; // Xóa món ăn của các danh mục khác
    }).filter(category => category.menuitems.length > 0); // Lọc chỉ những danh mục có món ăn
    setActiveCategoryId(categoryId)
    setFilteredMenuItems(filteredItems); // Cập nhật state với các món ăn đã lọc
  };

  const handleCategoryClickAll = () =>{
    setFilteredMenuItems(info);
    setActiveCategoryId(null)
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <section id="menu" className="menu section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Menu</h2>
        <p>Thực Đơn Của Chúng Tôi Có Gì</p>
      </div>

      <div
        className="container isotope-layout"
        data-default-filter="*"
        data-layout="masonry"
        data-sort="original-order"
      >
        <div className="row" data-aos="fade-up" data-aos-delay="100">
          <div className="col-lg-12 d-flex justify-content-center">
            <ul className="menu-filters isotope-filters">
              <li data-filter="*" className={activeCategoryId === null ? "filter-active": ""}>
                <a onClick={()=> handleCategoryClickAll()}>All</a>
              </li>
              {info.map((category) => (
                <li
                  key={category.id}
                  className={activeCategoryId === category.id ? "filter-active": ""}
                >
                  <a onClick={() => handleCategoryClick(category.id)}>{category.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="row isotope-container"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {filteredMenuItems.map((category) =>
           Array.isArray(category.menuitems) &&  category.menuitems.length > 0 ? (
              category.menuitems.map((item) => (
                <div className="col-lg-6 menu-item isotope-item filter-starters">
                  <img
                  src={item.image}
                    className="menu-img"
                    alt=""
                  />
                  <div className="menu-content">
                    <a href="#">{item.name}</a>
                    <span>{item.price}</span>
                  </div>
                  <div className="menu-ingredients">{item.instructions}</div>
                </div>
              ))
            ) : (
              <div key={category.id} className="col-lg-12">
                <p>
                  Không có món ăn nào để hiển thị cho danh mục {category.name}.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;
