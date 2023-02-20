import React, {useState} from 'react';
import 'antd/dist/reset.css';
import './App.css';
import {Menu} from "./Components/Menu/Menu";
import {SobelFilterLibrary} from "./Pages/SobelFilterLibrary/SobelFilterLibrary";
import {SobelFilter} from "./Pages/SobelFilter/SobelFilter";

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(1);
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
        ]}
      />
    </div>
  );
}

export default App;
