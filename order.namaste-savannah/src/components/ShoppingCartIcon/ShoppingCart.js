import React from 'react';
import { Badge, Popover, Button, message } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons';

const ShoppingCartIcon = (props) => {
    let totalItems = props.cart.reduce((total, item) => {
        return total + item.quantity
    }, 0);
    return (
        <Popover
            content={<CartSummary cart={props.cart} clearCart={props.clearCart} totalItems={totalItems} />}
            title="Cart Summary"
        >
            <Badge style={{ backgroundColor: "#1890ff" }} count={totalItems} overflowCount={10}>
                <ShoppingCartOutlined style={{ fontSize: 32 }} />
            </Badge>
        </Popover>
    );
}

const CartSummary = (props) => {
    const total = props.cart.reduce((total, currentItem) => {
        return total + (currentItem.quantity * currentItem.selectedOption.price)
    }, 0);

    if (props.totalItems === 0) {
        return <p>Cart is empty</p>;
    }

    const clearCart = () => {
        props.clearCart();
        message.warn('Cart has been cleared');
    }

    return (
        <>
            <p>Total Items: {props.totalItems} </p>
            <p>Total Price: ${total.toFixed(2)}</p>

            <div className="d-flex flex-column">
                <Button className="my-1">Checkout</Button>
                <Button danger onClick={clearCart}>Empty Cart</Button>
            </div>
        </>
    );
}

export default ShoppingCartIcon;