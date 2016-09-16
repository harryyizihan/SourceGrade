import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';

import reducers from './reducers';
import routes from './routes';
import reduxThunk from 'redux-thunk';

// Load foundation
require('foundation-sites/dist/foundation.min.css');
$(document).foundation();

// App css
require('./styles/styles.scss');

const createStoreWithMiddleware = applyMiddleware(
  reduxThunk
)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
  , document.getElementById('app'));
