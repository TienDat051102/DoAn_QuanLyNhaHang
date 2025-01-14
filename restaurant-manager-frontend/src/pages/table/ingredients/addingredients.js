import React, { Component } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { CHECK_INGREDIENTS, UPDATE_VALIDATE_INGREDIENTS } from "../../../store/actions/ingredients.action";
const mapStateToProps = (state) => {
  return {
    propValidateIngredients: state.ingredientsReducer.validateIngredients,
    propMessage: state.ingredientsReducer.message
  };
};
const mapDispatchToProps =(dispatch)=>{
  return{
     CHECK_INGREDIENTS: () => dispatch(CHECK_INGREDIENTS()),
     UPDATE_VALIDATE_INGREDIENTS: (payload) =>dispatch(UPDATE_VALIDATE_INGREDIENTS(payload))
  };
}
class AddIngredientPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredientName: "",
      quantity: "",
      unit: "",
      expirationDate: "",
      ingredientsList: [],
      message: "",
      ingredients: [],
      ingredientId: null
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && value < 0) {
      return;
    }
    this.setState({ [name]: value });
  };

  handleAddIngredient = async () => {
    const {ingredientId, ingredientName, quantity, unit, expirationDate } = this.state;
    if (ingredientName && quantity && unit && expirationDate) {
      const newIngredient = {
        ingredientId: ingredientId,
        name: ingredientName,
        quantity: quantity,
        unit: unit,
        expiration_date: expirationDate,
      };
      const payload ={
        ingredientId: ingredientId,
        quantity: quantity,
        new_expiration_date: expirationDate
      }
      console.log('payload',payload)
      await this.props.UPDATE_VALIDATE_INGREDIENTS(payload)
      this.initData()
      if(this.props.propMessage === 'Success'){
        this.setState((prevState) => ({
          ingredientsList: [...prevState.ingredientsList, newIngredient],
          message: "Nguyên liệu đã nhập thêm thành công!",
          ingredientName: "",
          quantity: "",
          unit: "",
          expirationDate: "",
        }));
      }
      else{
        this.setState({ message: this.props.propMessage });
      }
    } else {
      this.setState({ message: "Vui lòng điền đầy đủ thông tin!" });
    }
  };
  async componentDidMount() {
    await this.initData();
  }
  initData = async()=>{
    await this.props.CHECK_INGREDIENTS();
    this.setState({
        ingredients : this.props.propValidateIngredients
    })
  }
  renderIngredientsList = () => {
    const { ingredientsList } = this.state;
    if (ingredientsList.length === 0) {
      return <p>Chưa có nguyên liệu nào được thêm.</p>;
    } else {
      return (
        <ul>
          {ingredientsList.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.quantity} {ingredient.unit} (Hạn
              sử dụng: {ingredient.expiration_date})
            </li>
          ))}
        </ul>
      );
    }
  };
  handleIngredientChange = (event) => {
    const selectedName = event.target.value;
    const selectedIngredient = this.state.ingredients.find(
      (ingredient) => ingredient.name === selectedName
    );
    
    if (selectedIngredient) {
      this.setState({
        ingredientName: selectedName,
        unit: selectedIngredient.unit,
        ingredientId: selectedIngredient.id
      });
    }
  };
  render() {
    const { ingredientName, quantity, unit, expirationDate, message  } =
      this.state;

    return ( 
      <main id="main" className="main">
      <section class="section">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body"></div>
              <Container>
                <h2>Nhập Nguyên Liệu</h2>
                <Form>
                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formIngredientName"
                  >
                    <Form.Label column sm={2}>
                      Tên Nguyên Liệu:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        as="select" 
                        name="ingredientName"
                        value={ingredientName}
                        onChange={this.handleIngredientChange}
                      >
                        <option value="">Chọn tên nguyên liệu</option>{" "}
                        {this.state.ingredients.map((ingredient) => (
                          <option key={ingredient.id} value={ingredient.name}>
                            {ingredient.name+ '    Số Lượng Còn: ' +  (parseFloat(ingredient.quantity).toFixed(2))}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formQuantity"
                  >
                    <Form.Label column sm={2}>
                      Số Lượng:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="number"
                        placeholder="Nhập số lượng"
                        name="quantity"
                        value={quantity}
                        onChange={this.handleChange}
                        min={0}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3" controlId="formUnit">
                    <Form.Label column sm={2}>
                      Đơn Vị:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        name="unit"
                        value={unit}
                        readOnly // Đảm bảo trường đơn vị chỉ được hiển thị, không sửa được
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formExpirationDate"
                  >
                    <Form.Label column sm={2}>
                      Ngày Hạn:
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="date"
                        name="expirationDate"
                        value={expirationDate}
                        onChange={this.handleChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </Col>
                  </Form.Group>

                  <Button variant="primary" onClick={this.handleAddIngredient}>
                    Thêm Nguyên Liệu
                  </Button>
                </Form>

                {message && <p className="mt-3 text-success">{message}</p>}

                <h3 className="mt-4">Danh Sách Nguyên Liệu Đã Nhập Thêm</h3>
                {this.renderIngredientsList()}

                <Link to="/admin/ingredients">
                  <Button variant="secondary" className="mt-3">
                    Trở về Đặt Hàng
                  </Button>
                </Link>
              </Container>
            </div>
          </div>
        </div>
      </section>
      </main>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddIngredientPage);
