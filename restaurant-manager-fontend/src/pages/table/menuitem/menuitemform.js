import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { connect } from "react-redux";
import { GET_INGREDIENTS } from "../../../store/actions/ingredients.action";
import { GET_ALL_MENUCATEGORIES } from "../../../store/actions";
import { UPDATE_MENUITEMS } from "../../../store/actions/menuitems.action";

const mapStateToProps = (state) => {
  return {
    propIngredients: state.ingredientsReducer.ingredients,
    propMenuCateGories: state.menucategoriesReducer.menuCateGories,
    propMessage: state.menuitemsReducer.message
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    GET_INGREDIENTS: (payload) => dispatch(GET_INGREDIENTS(payload)),
    GET_ALL_MENUCATEGORIES: (payload) =>
      dispatch(GET_ALL_MENUCATEGORIES(payload)),
    UPDATE_MENUITEMS: (payload) => dispatch(UPDATE_MENUITEMS(payload))
  };
};
const allUnitOptions = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "liters", label: "Liters (L)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "piece", label: "Piece (pcs)" },
];

const unitOptions = {
  kg: [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
  ],
  g: [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
  ],
  liters: [
    { value: "liters", label: "Liters (L)" },
    { value: "ml", label: "Milliliters (ml)" },
  ],
  ml: [
    { value: "liters", label: "Liters (L)" },
    { value: "ml", label: "Milliliters (ml)" },
  ],
  piece: [{ value: "piece", label: "Piece (pcs)" }],
};
class MenuItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data ? this.props.data.id : null,
      name: this.props.data ? this.props.data.name : "",
      description: this.props.data ? this.props.data.description : "",
      price: this.props.data ? this.props.data.price : "",
      instructions: this.props.data ? this.props.data.instructions : "",
      preparation_time: this.props.data ? this.props.data.preparation_time : "",
      status: this.props.data ? this.props.data.status : false,
      category_id: this.props.data ? this.props.data.category_id : "",
      ingredients: this.props.data
        ? this.props.data.ingredients
        : [{ id: 0, quantity: "", unit: "" }],
        image: this.props.data ? this.props.data.image : null, 
    };
  }

  handleInputChange = (e, field) => {
    this.setState({ [field]: e.target.value });
  };

  handleIngredientChange = (index, field, value) => {
    const ingredients = [...this.state.ingredients];
    ingredients[index][field] = value;
    this.setState({ ingredients });
  };

  handleAddIngredient = () => {
    this.setState((prevState) => ({
      ingredients: [
        ...prevState.ingredients,
        { id: 0, quantity: "", unit: "" },
      ],
    }));
  };
  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ image: reader.result }); 
      };
      reader.readAsDataURL(file);
    }
  };
  handleRemoveIngredient = (index) => {
    const ingredients = [...this.state.ingredients];
    ingredients.splice(index, 1);
    this.setState({ ingredients });
  };

  handleSave = async () => {
    await this.props.UPDATE_MENUITEMS(this.state)
    if(this.props.propMessage === 'Success'){
      alert(this.props.formType === "create" ? "Thêm món ăn thành công": "Update món ăn thành công")
      this.props.onClose();
    }
   else{
    alert(this.props.propMessage)
   }
  };
  initData = async () => {
    await this.props.GET_INGREDIENTS();
    await this.props.GET_ALL_MENUCATEGORIES();
  };
  async componentDidMount() {
    await this.initData();
  }

  render() {
    const {
      name,
      description,
      price,
      instructions,
      preparation_time,
      status,
      category_id,
      ingredients,
      image
    } = this.state;
    return (
      <>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label>Tên Món</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => this.handleInputChange(e, "name")}
              />
            </div>
            <div className="mb-3">
              <label>Mô Tả</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => this.handleInputChange(e, "description")}
              />
            </div>
            <div className="mb-3">
              <label>Giá</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => this.handleInputChange(e, "price")}
                min={0}
              />
            </div>
            <div className="mb-3">
              <label>Hướng Dẫn</label>
              <textarea
                className="form-control"
                value={instructions}
                onChange={(e) => this.handleInputChange(e, "instructions")}
              />
            </div>
            <div className="mb-3">
              <label>Thời Gian Chuẩn Bị</label>
              <input
                type="number"
                className="form-control"
                value={preparation_time}
                onChange={(e) => this.handleInputChange(e, "preparation_time")}
              />
            </div>
            <div className="mb-3">
              <label>Trạng Thái</label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => this.handleInputChange(e, "status")}
              >
                <option value={true}>Đang Bán</option>
                <option value={false}>Ngừng Bán</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Danh Mục</label>
              <select
                className="form-control me-2"
                value={category_id}
                onChange={(e) => this.handleInputChange(e, "category_id")}
              >
                {Array.isArray(this.props.propMenuCateGories) &&
                  this.props.propMenuCateGories.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="mb-3">
              <label>Ảnh Món Ăn</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={this.handleImageChange}
              />
              {image && <img    src={image}  alt="Food" className="img-fluid mt-3" />}
            </div>
            <div className="mb-3">
              <label>Nguyên Liệu</label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="d-flex mb-2">
                  <select
                    className="form-control me-2"
                    value={ingredient.id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      this.handleIngredientChange(
                        index,
                        "id",
                        Number(e.target.value)
                      );
                      const selectedIngredient =
                        this.props.propIngredients.find(
                          (item) => Number(item.id) === Number(selectedId)
                        );
                      if (selectedIngredient) {
                        this.setState((prevState) => {
                          const updatedIngredients = [...prevState.ingredients];
                          updatedIngredients[index] = {
                            ...updatedIngredients[index],
                            unit: selectedIngredient.unit || "",
                          };
                          return { ingredients: updatedIngredients };
                        });
                      }
                    }}
                  >
                    <option value="">Chọn Nguyên Liệu</option>
                    {this.props.propIngredients.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Số Lượng"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      this.handleIngredientChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    min={0}
                  />
                  <select
                    className="form-control me-2"
                    value={ingredient.unit || ""}
                    onChange={(e) =>
                      this.handleIngredientChange(index, "unit", e.target.value)
                    }
                  >
                    {ingredient.unit
                      ? unitOptions[ingredient.unit]?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      : allUnitOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                  </select>

                  <Button
                    variant="danger"
                    onClick={() => this.handleRemoveIngredient(index)}
                  >
                    Xóa
                  </Button>
                </div>
              ))}
              <Button variant="secondary" onClick={this.handleAddIngredient}>
                Thêm Nguyên Liệu
              </Button>
            </div>

            <Button variant="primary" onClick={this.handleSave}>
              Lưu
            </Button>
          </form>
        </Modal.Body>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemModal);
