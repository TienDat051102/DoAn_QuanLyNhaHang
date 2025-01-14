import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../../../components/datatable";
import { connect } from 'react-redux';
import { DELETE_DISCOUNTS, GET_DISCOUNTS } from "../../../store/actions";
import DiscountForm from "./discountForm";
const mapStateToProps = (state) => {
  return {
    propDiscounts: state.discountsReducer.discounts,
    propDiscountsCount: state.discountsReducer.discountsCount,
  };
};
const mapDispatchToProps =(dispatch)=>{
  return{
    GET_DISCOUNTS: (payload)=>dispatch(GET_DISCOUNTS(payload)),
    DELETE_DISCOUNTS: (payload)=>dispatch(DELETE_DISCOUNTS(payload))
  };
}
const columns = [
  { header: "Mã Giảm Giá", accessor: "code" },
  { header: "Giảm Giá %", accessor: "discount_percentage" },
  { header: "Số Tiền Giảm Tối Đa", accessor: "max_discount_amount" },
  { header: "Ngày Bắt Đầu", accessor: "valid_from" },
  { header: "Ngày Kết Thúc", accessor: "valid_to" },
  { header: "Trạng Thái", accessor: "is_active" },
];

class Discounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discounts: [],
      pageSize: 2,
      currentPage: 0,
      totalRec : 0,
      formType: null, 
      selectedDiscount: null,
      showForm: false, 
    };
  }

  handlePageClick = async(selectedPage)=>{
    let {pageSize} = this.state;
    let skip = selectedPage * pageSize;
    await this.props.GET_DISCOUNTS({skip: skip,limit: pageSize});
    const editedData = this.props.propDiscounts.map(item => {
      return {
        ...item,
        valid_from: new Date(item.valid_from).toLocaleDateString(), 
        valid_to: new Date(item.valid_to).toLocaleDateString(),     
        is_active: item.is_active ? 'Hoạt Động' : 'Không Hoạt Động',
      };
    });
    this.setState({
      discounts: editedData,
      totalRec: this.props.propDiscountsCount,
    })
  }
  handleCloseForm = () => {
    this.setState({ showForm: false });
    this.componentDidMount()
  };


  handleActionClick = async(action,row)=>{
    if(action === "delete"){
      alert("Bạn có chắc chắn muốn xóa mã giảm giá này không");
      const payload ={id: row.id}
      this.props.DELETE_DISCOUNTS(payload) 
      this.initData()
    }
    else if(action === "edit"){
      this.setState({ showForm: true, formType: action, selectedDiscount: row });
    }
    else{
      this.setState({ showForm: true, formType: "create", selectedDiscount: null });
    }
  } 

  initData = async ()=>{
    let {currentPage,pageSize} = this.state;
    let skip = (currentPage) * pageSize;
    await this.props.GET_DISCOUNTS({skip: skip,limit: pageSize});
    const editedData = this.props.propDiscounts.map(item => {
      return {
        ...item,
        valid_from: new Date(item.valid_from).toLocaleDateString(), 
        valid_to: new Date(item.valid_to).toLocaleDateString(),     
        is_active: item.is_active ? 'Hoạt Động' : 'Không Hoạt Động',
      };
    });
    this.setState({
      discounts: editedData,
      totalRec: this.props.propDiscountsCount
    })
  }
  async componentDidMount() {
    await this.initData();
  }

  render() {
    let {showForm,formType,selectedDiscount} = this.state

    return (
      <>
        <main id="main" className="main">
          <div className="pagetitle">
            <h1>Giảm giá</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="index.html">Trang chủ</a>
                </li>
                <li className="breadcrumb-item active">Giảm giá</li>
              </ol>
            </nav>
          </div>
          <section class="section">
      <div class="row">
        <div class="col-lg-12">

          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Giảm giá</h5>
              <Button onClick={()=>this.handleActionClick()}>Tạo</Button>
              <DataTable columns={columns} data={this.state.discounts} count = {this.state.totalRec.count} pageSize={this.state.pageSize} currentPage={this.state.currentPage}  onActionClick={this.handleActionClick}  onHandlePageClick ={this.handlePageClick}/>
            </div>
          </div>

        </div>
      </div>
    </section>

        </main>
        <Modal show={showForm} onHide={this.handleCloseForm}>
          <Modal.Header>
            <Modal.Title>{formType === "create" ? "Create Discount" : "Edit Discount"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DiscountForm
              type={formType}
              data={selectedDiscount}
              onClose={this.handleCloseForm}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Discounts);
