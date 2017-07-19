import * as React from 'react';
import { Router, browserHistory, hashHistory, PlainRoute } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import store from './configureStore';

const history = syncHistoryWithStore(hashHistory, store);

import App from './containers/App';
import Home from './containers/Home';
import Search from './containers/Search';
import IdsToResults from './containers/IdsToResults';

const appRoutes: PlainRoute = {
  path: '/',
  component: App,
  indexRoute: {
    component: Home
  },
  childRoutes: [
    {
      path: 'search', 
      component: Search
    },
    {
      path: 'idsToResults',
      component: IdsToResults
    }
  ]
};

const AppRouter: React.SFC<any> = () => {
  return (
    <Router history={history} routes={appRoutes}/>
  );
}

export default AppRouter;
