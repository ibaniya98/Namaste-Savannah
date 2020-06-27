import React from 'react';
import { Result } from 'antd';
import { UpCircleTwoTone } from '@ant-design/icons';

import Category from '../Category';
import Menu from '../Menu';
import MenuPlaceholder from '../Menu/MenuItem/placeholder';

import MenuUtil from '../../util/menu-api';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            activeCategory: undefined,
            menuItems: undefined,
            loadingMenu: false,
            loadingCategory: true
        }

        this.changeCategory = this.changeCategory.bind(this);
        this.hasError = this.hasError.bind(this);
        this.categoryLoaded = this.categoryLoaded.bind(this);
    }

    categoryLoaded() {
        this.setState({
            loadingCategory: false
        });
    }

    changeCategory(newCategory) {
        if (newCategory === this.state.activeCategory) {
            return;
        }
        
        this.setState({
            activeCategory: newCategory,
            loadingMenu: true,
            menuItems: undefined
        }, () => {
            MenuUtil.getMenuItemsByCategory(this.state.activeCategory)
                .then(data => {
                    if (this.state.activeCategory === newCategory) {
                        this.setState({ menuItems: data, loadingMenu: false })
                    }
                });
        });
    }

    hasError() {
        this.setState({ error: true });
    }

    render() {
        if (this.state.error) {
            return <Result status="500" title="Opps!"
                subTitle="Sorry something went wrong. Please try again later" />
        }

        let contents;
        if (this.state.activeCategory) {
            contents = <Menu menuItems={this.state.menuItems} loading={this.state.loadingMenu} />;
        } else if (this.state.loadingCategory) {
            contents = (
                <div className="row" style={{ width: '100%' }}>
                    <div className="col-12 col-md-6"><MenuPlaceholder /></div>
                    <div className="col-12 col-md-6"><MenuPlaceholder /></div>
                </div>
            );
        } else {
            contents = <Result
                icon={<UpCircleTwoTone />}
                title="Please select a category to begin"
            />;
        }

        return (
            <>
                <Category hasError={this.hasError} loading={this.state.loadingCategory}
                    changeCategory={this.changeCategory} activeCategory={this.state.activeCategory}
                    categoryLoaded={this.categoryLoaded}
                />
                <div className="my-4 py-5 container">
                    {contents}
                </div>
            </>
        )

    }

}

export default MainContainer;