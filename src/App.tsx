import React, {useState} from 'react';
import 'antd/dist/reset.css';
import './App.css';
import {Menu} from "./Components/Menu/Menu";
import {SobelFilter} from "./Pages/SobelFilter/SobelFilter";

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
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
            label: `Sobel's filter`,
            component: <SobelFilter />
          }
        ]}
      />
    </div>
  );
}

export default App;
