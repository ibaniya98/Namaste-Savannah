import React from 'react';
import { Result } from 'antd';
import Masonry from 'react-masonry-css';

import MenuItem from './MenuItem';
import MenuPlaceholder from './MenuItem/placeholder';
import MenuModal from './MenuModal';

import './styles.css';

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentItem: undefined,
            visible: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal(item) {
        this.setState({
            currentItem: item,
            visible: true
        });
    }

    hideModal() {
        this.setState({
            visible: false,
            currentItem: undefined
        });
    }

    render() {
        if (!this.props.loading && !this.props.menuItems) {
            return <Result
                status="error"
                title="Submission Failed"
                subTitle="Please check and modify the following information before resubmitting."
            />
        }

        let menuCards;

        if (this.props.loading) {
            menuCards = []
            for (let i = 0; i < 2; i++) {
                menuCards.push(<div><MenuPlaceholder /></div>);
            }
        } else {
            menuCards = this.props.menuItems.map(item => {
                return (
                    <div key={item._id} onClick={() => this.showModal(item)}>
                        <MenuItem info={item} />
                    </div>
                )
            });
        }

        const breakpointColumnsObj = {
            default: 2,
            576: 1
        };

        return (
            <>
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="menu_grid"
                    columnClassName="menu_grid_column"
                >
                    {menuCards}
                </Masonry>

                {
                    this.state.currentItem &&
                    <MenuModal item={this.state.currentItem}
                        visible={this.state.visible} hideModal={this.hideModal}
                    />
                }
            </>
        );
    }
}

export default Menu;