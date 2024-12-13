import {
  ReactFlow,
  Background,
  Controls,
  Node,
  ConnectionMode,
  Connection,
  useEdgesState,
  addEdge,
  useNodesState,
} from "@xyflow/react";
import * as Toolbar from "@radix-ui/react-toolbar";
import { zinc } from "tailwindcss/colors";
import "@xyflow/react/dist/style.css";
import { Square } from "./components/nodes/Square";
import { useCallback } from "react";
import DefaultEdge from "./components/edges/DefaultEdge";
import { TextNode } from "./components/nodes/TextNode";

const NODE_TYPES = {
  square: Square,
  text: TextNode,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const SIPOC_INITIAL_NODES = [
  {
    id: "suppliers",
    type: "square",
    position: { x: 100, y: 200 },
    data: {
      label: "Suppliers",
      color: "#4FD1C5",
    },
  },
  {
    id: "inputs",
    type: "square",
    position: { x: 400, y: 200 },
    data: {
      label: "Inputs",
      color: "#F6AD55",
    },
  },
  {
    id: "process",
    type: "square",
    position: { x: 700, y: 200 },
    data: {
      label: "Process",
      color: "#90CDF4",
    },
  },
  {
    id: "outputs",
    type: "square",
    position: { x: 1000, y: 200 },
    data: {
      label: "Outputs",
      color: "#FEB2B2",
    },
  },
  {
    id: "customers",
    type: "square",
    position: { x: 1300, y: 200 },
    data: {
      label: "Customers",
      color: "#B794F4",
    },
  },
];

const SIPOC_INITIAL_EDGES = [
  {
    id: "suppliers-inputs",
    source: "suppliers",
    target: "inputs",
    type: "default",
  },
  {
    id: "inputs-process",
    source: "inputs",
    target: "process",
    type: "default",
  },
  {
    id: "process-outputs",
    source: "process",
    target: "outputs",
    type: "default",
  },
  {
    id: "outputs-customers",
    source: "outputs",
    target: "customers",
    type: "default",
  },
];

function App() {
  const [edges, setEdges, onEdgesChange] = useEdgesState(SIPOC_INITIAL_EDGES);
  const [nodes, setNodes, onNodesChange] = useNodesState(SIPOC_INITIAL_NODES);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source !== connection.target) {
      setEdges((edges) => addEdge(connection, edges));
    }
  }, []);

  function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function addSquareNode() {
    setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: "square",
        position: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          label: `Node ${nodes.length + 1}`,
          color: generateRandomColor(),
          setNodes,
        },
      },
    ]);
  }

  function addTextNode() {
    setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: "text",
        position: {
          x: Math.random() * 800 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          label: "Novo Texto",
          color: "#000000", // Cor inicial
        },
      },
    ]);
  }

  function saveToJson() {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "flow_data.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function loadFromJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        try {
          const data = JSON.parse(content);
          setNodes(data.nodes || []);
          setEdges(data.edges || []);
        } catch (error) {
          alert("Erro ao carregar o arquivo JSON. Verifique o formato.");
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="w-screen h-screen">
      <ReactFlow
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: "default",
        }}
      >
        <Background gap={12} size={2} color={zinc[200]} />
        <Controls />
      </ReactFlow>

      <Toolbar.Root className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-20 w-[36rem] overflow-hidden flex justify-between items-center">
        <Toolbar.Button
          onClick={addSquareNode}
          className="bg-violet-500 rounded px-4 py-2 text-white"
        >
          Add Node
        </Toolbar.Button>
        <Toolbar.Button
          onClick={addTextNode}
          className="bg-blue-500 rounded px-4 py-2 text-white"
        >
          Add Text
        </Toolbar.Button>
        <Toolbar.Button
          onClick={saveToJson}
          className="bg-green-500 rounded px-4 py-2 text-white"
        >
          Save JSON
        </Toolbar.Button>
        <label className="bg-blue-500 rounded px-4 py-2 text-white cursor-pointer">
          Load JSON
          <input
            type="file"
            accept="application/json"
            onChange={loadFromJson}
            className="hidden"
          />
        </label>
      </Toolbar.Root>
    </div>
  );
}

export default App;
