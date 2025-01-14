import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../../../components/datatable";
import { connect } from "react-redux";
import {
  CHECK_INGREDIENTS,
  DELETE_INGREDIENTS,
  GET_INGREDIENTS,
  UPDATE_EXPIRED_INGREDIENTS,
} from "../../../store/actions/ingredients.action";
import IngredientsForm from "./ingredientsForm";
import { Navigate } from "react-router-dom";
const mapStateToProps = (state) => {
  return {
    propIngredients: state.ingredientsReducer.ingredients,
    propIngredientsCount: state.ingredientsReducer.ingredientsCount,
    propMessage: state.ingredientsReducer.message,
    propError: state.ingredientsReducer.error,
    propExpiredIngredients: state.ingredientsReducer.expiredIngredients,
    propValidateIngredients: state.ingredientsReducer.validateIngredients,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    GET_INGREDIENTS: (payload) => dispatch(GET_INGREDIENTS(payload)),
    DELETE_INGREDIENTS: (payload) => dispatch(DELETE_INGREDIENTS(payload)),
    UPDATE_EXPIRED_INGREDIENTS: () => dispatch(UPDATE_EXPIRED_INGREDIENTS()),
    CHECK_INGREDIENTS: () => dispatch(CHECK_INGREDIENTS()),
  };
};
const columns = [
  { header: "Tên Nguyên Liệu", accessor: "name" },
  { header: "Số Lượng Còn", accessor: "quantity" },
  { header: "Đơn Vị Đo Lường", accessor: "unit" },
  { header: "Trạng Thái", accessor: "is_active" },
  { header: "Ngày Hết Hạn", accessor: "expiration_date" },
];
class Ingredients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredient: [],
      pageSize: 10,
      currentPage: 0,
      totalRec: 0,
      formType: null,
      selectedIngredients: null,
      showForm: false,
      message: "",
      error: "",
      showIngredientsGone: false,
      validateIngredients: [],
      redirect: false
    };
  }
  handleCloseForm = () => {
    this.setState({ showForm: false, showIngredientsGone: false });
    this.componentDidMount();
  };
  handlePageClick = async (selectedPage) => {
    let { pageSize } = this.state;
    let skip = selectedPage * pageSize;
    await this.props.GET_INGREDIENTS({ skip: skip, limit: pageSize });
    const editedData = this.props.propIngredients.map((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      return {
        ...item,
        expiration_date: new Date(item.expiration_date).toLocaleDateString(),
        quantity: quantity.toFixed(2),
        is_active: item.is_active ? "Hoạt Động" : "Không Hoạt Động",
      };
    });
    this.setState({
      ingredient: editedData,
      totalRec: this.props.propIngredientsCount,
    });
  };

  handleActionClick = async (action, row) => {
    if (action === "delete") {
      alert("Bạn có chắc chắn muốn xóa nguyên liệu này không!");
      const payload = { id: row.id };
      this.props.DELETE_INGREDIENTS(payload);
      this.initData();
    } else if (action === "edit") {
      this.setState({
        showForm: true,
        formType: action,
        selectedIngredients: row,
      });
    } else {
      this.setState({
        showForm: true,
        formType: "create",
        selectedIngredients: null,
      });
    }
  };
  initData = async () => {
    let { currentPage, pageSize } = this.state;
    let skip = currentPage * pageSize;
    await this.props.GET_INGREDIENTS({ skip: skip, limit: pageSize });
    const editedData = this.props.propIngredients.map((item) => {
      const quantity = parseFloat(item.quantity) || 0;
      return {
        ...item,
        expiration_date: new Date(item.expiration_date).toLocaleDateString(),
        quantity: quantity.toFixed(2),
        is_active: item.is_active ? "Hoạt Động" : "Không Hoạt Động",
      };
    });
    this.setState({
      ingredient: editedData,
      totalRec: this.props.propIngredientsCount,
      message: this.props.propMessage,
      error: this.props.propError,
    });
  };
  async componentDidMount() {
    await this.initData();
  }
  checkActionClick = async () => {
    await this.props.UPDATE_EXPIRED_INGREDIENTS();
    const data = this.props.propExpiredIngredients.map((item) => item.name);
    if (data.length > 0) {
      alert(`Các nguyên liệu hết hạn:\n${data.join("\n")}\nVui lòng loại bỏ.`);
      this.componentDidMount();
    } else {
      alert(`Không có nguyên liệu nào hết hạn`);
    }
  };

  handleShowExpiredIngredients = async () => {
    await this.props.CHECK_INGREDIENTS();

    const validateIngredients = (
      this.props.propValidateIngredients || []
    ).filter((item) => {
      const quantity = parseFloat(item.quantity);
      return quantity >= 0 && quantity < 2;
    });
    this.setState({
      showIngredientsGone: true,
      validateIngredients,
    });
  };
  handleRedirectToAddPage =()=>{
    this.setState({ showIngredientsGone: false,redirect: true });
  }
  render() {
    let { showForm, formType, selectedIngredients, showIngredientsGone,redirect } =
      this.state;
      if(redirect){
        return <Navigate to="/admin/addingredients" replace />;
      }
    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Nguyên Liệu</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang Chủ</a>
                </li>
                <li className="breadcrumb-item active">Nguyên Liệu</li>
              </ol>
            </nav>
          </div>
          <section class="section">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">Nguyên Liệu</h5>
                    <Button onClick={() => this.handleActionClick()}>
                      Thêm Mới
                    </Button>
                    <Button style={{marginLeft: '25px'}} onClick={() => this.checkActionClick()}>
                      Kiểm tra nguyên liệu
                    </Button>
                    <Button style={{marginLeft: '25px'}} onClick={() => this.handleShowExpiredIngredients()}>
                      Những nguyên liệu hết
                    </Button>
                    <DataTable
                      columns={columns}
                      data={this.state.ingredient}
                      count={this.state.totalRec.count}
                      pageSize={this.state.pageSize}
                      currentPage={this.state.currentPage}
                      onActionClick={this.handleActionClick}
                      onHandlePageClick={this.handlePageClick}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Modal show={showForm} onHide={this.handleCloseForm}>
          <Modal.Header>
            <Modal.Title>
              {formType === "create"
                ? "Create Ingredients"
                : "Edit Ingredients"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <IngredientsForm
              type={formType}
              data={selectedIngredients}
              onClose={this.handleCloseForm}
            />
          </Modal.Body>
        </Modal>

        <Modal show={showIngredientsGone} onHide={this.handleCloseForm}>
          <Modal.Header closeButton>
            <Modal.Title>Những Nguyên Liệu Sắp Hết</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.validateIngredients &&
            this.state.validateIngredients.length > 0 ? (
              <ul>
                {this.state.validateIngredients.map((item) => (
                  <li key={item.id}>
                    {item.name} - Số lượng còn: {item.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có nguyên liệu nào sắp hết.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseForm}>
              Đóng
            </Button>
            <Button variant="primary" onClick={this.handleRedirectToAddPage}>
              Nhập Ngay
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Ingredients);
