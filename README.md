# 🔍 Pathfinding Visualizer

An interactive web application that visualizes popular pathfinding algorithms in real-time. Watch how different algorithms explore a grid to find the shortest path between two points.

## ✨ Features

- **Interactive Grid**: Click and drag to create walls, move start/end points
- **Multiple Algorithms**: Compare different pathfinding strategies
- **Real-time Visualization**: See algorithms in action step-by-step
- **Maze Generation**: Generate random mazes to test algorithms
- **Responsive Design**: Works on desktop and mobile devices
- **Algorithm Statistics**: View performance metrics after each run

## 🚀 Algorithms Implemented

### Pathfinding Algorithms
- **Breadth-First Search (BFS)** - Guarantees shortest path (unweighted)
- **Depth-First Search (DFS)** - Does not guarantee shortest path
- **Dijkstra's Algorithm** - Guarantees shortest path (weighted)
- **A* Algorithm** - Optimal with heuristic function

### Maze Generation Algorithms
- **Binary Tree** - Simple maze generation
- **Randomized Prim's** - Creates more organic mazes
- **Recursive Division** - Divides space recursively

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API
- **Animation**: Custom animation engine with requestAnimationFrame

## 🎮 How to Use

1. **Set Start & End Points**: Drag the 🎯 (start) and 🏁 (end) nodes
2. **Draw Walls**: Click and drag on empty cells to create walls 🧱
3. **Select Algorithm**: Choose from BFS, DFS, Dijkstra, or A*
4. **Adjust Speed**: Set visualization speed (slow/medium/fast)
5. **Run Algorithm**: Click "Run" to start the visualization
6. **Generate Maze**: Use maze generators for complex layouts

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pf-viz
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📱 Controls

- **Click & Drag**: Draw walls on the grid
- **Drag Nodes**: Move start (🎯) and end (🏁) points
- **Run Button**: Start algorithm visualization
- **Reset Button**: Clear the grid and reset
- **Clear Walls**: Remove all walls from grid
- **Clear Path**: Remove the found path only

## 📊 Algorithm Comparison

| Algorithm | Guarantees Shortest Path | Time Complexity | Space Complexity |
|-----------|-------------------------|-----------------|------------------|
| BFS       | ✅ (unweighted)         | O(V + E)        | O(V)             |
| DFS       | ❌                      | O(V + E)        | O(V)             |
| Dijkstra  | ✅ (weighted)           | O(V²)           | O(V)             |
| A*        | ✅ (with admissible h)  | O(b^d)          | O(b^d)           |

## 🎨 Visual Legend

- 🎯 **Start Node** - Algorithm starting point
- 🏁 **End Node** - Target destination
- 🧱 **Wall** - Impassable obstacle
- 🟦 **Visited** - Explored by algorithm
- ✨ **Path** - Shortest path found
- ⬜ **Empty** - Unvisited cell

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Made by Kartik**

---

⭐ Star this repository if you found it helpful!