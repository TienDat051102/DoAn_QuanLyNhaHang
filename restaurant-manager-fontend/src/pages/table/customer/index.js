import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../../../components/datatable";
import { connect } from 'react-redux';
import { GET_CUSTOMER } from "../../../store/actions/customer.action";
import Customerform from "./customerform";
const mapStateToProps = (state) => {
  return {
    propCustomers: state.customerReducer.customers,
    propCustomersCount: state.customerReducer.customersCount,
    propMessage: state.customerReducer.message
  };
};
const mapDispatchToProps =(dispatch)=>{
  return{
    GET_CUSTOMER: (payload)=>dispatch(GET_CUSTOMER(payload)),
  };
}
const columns = [
  { header: "Tên khách hàng", accessor: "name" },
  { header: "Địa chỉ email", accessor: "email" },
  { header: "Liên lạc", accessor: "phone_number" },
];

class Customers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      pageSize: 5,
      currentPage: 0,
      totalRec : 0,
      formType: null, 
      selectedCustomers: null,
      showForm: false, 
    };
  }

  handlePageClick = async(selectedPage)=>{
    let {pageSize} = this.state;
    let skip = selectedPage * pageSize;
    await this.props.GET_CUSTOMER({skip: skip,limit: pageSize});
    this.setState({
      customers: this.props.propCustomers,
      totalRec: this.props.propCustomersCount.count,
    })
  }
  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount()
  };


  handleActionClick = async(action,row)=>{
    if(action === "delete"){
      alert("Bạn có chắc chắn muốn xóa khách hàng này không");
      //this.props.DELETE_TABLE({id: row.id}) 
      this.initData()
    }
    else if(action === "edit"){
      this.setState({ showForm: true, formType: action, selectedCustomers: row });
    }
    else{
      this.setState({ showForm: true, formType: "create", selectedCustomers: null });
    }
  } 

  initData = async ()=>{
    let {currentPage,pageSize} = this.state;
    let skip = (currentPage) * pageSize;
    await this.props.GET_CUSTOMER({skip: skip,limit: pageSize});
    this.setState({
      customers: this.props.propCustomers,
      totalRec: this.props.propCustomersCount.count,
    })
  }
  async componentDidMount() {
    await this.initData();
  }

  render() {
    let {showForm,formType,selectedCustomers} = this.state
    console.log('totalRec',this.state.totalRec)
    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Khách Hàng</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang chủ</a>
                </li>
                <li className="breadcrumb-item active">Khách Hàng</li>
              </ol>
            </nav>
          </div>
          <section class="section">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Danh Sách Khách Hàng</h5>
              <Button onClick={()=>this.handleActionClick()}>Tạo Mới</Button>
              <DataTable columns={columns} data={this.state.customers} count = {this.state.totalRec} pageSize={this.state.pageSize} currentPage={this.state.currentPage}  onActionClick={this.handleActionClick}  onHandlePageClick ={this.handlePageClick}/>
            </div>
          </div>

        </div>
      </div>
    </section>

        </main>
        <Modal show={showForm} onHide={this.handleCloseForm}>
          <Modal.Header>
            <Modal.Title>{formType === "create" ? "Thêm thông tin khách hàng" : "Sửa thông tin khách hàng"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Customerform
              type={formType}
              data={selectedCustomers}
              onClose={this.handleCloseForm}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Customers);
