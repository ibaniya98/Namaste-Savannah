import React from 'react';
import { Skeleton, Menu } from 'antd';
import MenuUtil from '../../util/menu-api'

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        MenuUtil.getAllCategories()
            .then(result => {
                this.setState({
                    categories: result
                }, () => this.props.categoryLoaded());
            })
            .catch(error => this.props.hasError());
    }

    handleClick(e) {
        this.props.changeCategory(e.key);
    }

    render() {
        let categories = [];
        if (this.state.categories) {
            categories = this.state.categories.map(category => {
                return <Menu.Item key={category}>{category}</Menu.Item>
            });
        }

        return (
            <Skeleton loading={this.props.loading} active paragraph={false} className="mx-5 justify-content-center">
                <Menu onClick={this.handleClick} selectedKeys={[this.props.activeCategory]}
                    mode="horizontal" className="d-flex justify-content-between">
                    {categories}
                </Menu>
            </Skeleton>
        );
    }
}

export default Category;