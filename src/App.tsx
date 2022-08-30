import React, { useEffect, useState } from 'react';
import './App.css'

interface Item {
  id: number
  value: number
  order: number
}

const generateArray = (cnt: number): Item[] =>
  [...new Array(cnt)]
    .map(_ => ~~(Math.random() * 9 + 1))
    .map((n, i) => ({ id: i + 1, value: n, order: i + 1 }))

function App() {
  const [itemList, setItemList] = useState<Item[]>(() => generateArray(10));
  const [currentItem, setCurrentItem] = useState<Item>();
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(
      [...itemList].sort((a, b) => a.order - b.order).map(x => '' + x.value).join('') ===
      [...itemList].sort((a, b) => a.value - b.value).map(x => '' + x.value).join('')
    )
  });

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    (e.target as HTMLDivElement).style.background = "hsla(90,75%,75%,0.95)";
    (e.target as HTMLDivElement).style.cursor = "grabbing";
    setCurrentItem(item)
    e.dataTransfer.effectAllowed = "move";
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).style.background = "#fff"
  }

  const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLDivElement).style.cursor = ""
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLDivElement).style.background = "hsl(360,85%,90%)"
  }

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.dropEffect = "copy"
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, item: Item) => {
    e.preventDefault();
    (e.target as HTMLDivElement).style.background = "#fff"
    setItemList(itemList.map(listItem => {
      if (listItem.id === item.id) {
        return { ...listItem, order: currentItem!.order }
      }
      if (listItem.id === currentItem!.id) {
        return { ...listItem, order: item.order }
      }
      return listItem
    }))
  }

  return (
    <div className="app">
      Sort the list in ascending order using drag-and-drop
      <div className="items">
        {[...itemList].sort((a, b) => a.order - b.order).map(item =>
          <div
            className={done ? "item done" : "item"}
            key={item.id}
            draggable={!done}
            onDragStart={(e) => onDragStart(e, item)}
            onDragLeave={(e) => onDragLeave(e)}
            onDragEnd={(e) => onDragEnd(e)}
            onDragOver={(e) => onDragOver(e)}
            onDragEnter={(e) => onDragEnter(e)}
            onDrop={(e) => onDrop(e, item)}
          >{item.value}</div>
        )}
      </div>
      <button onClick={() => setItemList(generateArray(10))} disabled={!done}>Reset</button>
    </div>
  );
}

export default App;
