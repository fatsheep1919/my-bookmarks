import React, { ReactNode } from "react";

import { BookMarkTreeNode } from "../../types";

interface IProps {
  data?: BookMarkTreeNode;
}

export default function GridItemContent(props: IProps) {
  const { data } = props;
  console.log('GridItem data:', data)

  return (
    <div className="flex flex-col">
      <div className="w-full h-12 bg-slate-300 px-4 py-2 flex items-center cursor-move">
        dir name (12)
      </div>
      <div className="flex-1 px-4 py-2">
        {data?.children?.map(it => (
          <div key={it.id}>{it.name}</div>
        ))}
      </div>
    </div>
  )
}
