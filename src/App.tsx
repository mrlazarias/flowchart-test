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

const NODE_TYPES = {
  square: Square,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const INITIAL_NODES: Node[] = [];

function App() {
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);

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
          setNodes, // Passando `setNodes` aqui
        },
      },
    ]);
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

      <Toolbar.Root className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border border-zinc-300 px-8 h-20 w-96 overflow-hidden flex justify-between items-center">
        <Toolbar.Button
          onClick={addSquareNode}
          className="bg-violet-500 rounded px-4 py-2 text-white"
        >
          Add Node
        </Toolbar.Button>
      </Toolbar.Root>
    </div>
  );
}

export default App;
