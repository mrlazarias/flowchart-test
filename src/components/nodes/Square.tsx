import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import { useEffect, useState } from "react";

export function Square({ data, selected, id }: NodeProps) {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    data.setNodes((nodes: any) =>
      nodes.map((node: any) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    const nodeElement = document.getElementById(`node-${id}`);
    if (nodeElement) observer.observe(nodeElement);

    return () => {
      if (nodeElement) observer.unobserve(nodeElement);
    };
  }, [id]);

  const fontSize = Math.min(dimensions.width, dimensions.height) * 0.1;

  return (
    <div
      id={`node-${id}`}
      className="rounded w-full h-full min-w-[200px] min-h-[200px] relative flex items-center justify-center"
      style={{
        backgroundColor: data.color,
      }}
    >
      <NodeResizer
        minWidth={200}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-w rounded border-blue-400"
      />
      <input
        type="text"
        value={data.label || ""}
        onChange={handleLabelChange}
        className="absolute text-center bg-transparent text-white font-bold outline-none"
        style={{
          fontSize: `${fontSize}px`,
          width: "80%",
        }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="-right-5 w-3 h-3 bg-blue-400/80"
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        className="-left-5 w-3 h-3 bg-blue-400/80"
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        className="-top-5 w-3 h-3 bg-blue-400/80"
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        className="-bottom-5 w-3 h-3 bg-blue-400/80"
      />
    </div>
  );
}
