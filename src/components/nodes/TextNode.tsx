import { NodeProps, Handle, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Edit2, Trash2, Palette, Check } from "lucide-react";

export function TextNode({ data, id }: NodeProps) {
  const { setNodes, setEdges } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label);
  const [tempColor, setTempColor] = useState(data.color || "#000000");

  const handleLabelChange = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: tempLabel } }
          : node
      )
    );
    setIsOpen(false);
  };

  const handleColorChange = (color: string) => {
    setTempColor(color);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, color } } : node
      )
    );
  };

  const handleDeleteNode = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
    setIsOpen(false);
  };

  return (
    <div
      className="relative group"
      style={{
        display: "inline-block",
        fontSize: "16px",
        fontWeight: "bold",
        color: data.color || "black",
        cursor: "default",
      }}
    >
      {/* Handles para conexões */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="w-3 h-3 bg-blue-500 opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-3 h-3 bg-blue-500 opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 bg-blue-500 opacity-0 group-hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 bg-blue-500 opacity-0 group-hover:opacity-100"
      />

      {/* Texto e botão em container flex */}
      <div className="flex items-center">
        {/* Texto do Node */}
        <span>{data.label || "Texto"}</span>

        {/* Botão de edição sempre à direita */}
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger asChild>
            <button
              className="ml-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
              style={{ position: "relative" }}
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
          </Popover.Trigger>

          <Popover.Content className="rounded-lg shadow-lg bg-white p-2 w-64">
            {/* Editar Texto */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Editar Texto
              </label>
              <input
                type="text"
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                className="w-full border rounded px-2 py-1 mt-1 text-sm"
              />
            </div>

            {/* Seletor de Cor */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Cor do Texto
              </label>
              <div className="mt-2 grid grid-cols-7 gap-1">
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
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={handleDeleteNode}
                className="text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded"
              >
                <Trash2 className="inline w-4 h-4 mr-1" />
                Excluir
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-600 text-sm px-2 py-1 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleLabelChange}
                className="text-green-600 text-sm px-2 py-1 hover:bg-green-50 rounded"
              >
                <Check className="inline w-4 h-4 mr-1" />
                Confirmar
              </button>
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
}
