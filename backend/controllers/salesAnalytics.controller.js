import orderModel from "../model/order.model.js";
import productModel from "../model/product.model.js";
import userModel from "../model/user.model.js";

export const salesAnalytics = async (req, res) => {
  try {
    const getAnalytics = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    return res.status(200).json({ getAnalytics, dailySalesData });

  } catch (error) {
    console.error("Error in getting analytics data", error.message);
    res.sendStatus(500);
  }
};

async function getAnalyticsData() {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();
    console.log(`Total Users: ${totalUsers} \n Total Products"${totalProducts}`);

    const salesData = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

    return {
      users: totalUsers,
      products: totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {
    console.error("Error getting sales data", error.message);
    return {
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0
    }
  }
}

async function getDailySalesData(startDate, endDate) {
  try {
    const dailySalesData = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const datesArray = getDatesInRange(startDate, endDate);

    return datesArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
}

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
