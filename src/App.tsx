import React, {useState} from 'react';
import 'antd/dist/reset.css';
import './App.css';
import {Menu} from "./Components/Menu/Menu";
import {SobelFilterLibrary} from "./Pages/SobelFilterLibrary/SobelFilterLibrary";
import {SobelFilter} from "./Pages/SobelFilter/SobelFilter";
import {HarrisCornerDetection} from "./Pages/HarrisCornerDetection/HarrisCornerDetection";
import { PeopleSearching } from './Pages/PeopleSearching/PeopleSearching';

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(3);
  return (
    <div className="App">
      <Menu
        selectedMenuItemId={selectedMenuItem}
        onSelectMenuItem={(item) => {
          setSelectedMenuItem(item.id);
        }}
        menuItems={[
          {
            id: 0,
            label: `Sobel's filter from library`,
            component: <SobelFilterLibrary />
          },
          {
            id: 1,
            label: `Sobel's filter`,
            component: <SobelFilter />
          },
          {
            id: 2,
            label: `Harris corner detection`,
            component: <HarrisCornerDetection />
          },
          {
            id: 3,
            label: `People searching with tensorflow`,
            component: <PeopleSearching />
          },
        ]}
      />
    </div>
  );
}

export default App;
