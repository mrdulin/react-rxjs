import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import { createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';
import rootEpic from './epics';

const epicMiddleware: EpicMiddleware<any, any> = createEpicMiddleware<any, any>(rootEpic);
const logger: Middleware = createLogger({
  predicate: (getState, action): boolean => {
    return true;
  }
});

const middlewares: Middleware[] = [epicMiddleware, routerMiddleware(hashHistory), logger];

function configureStore(): Store<any> {
  const store: Store<any> = createStore<any>(
    rootReducer,
    applyMiddleware(
      ...middlewares
    )
  )
  return store;
}

export default configureStore();
