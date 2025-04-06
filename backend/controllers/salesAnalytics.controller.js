import userModel from "../model/user.model.js";
import productModel from '../model/product.model.js'

export const salesAnalytics = async (req, res) => {
    try {
        const analytics = await getAnalyticsData();
    } catch (error) {
        
    }
}

async function getAnalyticsData() {
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    
}