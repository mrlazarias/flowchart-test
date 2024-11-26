import {
  NodeProps,
  Handle,
  Position,
  NodeResizer,
  useReactFlow,
} from "@xyflow/react";
import { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Settings2, Trash2, Edit2, Unlink, Palette } from "lucide-react";
import { HexColorPicker } from "react-colorpicker";

export function Square({ data, selected, id }: NodeProps) {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setNodes, getEdges, setEdges } = useReactFlow();

  const handleLabelChange = (newLabel: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const handleDeleteNode = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    // Também remove todas as edges conectadas a este node
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
    setIsOpen(false);
  };

  const handleDeleteConnections = () => {
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
    setIsOpen(false);
  };

  const handleColorChange = (newColor: string) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, color: newColor } }
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

  const handles = [
    { id: "right", position: Position.Right, type: "source" },
    { id: "left", position: Position.Left, type: "target" },
    { id: "top", position: Position.Top, type: "target" },
    { id: "bottom", position: Position.Bottom, type: "source" },
  ];

  return (
    <div
      id={`node-${id}`}
      className="rounded w-full h-full min-w-[200px] min-h-[200px] relative flex flex-col items-center justify-center shadow-lg"
      style={{
        backgroundColor: data.color,
      }}
    >
      <NodeResizer
        minWidth={200}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
      />

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className="absolute top-2 right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
            <Settings2 className="w-4 h-4 text-white" />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="rounded-lg shadow-lg bg-white p-2 w-64 z-50"
            sideOffset={5}
          >
            {/* Editar Nome */}
            <div className="p-2">
              <label className="text-sm font-medium text-gray-700">
                Nome do Node
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={data.label || ""}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  className="flex-1 rounded border border-gray-300 px-3 py-1 text-sm"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Seletor de Cor */}
            <div className="p-2 border-t">
              <label className="text-sm font-medium text-gray-700">
                Cor do Node
              </label>
              <div className="mt-2">
                <div className="grid grid-cols-7 gap-1">
                  {[
                    "#ff0000",
                    "#00ff00",
                    "#0000ff",
                    "#ffff00",
                    "#ff00ff",
                    "#00ffff",
                    "#ff8800",
                    "#88ff00",
                    "#0088ff",
                    "#8800ff",
                    "#ff0088",
                    "#00ff88",
                    "#888888",
                    "#000000",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        handleColorChange(color);
                        setIsOpen(false);
                      }}
                      className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="border-t mt-2 p-2 space-y-1">
              <button
                onClick={handleDeleteConnections}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
              >
                <Unlink className="w-4 h-4" />
                Remover conexões
              </button>

              <button
                onClick={handleDeleteNode}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Excluir node
              </button>
            </div>

            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <span
        className="text-white font-bold text-center break-words px-4"
        style={{
          fontSize: `${fontSize}px`,
          width: "80%",
        }}
      >
        {data.label || "Node"}
      </span>

      {/* Handles */}
      {handles.map(({ id: handleId, position, type }) => (
        <Handle
          key={handleId}
          id={handleId}
          type={type}
          position={position}
          className={`w-3 h-3 bg-blue-400/80 border-2 border-white/50 ${
            position === Position.Right
              ? "-right-5"
              : position === Position.Left
              ? "-left-5"
              : position === Position.Top
              ? "-top-5"
              : "-bottom-5"
          }`}
        />
      ))}

      {handles.map(({ id: handleId, position, type }) => (
        <Handle
          key={`${handleId}-opposite`}
          id={`${handleId}-opposite`}
          type={type === "source" ? "target" : "source"}
          position={position}
          className={`w-3 h-3 bg-blue-400/80 border-2 border-white/50 ${
            position === Position.Right
              ? "-right-5"
              : position === Position.Left
              ? "-left-5"
              : position === Position.Top
              ? "-top-5"
              : "-bottom-5"
          }`}
        />
      ))}
    </div>
  );
}

export default Square;
