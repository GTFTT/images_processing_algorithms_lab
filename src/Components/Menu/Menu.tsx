
export interface MenuItemI {
  id: number,
  label: string,
  component: JSX.Element,
}

export interface MenuPropsI {
  menuItems: MenuItemI[],
  selectedMenuItemId: number,
  onSelectMenuItem: (item: MenuItemI) => void,
}

export function Menu({
  menuItems,
  selectedMenuItemId,
  onSelectMenuItem,
}:MenuPropsI): JSX.Element {
  const selectedItem = menuItems.filter((item) => item.id === selectedMenuItemId)[0];

  return <div>
    <div>
      {
        menuItems.map((item, index) => {
          return <button
            key={index}
            onClick={() => onSelectMenuItem(item)}
          >
            {item.label}
          </button>
        })
      }
    </div>
    <div>
      {selectedItem.component}
    </div>
  </div>
}