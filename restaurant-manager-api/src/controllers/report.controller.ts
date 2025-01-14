import {authenticate} from '@loopback/authentication';
import {JWTService} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, response} from '@loopback/rest';
import {OrdersRepository, PaymentsRepository} from '../repositories';

export class ReportController {
  constructor(
    @inject('services.JWTService') private jwtService: JWTService,
    @repository(OrdersRepository) private orderRepo: OrdersRepository,
    @repository(PaymentsRepository)
    private paymentsRepo: PaymentsRepository,
  ) {}
  @get('/report/revenuebymonth')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async revenuebymonth(): Promise<any> {
    try {
      const query = `
      SELECT
    EXTRACT(YEAR FROM payment_date) AS year,
    EXTRACT(MONTH FROM payment_date) AS month,
    SUM(amount) AS total_revenue
    FROM payments
    WHERE status = 'completed'
      AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY EXTRACT(YEAR FROM payment_date), EXTRACT(MONTH FROM payment_date)
    ORDER BY year, month;
    `;

      const data = await this.paymentsRepo.dataSource.execute(query);
      return {data: data};
    } catch (e) {
      return {error: `Internal server Error Occurred, Please try again`, e};
    }
  }
  @get('/report/monthlycount')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async monthlycount(): Promise<any> {
    const orders = await this.orderRepo.dataSource.execute(`
        SELECT
        EXTRACT(MONTH FROM o.created_at) AS month,
        COUNT(*) AS total_orders
      FROM orders o
      JOIN orderstatuses os ON o.id = os.orderId
      WHERE os.status = 'complete'
	   AND EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY EXTRACT(MONTH FROM o.created_at), EXTRACT(YEAR FROM o.created_at)
      ORDER BY  month;
    `);
    return {data: orders};
  }
  @get('/report/revenuebycategory')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async revenuebycategory(): Promise<any> {
    const data = await this.orderRepo.dataSource.execute(`SELECT
    mc.name AS category_name,
    SUM((item->>'quantity')::int * (mi.price)::numeric) AS total_revenue
FROM
    orders o
INNER JOIN
    orderitems oi ON o.id = oi.orderid
INNER JOIN
    orderstatuses os ON o.id = os.orderid
CROSS JOIN LATERAL
    jsonb_array_elements(oi.menu_items::jsonb) AS item
INNER JOIN
    menuitems mi ON (item->>'id')::int = mi.id
INNER JOIN
    menucategories mc ON mi.category_id = mc.id
WHERE
    os.status = 'complete'
GROUP BY
    mc.name
ORDER BY
    total_revenue DESC;`);
    return {data: data};
  }

  @get('/report/countorderstoday')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async countorderstoday(): Promise<any> {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date: any) => {
      return date.toISOString().split('T')[0];
    };

