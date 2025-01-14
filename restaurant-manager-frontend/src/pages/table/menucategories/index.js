import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../../../components/datatable";
import { connect } from "react-redux";
import {
  DELETE_MENUCATEGORIES,
  GET_ALL_MENUCATEGORIES,
} from "../../../store/actions";
import Menucategoriesform from "./menucategoriesform";
const mapStateToProps = (state) => {
  return {
    propMenucategories: state.menucategoriesReducer.menuCateGories,
    propMenucategoriesCount: state.menucategoriesReducer.menuCateGoriesCount,
    propMessage: state.menucategoriesReducer.message,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    GET_ALL_MENUCATEGORIES: (payload) =>
      dispatch(GET_ALL_MENUCATEGORIES(payload)),
    DELETE_MENUCATEGORIES: (payload) =>
      dispatch(DELETE_MENUCATEGORIES(payload)),
  };
};
const columns = [
  { header: "Tên Món", accessor: "name" },
  { header: "Những Món Ăn Trong Danh Mục", accessor: "menuitems" },
];

class MenuCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menucategories: [],
      pageSize: 5,
      currentPage: 0,
      totalRec: 0,
      formType: null,
      selectedMenuCate: null,
      showForm: false,
    };
  }

  handlePageClick = async (selectedPage) => {
    let { pageSize } = this.state;
    let skip = selectedPage * pageSize;
    await this.props.GET_ALL_MENUCATEGORIES({ skip: skip, limit: pageSize });
    const editedData = this.props.propMenucategories.map((item) => {
      console.log("item", item.menuitems);
      const menuItemsNames =
        item.menuitems &&
        item.menuitems.map((menuitem) => menuitem.name).join(", ");
      return {
        ...item,
        menuitems: menuItemsNames,
      };
    });
    this.setState({
      menucategories: editedData,
      totalRec: this.props.propMenucategoriesCount,
    });
  };
  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount();
  };

  handleActionClick = async (action, row) => {

    if (action === "delete") {
      alert(
        "Bạn có chắc chắn muốn xóa danh mục món ăn này không điều đó sẽ khiến các món ăn thuộc danh mục này bị khóa"
      );
      const payload = { id: row.id };
      this.props.DELETE_MENUCATEGORIES(payload);
    
        this.componentDidMount();
    } else if (action === "edit") {
      this.setState({
        showForm: true,
        formType: action,
        selectedMenuCate: row,
      });
    } else {
      this.setState({
        showForm: true,
        formType: "create",
        selectedMenuCate: null,
      });
    }
  };

  initData = async () => {
    let { currentPage, pageSize } = this.state;
    let skip = currentPage * pageSize;
    await this.props.GET_ALL_MENUCATEGORIES({ skip: skip, limit: pageSize });
    const editedData = this.props.propMenucategories.map((item) => {
      const menuItemsNames =
        item.menuitems &&
        item.menuitems.map((menuitem) => menuitem.name).join(", ");
      return {
        ...item,
        menuitems: menuItemsNames,
      };
    });
    this.setState({
      menucategories: editedData,
      totalRec: this.props.propMenucategoriesCount,
    });
  };
  async componentDidMount() {
    await this.initData();
  }

  render() {
    let { showForm, formType,selectedMenuCate } = this.state;

    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Quản Lý Danh Mục</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang Chủ</a>
                </li>
                <li className="breadcrumb-item active">Quản Lý Danh Mục</li>
              </ol>
            </nav>
          </div>
          <section class="section">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">Quản Lý Danh Mục</h5>
                    <Button onClick={() => this.handleActionClick()}>
                      Tạo Mới
                    </Button>
                    <DataTable
                      columns={columns}
                      data={this.state.menucategories}
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
              {formType === "create" ? "Create Discount" : "Edit Discount"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Menucategoriesform
              type={formType}
              data={selectedMenuCate}
              onClose={this.handleCloseForm}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuCategories);
