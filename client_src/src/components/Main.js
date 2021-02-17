import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Divida from './Dividas';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Divida} />
        </Switch>
    </main>
)

export default Main;