    const yesterdayString = formatDate(yesterday);
    const todayString = formatDate(today);
    const dataQuery = await this.orderRepo.dataSource.execute(`SELECT
    COUNT(CASE WHEN TO_CHAR(o.created_at, 'YYYY-MM-DD') = '${todayString}' THEN 1 END) AS orders_today,
    COUNT(CASE WHEN TO_CHAR(o.created_at, 'YYYY-MM-DD') = '${yesterdayString}' THEN 1 END) AS orders_yesterday
    FROM
        orders o
    INNER JOIN
        orderstatuses os ON o.id = os.orderid
    WHERE
        os.status = 'complete';`);
    const ordersToday = dataQuery[0].orders_today || 0;
    const ordersYesterday = dataQuery[0].orders_yesterday || 0;
    const percentageChange =
      Number(ordersYesterday) === 0
        ? Number(ordersToday) > 0
          ? 100
          : 0
        : ((ordersToday - ordersYesterday) / ordersYesterday) * 100;
    const data = {
      ordersToday,
      ordersYesterday,
      percentageChange: percentageChange.toFixed(2),
    };
    return {data: data};
  }

  @get('/report/revenueordertoday')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async revenueordertoday(): Promise<any> {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const formatDate = (date: any) => {
      return date.toISOString().split('T')[0];
    };

    const yesterdayString = formatDate(yesterday);
    const todayString = formatDate(today);
    let sql = `SELECT
    SUM(CASE WHEN TO_CHAR(pm.payment_date, 'YYYY-MM-DD') = '${todayString}' THEN pm.amount ELSE 0  END) AS total_amount_today,
    SUM(CASE WHEN TO_CHAR(pm.payment_date, 'YYYY-MM-DD') = '${yesterdayString}' THEN pm.amount ELSE 0  END) AS total_amount_yesterday
FROM
    orders o
INNER JOIN
    orderstatuses os ON o.id = os.orderid
INNER JOIN
	payments pm on o.id = pm.orderid
WHERE
    os.status = 'complete';
`;
    const dataQuery = await this.orderRepo.dataSource.execute(sql);
    const amountToday = dataQuery[0].total_amount_today || 0;
    const amountYesterday = dataQuery[0].total_amount_yesterday || 0;
    const percentageChange =
      Number(amountYesterday) === 0
        ? Number(amountToday) > 0
          ? 100
          : 0
        : ((amountToday - amountYesterday) / amountYesterday) * 100;
    const data = {
      amountToday,
      amountYesterday,
      percentageChange: percentageChange.toFixed(2),
    };
    return {data: data};
  }
  @get('/report/countcustomerthisyear')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async countcustomerthisyear(): Promise<any> {
    const dataQuery = await this.orderRepo.dataSource.execute(`SELECT
    CASE
        WHEN DATE_PART('year', created_at) = DATE_PART('year', CURRENT_DATE) THEN 'count_customer_this'
        WHEN DATE_PART('year', created_at) = DATE_PART('year', CURRENT_DATE) - 1 THEN 'count_customer_last'
    END AS year,
    COUNT(*) AS customers_count
FROM
    customers
WHERE
    DATE_PART('year', created_at) IN (DATE_PART('year', CURRENT_DATE), DATE_PART('year', CURRENT_DATE) - 1)
GROUP BY
    year
ORDER BY
    year DESC;
`);
    let count_customer_this_year = 0;
    let count_customer_last_year = 0;
    dataQuery.forEach((item: any) => {
      if (item.year === 'count_customer_this') {
        count_customer_this_year = parseInt(item.customers_count);
      }
      if (item.year === 'count_customer_last') {
        count_customer_last_year = parseInt(item.customers_count);
      }
    });
    const percentageChange =
      count_customer_last_year === 0
        ? count_customer_this_year > 0
          ? 100
          : 0
        : ((count_customer_this_year - count_customer_last_year) /
            count_customer_last_year) *
          100;
    const data = {
      count_customer_this_year,
      count_customer_last_year,
      percentageChange,
    };
    return {data: data};
  }

  @get('/report/ordercancellationrate')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async ordercancellationrate(): Promise<any> {
    const data = await this.orderRepo.dataSource.execute(`SELECT
COUNT(CASE WHEN(os.status) = 'cancel' THEN 1 ELSE NULL END) AS count_cancel ,
	COUNT(CASE WHEN(os.status) = 'complete' THEN 1 ELSE NULL END) AS count_complete
FROM orders o INNER JOIN orderstatuses os ON o.id = os.orderid
WHERE EXTRACT(YEAR FROM o.created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
  AND EXTRACT(MONTH FROM o.created_at) = EXTRACT(MONTH FROM CURRENT_DATE);`);
    return {data: data};
  }

  @get('/report/recentorders')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async recentorders(): Promise<any> {
    const data = await this.orderRepo.dataSource
      .execute(`WITH RankedStatuses AS (
  SELECT
    o.id,
    os.status,
    oi.menu_items,
    o.created_at,
    ROW_NUMBER() OVER (PARTITION BY o.id ORDER BY os.updated_at DESC) AS rn
  FROM orders o
  INNER JOIN orderstatuses os ON o.id = os.orderid
  INNER JOIN orderitems oi ON o.id = oi.orderid
)
SELECT id, status, menu_items, created_at
FROM RankedStatuses
WHERE rn = 1
ORDER BY created_at DESC
LIMIT 5;`);
    return {data: data};
  }

  @get('/report/bestsellingproducts')
  @authenticate('jwt')
  @response(200, {
    description: 'Protected resource',
    content: {
      'application/json': {
        schema: {
          type: 'string',
        },
      },
    },
  })
  async bestsellingproducts(): Promise<any> {
    const data = await this.orderRepo.dataSource.execute(`SELECT
    mi.name AS product_name,
	mi.price AS product_price,
    SUM((item->>'quantity')::int) AS total_quantity,
    SUM((item->>'quantity')::int * (mi.price)::numeric) AS total_revenue
FROM
    orders o
INNER JOIN
    orderitems oi ON o.id = oi.orderid
INNER JOIN
    orderstatuses os ON o.id = os.orderid
CROSS JOIN LATERAL
    jsonb_array_elements(oi.menu_items::jsonb) AS item
INNER JOIN
    menuitems mi ON (item->>'id')::int = mi.id
WHERE
    os.status = 'complete'
GROUP BY
    mi.name,
	mi.price
ORDER BY
    total_revenue DESC
LIMIT 5;`);
    return {data: data};
  }
}
