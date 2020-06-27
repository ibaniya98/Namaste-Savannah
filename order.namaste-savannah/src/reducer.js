// TODO - Separate reducer based on their functionality as more features are added
function customReducer(state, action) {
    if (!state) {
        state = {
            cart: []
        }
    }

    let newState = Object.assign({}, state);
    newState.cart = [...state.cart];

    switch (action.type) {
        case "initialize_cart":
            newState.cart = action.cart;
            break;
        case "clear_cart":
            newState.cart = [];
            break;
        case "add_item":
            newState.cart.push(action.item);
            break;
        case "delete_item":
            newState.cart = action.cart.filter(item => item._id !== action.item._id);
            break;
        default:
    }

    return newState;
}

export default customReducer;