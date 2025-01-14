import React, { Component } from "react";
import { Button, Modal, Pagination } from "react-bootstrap";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import MenuItemModal from "./menuitemform";
import { connect } from "react-redux";
import { GET_MENUITEMS } from "../../../store/actions/menuitems.action";
const mapStateToProps = (state) => {
  return {
    propMenuItems: state.menuitemsReducer.menuitems,
    propMenuItemsCount: state.menuitemsReducer.menuitemsCount,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    GET_MENUITEMS: (payload) => dispatch(GET_MENUITEMS(payload)),
  };
};
class MenuItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      formType: null,
      selectedMenuItem: null,
      menuItems: [],
      menuItemsCount: 0,
      pageSize: 5,
      currentPage: 0,
    };
  }

  handleActionClick = (action, rowData) => {
    if (action === "delete") {
      alert(
        "Bạn có chắc chắn muốn xóa món ăn này không điều đó sẽ khiến các món ăn thuộc danh mục này bị khóa"
      );
    } else if (action === "edit") {
      this.setState({
        showForm: true,
        formType: action,
        selectedMenuItem: rowData,
      });
    } else {
      this.setState({
        showForm: true,
        formType: "create",
        selectedMenuItem: null,
      });
    }
  };

  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount()
  };
  initData = async () => {
    let { currentPage, pageSize } = this.state;
    let skip = currentPage * pageSize;
    await this.props.GET_MENUITEMS({ skip: skip, limit: pageSize });
    this.setState({
      menuItems: this.props.propMenuItems,
      menuItemsCount: this.props.propMenuItemsCount,
    });
  };
  async componentDidMount() {
    await this.initData();
  }
  handlePageClick = (event) => {
    const selectedPage = event.selected;
    this.setState({ currentPage: selectedPage }, () => {
      this.initData();
    });
  };
  render() {
    const {
      showForm,
      formType,
      selectedMenuItem,
      menuItems,
      pageSize,
      menuItemsCount,
    } = this.state;
    const pageCount = Math.ceil(menuItemsCount / pageSize);
    console.log("menuItems", menuItems);

    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Quản Lý Thực Đơn</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang Chủ</a>
                </li>
                <li className="breadcrumb-item active">Quản Lý Thực Đơn</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Danh Sách Món Ăn</h5>
                    <Button onClick={() => this.handleActionClick("create")}>
                      Tạo Mới
                    </Button>

                    <div className="table-responsive mt-3">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Tên Món</th>
                            <th>Mô Tả</th>
                            <th>Ảnh</th>
                            <th>Giá</th>
                            <th>Thời Gian Chuẩn Bị</th>
                            <th>Trạng Thái</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(menuItems) && menuItems.length > 0 ? (
                            menuItems.map((item) => (
                              <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      width="50"
                                      height="50"
                                      className="img-thumbnail"
                                    />
                                  ) : (
                                    <span>Chưa có ảnh</span>
                                  )}
                                </td>
                                <td>{item.price} VND</td>
                                <td>{item.preparation_time} phút</td>
                                
                                <td>
                                  {item.status ? "Đang Bán" : "Ngừng Bán"}
                                </td>
                                
                                <td>
                                  <Button
                                    variant="warning"
                                    onClick={() =>
                                      this.handleActionClick("edit", item)
                                    }
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button
                                    variant="danger"
                                    onClick={() =>
                                      this.handleActionClick("delete", item)
                                    }
                                  >
                                    <FaTrash />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>Không có dữ liệu</tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Pagination className="justify-content-center">
                      <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={this.handlePageClick}
                        containerClassName="pagination"
                        activeClassName="active"
                        previousLabel={<ArrowLeftCircle />}
                        nextLabel={<ArrowRightCircle />}
                        breakLabel="..."
                        pageRangeDisplayed={5}
                        marginPagesDisplayed={2}
                        pageClassName="page-item"
                        pageLinkClassName="page-link rounded-circle"
                        previousClassName="page-item"
                        nextClassName="page-item"
                        previousLinkClassName="page-link rounded-circle"
                        nextLinkClassName="page-link rounded-circle"
                      />
                    </Pagination>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Modal show={showForm} onHide={this.handleCloseForm}>
          <Modal.Header closeButton>
            <Modal.Title>
              {formType === "create" ? "Tạo Món Ăn Mới" : "Chỉnh Sửa Món Ăn"}
            </Modal.Title>
          </Modal.Header>
          <MenuItemModal
            type={formType}
            data={selectedMenuItem}
            onClose={this.handleCloseForm}
          />
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItems);
