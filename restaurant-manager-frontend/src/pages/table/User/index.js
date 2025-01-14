import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../../../components/datatable";
import { connect } from "react-redux";
import { DELETE_USERS, GET_USERS } from "../../../store/actions";
import Usersform from "./usersform";
const mapStateToProps = (state) => {
  return {
    propUsres: state.usersReducer.users,
    propUsersCount: state.usersReducer.usersCount,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    GET_USERS: (payload) =>dispatch(GET_USERS(payload)),
    DELETE_USERS: (payload) =>dispatch(DELETE_USERS(payload))
  };
};
const columns = [
    { header: "Tên tài khoản", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Tên đầy đủ", accessor: "name" },
    { header: "Quyền hạn", accessor: "role" },
  ];
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      pageSize: 2,
      currentPage: 0,
      totalRec: 0,
      formType: null,
      selectedUsers: null,
      showForm: false,
    };
  }
  handlePageClick = async (selectedPage) => {
    let {pageSize} = this.state;
    let skip = selectedPage * pageSize;
    await this.props.GET_USERS({skip: skip,limit: pageSize});
    const editData = this.props.propUsres.map(item=>{
        return{
            ...item,
            name: (item.first_name || '') + ' ' + (item.last_name || '')
        }
    })
    this.setState({
        users: editData,
        totalRec: this.props.propUsersCount
    })
  };
  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount()
  };

  handleActionClick = async(action,row)=>{
    if(action === "delete"){
      alert("Bạn có chắc chắn muốn xóa tài khoản này không");
      const payload ={id: row.id}
      this.props.DELETE_USERS(payload) 
      this.initData()
    }
    else if(action === "edit"){
      this.setState({ showForm: true, formType: action, selectedUsers: row });
    }
    else{
      this.setState({ showForm: true, formType: "create", selectedUsers: null });
    }
  } 

  initData = async ()=>{
     let {currentPage,pageSize} = this.state;
     let skip = (currentPage) * pageSize;
    await this.props.GET_USERS({skip: skip,limit: pageSize})

    const editData = this.props.propUsres.map(item=>{
        return{
            ...item,
            name : item.first_name + ' '+ item.last_name
        }
    })
    this.setState({
        users: editData,
        totalRec: this.props.propUsersCount
    })
    // const editedData = this.props.propDiscounts.map(item => {
    //   return {
    //     ...item,
    //     valid_from: new Date(item.valid_from).toLocaleDateString(), 
    //     valid_to: new Date(item.valid_to).toLocaleDateString(),     
    //     is_active: item.is_active ? 'Active' : 'Inactive',
    //   };
    // });
    // this.setState({
    //   discounts: editedData,
    //   totalRec: this.props.propDiscountsCount
    // })
  }
  async componentDidMount() {
    await this.initData();
  }
  render() {
    let {showForm,formType,selectedUsers} = this.state
    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Tài Khoản</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang Chủ</a>
                </li>
                <li className="breadcrumb-item active">Tài Khoản</li>
              </ol>
            </nav>
          </div>
          <section class="section">
            <div class="row">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">Tài Khoản</h5>
                    <Button onClick={() => this.handleActionClick()}>
                      Thêm
                    </Button>
                    <DataTable
                      columns={columns}
                      data={this.state.users}
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
          <Modal.Header closeButton>
            <Modal.Title>{formType === "create" ? "Tạo tài Khoản" : "Chỉnh sửa tài khoản"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Usersform
              type={formType}
              data={selectedUsers}
              onClose={this.handleCloseForm}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Users);
