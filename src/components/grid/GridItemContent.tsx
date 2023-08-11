import React, { ReactNode } from "react";

interface IProps {
  children: ReactNode;
}

export default function GridItemContent(props: IProps) {
  return (
    <div className="flex flex-col">
      <div className="w-full h-12 bg-slate-300 px-4 py-2 flex items-center">
        dir name (12)
      </div>
      <div className="flex-1 px-4 py-2">
        custom {props.children}
      </div>
    </div>
  )
}
