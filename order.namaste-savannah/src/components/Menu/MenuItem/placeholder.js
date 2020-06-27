import React from 'react';
import { Card, Skeleton, Divider } from 'antd';

import './styles.css';

const MenuPlaceholder = () => {
    return (
        <Card hoverable={true} >
            <Skeleton active title={{ width: '70%' }} paragraph={false} />
            <Divider />
            <Skeleton active title={false} />
            <Skeleton.Input active style={{ width: 100 }} />
        </Card>
    );
}

export default MenuPlaceholder;