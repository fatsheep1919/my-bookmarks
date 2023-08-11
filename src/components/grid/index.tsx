import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import GridItemContent from "./GridItemContent";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Grid() {
  const layout: Layout[] = [
    { i: "a", x: 0, y: 0, w: 2, h: 2 },
    { i: "b", x: 2, y: 0, w: 2, h: 2 },
    { i: "c", x: 4, y: 0, w: 2, h: 2 }
  ];
  return (
    <div className='my-2 bg-slate-100'>
      <ResponsiveGridLayout
        cols={{
          lg: 6,
          md: 6,
        }}
        layouts={{
          lg: layout
        }}
      >
        {layout.map((item) => (
          <div key={item.i} className='border border-solid bg-white rounded-lg shadow-md'>
            <GridItemContent>{item.i}</GridItemContent>
          </div>
          
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}