import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Divida from './Dividas';
import DividaDetails from './DividaDetails';

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={Divida} />
            <Route exact path='/dividas/:id' component={DividaDetails} />
        </Switch>
    </main>
)

export default Main;