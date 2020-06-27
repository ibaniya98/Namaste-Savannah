import React from 'react';
import { connect } from 'react-redux';

import Navbar from '../Navbar';
import MainContainer from '../MainContainer';
import Preloader from '../Preloader/Primary';
import { Layout } from 'antd';

import Cart from '../../util/cart';
import 'antd/dist/antd.css';
import './styles.css';

const { Header, Content, Footer } = Layout;

const mapDispatchToProps = (dispatch) => {
  return {
    initializeCart: function (cart) {
      return dispatch({
        type: "initialize_cart", cart
      });
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    Cart.initializeCart()
      .then(cart => {
        this.props.initializeCart(cart);
        this.setState({ loading: false });
      })
      .catch(err => {
        this.props.initializeCart([]);
        this.setState({ loading: false });
      });
  }

  render() {
    
    if (this.state.loading) {
      return <Preloader />;
    }

    return (
      <Layout>
        <Header style={{ backgroundColor: 'white' }}>
          <Navbar />
        </Header>

        <Content className="mt-5" style={{ minHeight: '100vh' }}>
          <MainContainer />
        </Content>

        <Footer>Copyright</Footer>
      </Layout >

    );
  }

}

export default connect(null, mapDispatchToProps)(App);
