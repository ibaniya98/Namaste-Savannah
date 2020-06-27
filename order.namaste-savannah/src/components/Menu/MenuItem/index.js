import React from 'react';
import { Card } from 'antd';

import './styles.css';

const MenuItem = (props) => {
    let item = props.info;
    let prices = item.options.map(option => option.price);

    let lowestPrice = Math.min(...prices).toFixed(2);
    return (
        <Card title={item.itemName} hoverable={true} >
            <p>
                {item.description}
            </p>
            <h5>$ {lowestPrice}</h5>
        </Card>
    )
}

export default MenuItem;