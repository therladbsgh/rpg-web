/**
 * Root Component
 */
import React from 'react';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { useScroll } from 'react-router-scroll-internal-history';
import IntlWrapper from './modules/Intl/IntlWrapper';

// Import Routes
import routes from './routes';

// Base assets
require('./main.css');
import 'bootstrap/dist/css/bootstrap.css';

export default function App(props) {
  return (
    <Provider store={props.store}>
      <IntlWrapper>
        <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
          {routes}
        </Router>
      </IntlWrapper>
    </Provider>
  );
}

App.propTypes = {
  store: React.PropTypes.object.isRequired,
};
