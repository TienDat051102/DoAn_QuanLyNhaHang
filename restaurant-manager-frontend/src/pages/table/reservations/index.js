import React, { Component } from "react";
import { Button, Modal, Pagination } from "react-bootstrap";
import { ArrowLeftCircle, ArrowRightCircle } from "react-bootstrap-icons";
import { FaEdit, FaTrash } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { connect } from "react-redux";
import { ACCEPT_RESERVATION, GET_LIST_RESERVATION } from "../../../store/actions/reservations.action";
import CreateReservations from "./createReservations";

const mapStateToProps = (state) => ({
  propReservation: state.reservationReducer.reservations,
  propReservationCount: state.reservationReducer.reservationsCount,
  propMessage: state.reservationReducer.message
});

const mapDispatchToProps = (dispatch) => ({
  GET_LIST_RESERVATION: (payload) => dispatch(GET_LIST_RESERVATION(payload)),
  ACCEPT_RESERVATION: (payload)  =>dispatch(ACCEPT_RESERVATION(payload))
});
const status = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "confirmed", label: "Xác nhận" },
  { value: "completed", label: "Hoàn thành" },
  { value: "canceled", label: "Đã hủy" },
];
class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      reservations: [],
      reservationsCount: 0,
      pageSize: 5,
      currentPage: 0,
    };
  }

  handleActionClick = async (action, rowData) => {
    if(action === 'create'){
this.setState({showForm: true})
    }
   else{
    let payload = {id: rowData.id,
      status: action
     }
     await this.props.ACCEPT_RESERVATION(payload)
     alert(this.props.propMessage)
     this.componentDidMount();
   }
  };

  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount();
  };

  initData = async () => {
    const { currentPage, pageSize } = this.state;
    const skip = currentPage * pageSize;
    await this.props.GET_LIST_RESERVATION({ skip, limit: pageSize });
    this.setState({
      reservations: this.props.propReservation,
      reservationsCount: this.props.propReservationCount,
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
      reservations,
      pageSize,
      reservationsCount,
    } = this.state;
    const pageCount = Math.ceil(reservationsCount / pageSize);
    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Quản Lý Đặt Bàn</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang Chủ</a>
                </li>
                <li className="breadcrumb-item active">Quản Lý Đặt Bàn</li>
              </ol>
            </nav>
          </div>

          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Danh Sách Đặt Bàn</h5>
                    <Button onClick={() => this.handleActionClick("create")}>
                      Tạo Mới
                    </Button>

                    <div className="table-responsive mt-3">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Tên khách đặt</th>
                            <th>Liên lạc</th>
                            <th>Bàn</th>
                            <th>Thời gian đặt bàn</th>
                            <th>Số lượng người</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(reservations) &&
                          reservations.length > 0 ? (
                            reservations.map((item) => (
                              <tr key={item.id}>
                                <td>{item.customerInfo?.name || "Không rõ"}</td>
                                <td>
                                  {item.customerInfo?.phone_number ||
                                    "Không rõ"}
                                </td>
                                <td>{item.tableInfo?.name || "Không rõ"}</td>
                                <td>
                                  {new Date(
                                    item.reservation_time
                                  ).toLocaleString()}
                                </td>
                                <td>{item.of_people}</td>
                                <td>
                                  {item.status === "pending" ? (
                                    <>
                                      <Button
                                        variant="success"
                                        onClick={() =>
                                          this.handleActionClick("accept", item)
                                        }
                                      >
                                        Chấp nhận
                                      </Button>{" "}
                                      <Button
                                        variant="danger"
                                        onClick={() =>
                                          this.handleActionClick("reject", item)
                                        }
                                      >
                                        Không chấp nhận
                                      </Button>
                                    </>
                                  ) : (
                                    status.find((s) => s.value === item.status)
                                      ?.label || "Không rõ"
                                  )}
                                </td>
                                <td>{item.note || "Không có ghi chú"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7">Không có dữ liệu</td>
                            </tr>
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
               Đặt Bàn
            </Modal.Title>
            </Modal.Header>
        <Modal.Body>
          <CreateReservations
           onClose={this.handleCloseForm}
          />
        </Modal.Body>
         
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Reservations);
