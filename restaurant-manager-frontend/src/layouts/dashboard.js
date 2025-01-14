import React, { Component } from "react";
import ApexCharts from "apexcharts";
import { connect } from "react-redux";
import * as echarts from "echarts";
import {
  COUNT_CUSTOMER_THIS_YEAR,
  COUNT_ORDERS_BY_MONTH,
  COUNT_ORDERS_TODAY,
  ORDER_CANCELLATION_RATE,
  ORDERS_RECENT,
  REVENUE_BY_CATEGORY,
  REVENUE_BY_MONTH,
  REVENUE_ORDERS_TODAY,
  TOP_SELLING,
} from "../store/actions/report.action";
import { GET_DISCOUNTS } from "../store/actions";
import { GET_MENUITEMS } from "../store/actions/menuitems.action";

const mapStateToProps = (state) => {
  return {
    propRevenueByMonth: state.reportReducer.revenueByMonth,
    propCountOrdersByMonth: state.reportReducer.countOrdersByMonth,
    propRevenueByCategory: state.reportReducer.revenueByCategory,
    propCountOrdersToday: state.reportReducer.countOrdersToday,
    propRevenueOrdersToday: state.reportReducer.revenueOrdersToday,
    propCountCustomerThisYear: state.reportReducer.countCustomerThisYear,
    propOrderCancellationRate: state.reportReducer.orderCancellationRate,
    propDiscounts: state.discountsReducer.discounts,
    propRecentOrders: state.reportReducer.recentOrders,
    propMenuItems: state.menuitemsReducer.menuitems,
    propTopSelling: state.reportReducer.topSelling,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    REVENUE_BY_MONTH: () => dispatch(REVENUE_BY_MONTH()),
    COUNT_ORDERS_BY_MONTH: () => dispatch(COUNT_ORDERS_BY_MONTH()),
    REVENUE_BY_CATEGORY: () => dispatch(REVENUE_BY_CATEGORY()),
    COUNT_ORDERS_TODAY: () => dispatch(COUNT_ORDERS_TODAY()),
    REVENUE_ORDERS_TODAY: () => dispatch(REVENUE_ORDERS_TODAY()),
    COUNT_CUSTOMER_THIS_YEAR: () => dispatch(COUNT_CUSTOMER_THIS_YEAR()),
    ORDER_CANCELLATION_RATE: () => dispatch(ORDER_CANCELLATION_RATE()),
    GET_DISCOUNTS: (payload) => dispatch(GET_DISCOUNTS(payload)),
    ORDERS_RECENT: () => dispatch(ORDERS_RECENT()),
    GET_MENUITEMS: (payload) => dispatch(GET_MENUITEMS(payload)),
    TOP_SELLING: () => dispatch(TOP_SELLING()),
  };
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.barChartRef = React.createRef();
    this.pieChartRef = React.createRef();
    this.state = {
      revenueByMonth: [],
      countOrdersByMonth: [],
      revenueByCategory: [],
      countOrdersToday: [],
      revenueOrdersToday: [],
      countCustomerThisYear: [],
      orderCancellationRate: [],
      listDiscounts: [],
      listRecentOrders: [],
      listMenuItem: [],
      listTopSelling: [],
    };
  }

  initData = async () => {
    try {
      await this.props.REVENUE_BY_MONTH();
      await this.props.COUNT_ORDERS_BY_MONTH();
      await this.props.REVENUE_BY_CATEGORY();
      await this.props.COUNT_ORDERS_TODAY();
      await this.props.REVENUE_ORDERS_TODAY();
      await this.props.COUNT_CUSTOMER_THIS_YEAR();
      await this.props.ORDER_CANCELLATION_RATE();
      await this.props.GET_DISCOUNTS();
      await this.props.ORDERS_RECENT();
      await this.props.GET_MENUITEMS();
      await this.props.TOP_SELLING();
      this.setState({
        revenueByMonth: this.props.propRevenueByMonth,
        countOrdersByMonth: this.props.propCountOrdersByMonth,
        revenueByCategory: this.props.propRevenueByCategory,
        countOrdersToday: this.props.propCountOrdersToday,
        revenueOrdersToday: this.props.propRevenueOrdersToday,
        countCustomerThisYear: this.props.propCountCustomerThisYear,
        orderCancellationRate: this.props.propOrderCancellationRate,
        listDiscounts: this.props.propDiscounts,
        listRecentOrders: this.props.propRecentOrders,
        listMenuItem: this.props.propMenuItems,
        listTopSelling: this.props.propTopSelling,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  renderApexChart = (totalRevenue, totalOrder) => {
    const options = {
      series: [
        {
          name: "Doanh thu",
          data: totalRevenue,
        },
        {
          name: "Số đơn hàng",
          data: totalOrder,
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
      },
      markers: { size: 4 },
      colors: ["#FF5733", "#4CAF50"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        type: "category",
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      tooltip: { x: { format: "dd/MM/yy" } },
    };

    this.chart = new ApexCharts(this.chartRef.current, options);
    this.chart.render();
  };

  renderPieChart = () => {
    const chartData = this.props.propRevenueByCategory.map((item) => ({
      value: parseInt(item.total_revenue, 10),
      name: item.category_name,
    }));
    const pieChart = echarts.init(this.pieChartRef.current);
    pieChart.setOption({
      tooltip: { trigger: "item" },
      legend: { top: "5%", left: "center" },
      series: [
        {
          name: "Doanh Thu Theo Món",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: { show: false, position: "center" },
          emphasis: {
            label: { show: true, fontSize: "18", fontWeight: "bold" },
          },
          labelLine: { show: false },
          data: chartData,
        },
      ],
    });
  };

  renderBarChart = () => {
    const totalOrders =
      parseInt(this.props.propOrderCancellationRate?.[0]?.count_complete || 0) +
      parseInt(this.props.propOrderCancellationRate?.[0]?.count_cancel || 0);
    const completionRate =
      totalOrders > 0
        ? ((this.props.propOrderCancellationRate[0].count_complete || 0) /
            totalOrders) *
          100
        : 0;
    const cancellationRate =
      totalOrders > 0
        ? ((this.props.propOrderCancellationRate[0].count_cancel || 0) /
            totalOrders) *
          100
        : 0;
    const barChart = echarts.init(this.barChartRef.current);
    const barOptions = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["Đã hoàn thành", "Bị hủy"],
        top: "5%",
        left: "center",
      },
      xAxis: {
        type: "category",
        data: ["Đơn hàng"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Đã hoàn thành",
          type: "bar",
          data: [
            this.props.propOrderCancellationRate?.[0]?.count_complete || 0,
          ],
          color: "#4caf50",
          label: {
            show: true,
            position: "top",
            formatter: () => `${completionRate.toFixed(2)}%`,
          },
        },
        {
          name: "Bị hủy",
          type: "bar",
          data: [this.props.propOrderCancellationRate?.[0]?.count_cancel || 0],
          color: "#f44336",
          label: {
            show: true,
            position: "top",
            formatter: () => `${cancellationRate.toFixed(2)}%`,
          },
        },
      ],
    };

    barChart.setOption(barOptions);
  };

  componentDidMount() {
    this.initData();
    const months = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
    const totalRevenue = months.map((month) => {
      const monthData = this.props.propRevenueByMonth.find(
        (data) => data.month === month
      );
      return monthData ? parseInt(monthData.total_revenue, 10) : 0;
    });

    const totalOrder = months.map((month) => {
      const monthData = this.props.propCountOrdersByMonth.find(
        (data) => data.month === month
      );
      return monthData ? parseInt(monthData.total_orders, 10) : 0;
    });
    this.renderApexChart(totalRevenue, totalOrder);
    this.renderPieChart();
    this.renderBarChart();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.barChart) {
      echarts.dispose(this.barChartRef.current);
    }
    if (this.pieChart) {
      echarts.dispose(this.pieChartRef.current);
    }
  }
  renderApexChart = (totalRevenue, totalOrder) => {
    const options = {
      series: [
        {
          name: "Doanh thu",
          data: totalRevenue,
        },
        {
          name: "Số đơn hàng",
          data: totalOrder,
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
      },
      markers: { size: 4 },
      colors: ["#FF5733", "#4CAF50"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        type: "category",
        categories: [
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ],
      },
      tooltip: { x: { format: "dd/MM/yy" } },
    };

    this.chart = new ApexCharts(this.chartRef.current, options);
    this.chart.render();
  };
  getProductNameById(id) {
    const product = this.state.listMenuItem.find((item) => item.id === id);
    return product ? product.name : "Product not found";
  }
  getTotalByMenuItem(menu_items) {
    let total = 0;
    menu_items?.forEach((item) => {
      total += parseInt(item.price, 10);
    });
    const totalInVND = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(total);

    return totalInVND;
  }
  render() {
    const {
      countOrdersToday,
      revenueOrdersToday,
      countCustomerThisYear,
      listDiscounts,
      listRecentOrders,
      listTopSelling,
    } = this.state;
    return (
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Trang tổng quan</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Trang chủ</a>
              </li>
              <li className="breadcrumb-item active">Trang tổng quan</li>
            </ol>
          </nav>
        </div>

        <section className="section dashboard">
          <div className="row">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card sales-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Số đơn <span>| Hôm nay</span>
                      </h5>

                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-cart"></i>
                        </div>
                        <div className="ps-3">
                          {/* Kiểm tra countOrdersToday tồn tại và render */}
                          <h6>
                            {countOrdersToday
                              ? countOrdersToday.ordersToday
                              : 0}
                          </h6>
                          {/* Kiểm tra percentageChange tồn tại và có kiểu chuỗi hợp lệ */}
                          <span
                            className={`text-${
                              countOrdersToday &&
                              countOrdersToday.percentageChange &&
                              countOrdersToday.percentageChange.startsWith("-")
                                ? "danger"
                                : "success"
                            } small pt-1 fw-bold`}
                          >
                            {countOrdersToday &&
                            countOrdersToday.percentageChange
                              ? countOrdersToday.percentageChange
                              : "0.00"}
                            %
                          </span>{" "}
                          <span className="text-muted small pt-2 ps-1">
                            {countOrdersToday &&
                            countOrdersToday.percentageChange &&
                            countOrdersToday.percentageChange.startsWith("-")
                              ? "Giảm"
                              : "tăng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card revenue-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Doanh thu <span>| Hôm nay</span>
                      </h5>

                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-cart"></i>
                        </div>
                        <div className="ps-3">
                          {/* Kiểm tra countOrdersToday tồn tại và render */}
                          <h6>
                            {revenueOrdersToday
                              ? new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(revenueOrdersToday.amountToday)
                              : "₫0"}
                          </h6>
                          {/* Kiểm tra percentageChange tồn tại và có kiểu chuỗi hợp lệ */}
                          <span
                            className={`text-${
                              revenueOrdersToday &&
                              revenueOrdersToday.percentageChange &&
                              revenueOrdersToday.percentageChange.startsWith(
                                "-"
                              )
                                ? "danger"
                                : "success"
                            } small pt-1 fw-bold`}
                          >
                            {revenueOrdersToday &&
                            revenueOrdersToday.percentageChange
                              ? revenueOrdersToday.percentageChange
                              : "0.00"}
                            %
                          </span>{" "}
                          <span className="text-muted small pt-2 ps-1">
                            {revenueOrdersToday &&
                            revenueOrdersToday.percentageChange &&
                            revenueOrdersToday.percentageChange.startsWith("-")
                              ? "Giảm"
                              : "tăng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xxl-4 col-xl-12">
                  <div className="card info-card customers-card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Lượng Khách <span>| Năm nay</span>
                      </h5>

                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-cart"></i>
                        </div>
                        <div className="ps-3">
                          {/* Kiểm tra countOrdersToday tồn tại và render */}
                          <h6>
                            {countCustomerThisYear
                              ? countCustomerThisYear.count_customer_this_year
                              : 0}
                          </h6>
                          {/* Kiểm tra percentageChange tồn tại và có kiểu chuỗi hợp lệ */}
                          <span
                            className={`text-${
                              countCustomerThisYear &&
                              countCustomerThisYear.percentageChange !==
                                undefined &&
                              String(
                                countCustomerThisYear.percentageChange
                              ).startsWith("-")
                                ? "danger"
                                : "success"
                            } small pt-1 fw-bold`}
                          >
                            {countCustomerThisYear &&
                            countCustomerThisYear.percentageChange !== undefined
                              ? countCustomerThisYear.percentageChange
                              : "0.00"}
                            %
                          </span>

                          <span className="text-muted small pt-2 ps-1">
  {countCustomerThisYear &&
  countCustomerThisYear.percentageChange !== undefined &&
  String(countCustomerThisYear.percentageChange).startsWith("-")
    ? "Giảm"
    : "Tăng"}
</span>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Báo cáo doanh thu và đơn hàng<span></span>
                      </h5>
                      <div id="reportsChart" ref={this.chartRef}></div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card recent-sales overflow-auto">
                    <div className="card-body">
                      <h5 className="card-title">Các đơn hàng gần đây</h5>
                      <table className="table table-borderless datatable">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Ngày</th>{" "}
                            <th scope="col">Sản Phẩm</th>
                            <th scope="col">Tổng tiền</th>
                            <th scope="col">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listRecentOrders.map((order) => (
                            <tr key={order.id}>
                              <th scope="row">
                                <a href="#">#{order.id}</a>
                              </th>
                              <td>
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-US"
                                )}
                              </td>
                              <td>
                                <span>
                                  {order.menu_items.map((item, i) => (
                                    <span key={i}>
                                      {this.getProductNameById(item.id)},
                                    </span>
                                  ))}
                                </span>
                              </td>
                              <td>
                                {this.getTotalByMenuItem(order.menu_items)}
                              </td>
                              <td>
                                <span
                                  className={`badge bg-${
                                    order.status === "complete"
                                      ? "success"
                                      : order.status === "cancel"
                                      ? "danger"
                                      : "warning"
                                  }`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="card top-selling overflow-auto">
                    <div className="card-body pb-0">
                      <h5 className="card-title">Sản phẩm bán chạy nhất</h5>

                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th scope="col">Tên món</th>
                            <th scope="col">Giá</th>
                            <th scope="col">Số lượng đã bán</th>
                            <th scope="col">Doanh thu</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listTopSelling && listTopSelling.length > 0
                            ? listTopSelling.map((item) => (
                                <tr>
                                  <td>
                                    <a
                                      href="#"
                                      className="text-primary fw-bold"
                                    >
                                      {item.product_name}
                                    </a>
                                  </td>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.product_price)}
                                  <td className="fw-bold">
                                    {item.total_quantity}
                                  </td>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.total_revenue)}
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Hoạt động gần đây</h5>

                  <div className="activity">
                    {listDiscounts && listDiscounts.length > 0 ? (
                      listDiscounts.map((item) => (
                        <div key={item.id} className="activity-item d-flex">
                          <i className="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                          <div className="activity-content">
                            Mã giảm giá{" "}
                            <span className="fw-bold text-dark">
                              {item.code}
                            </span>{" "}
                            - Giảm {item.discount_percentage}% (Tối đa:{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.max_discount_amount) ||
                              "Không giới hạn"}
                            ) {item.describe && ` - ${item.describe}`}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="activity-item d-flex">
                        <div className="activity-content">
                          Hiện không có hoạt động mới
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body pb-0">
                  <h5 className="card-title">
                    Tỷ lệ đơn hàng bị hủy <span></span>
                  </h5>
                  <div
                    id="budgetChart"
                    style={{ minHeight: "400px" }}
                    className="echart"
                    ref={this.barChartRef}
                  ></div>
                </div>
              </div>

              <div className="card">
                <div className="card-body pb-0">
                  <h5 className="card-title">
                    Doanh thu theo danh mục món ăn<span></span>
                  </h5>
                  <div
                    id="trafficChart"
                    style={{ minHeight: "400px" }}
                    className="echart"
                    ref={this.pieChartRef}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
