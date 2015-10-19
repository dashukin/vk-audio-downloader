'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import AppStore from '../stores/app-store.js';
import App from './app.js';

ReactDom.render(<App/>, document.getElementById('app-wrapper'));
