import React from 'react';
import { Menu } from 'antd'
import { UserOutlined } from '@ant-design/icons';

import ShoppingCartIcon from '../ShoppingCartIcon';

const Navbar = () => {
    return (
        <div className="d-flex justify-content-between align-items-center">
            <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">nav 1</Menu.Item>
                <Menu.Item key="2">nav 2</Menu.Item>
                <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>

            <div style={{ fontSize: 24 }} >
                <UserOutlined className="mx-3" />
               <ShoppingCartIcon />
            </div>
        </div>
    );
};

export default Navbar;