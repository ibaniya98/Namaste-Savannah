import ShoppingCart from './ShoppingCart';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        cart: state.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearCart: function () {
            return dispatch({ type: "clear_cart" });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);