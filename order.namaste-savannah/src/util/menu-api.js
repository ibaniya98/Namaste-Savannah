// Dummy Api for development, switch to endpoints for production
import MenuData from './menu.json';

// Test Values
const test = ["Appetizers", "Biryani", "Bowl", "Bread", "Chef's Special", "Dessert", "Kids Corner", "Momo", "Nepalese Fusion", "Salad", "Sides", "Soup", "Starters", "The Clay Oven (Tandoor)", "Veggie Bowl"];

export const getAllCategories = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.05) {
                reject('Assume API has some error')
            } else {
                resolve(test);
            }
        }, 1000);
    });
}

export const getMenuItemsByCategory = async (categoryName) => {    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let filteredItems = MenuData.filter(item => item['category'] === categoryName);            
            resolve(filteredItems);
        }, 1000);
    })
    
    
}

export default { getAllCategories, getMenuItemsByCategory };