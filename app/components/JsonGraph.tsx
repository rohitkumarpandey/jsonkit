"use client";

import Tree from "react-d3-tree";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

type Props = {
  data: any;
};

function convertToTree(data: any, name = "root"): any {
  if (typeof data !== "object" || data === null) {
    return { name: `${name}: ${data}` };
  }

  if (Array.isArray(data)) {
    return {
      name: `${name} [${data.length}]`,
      children: data.map((item, index) =>
        convertToTree(item, `${index}`)
      ),
    };
  }

  return {
    name: `${name} {${Object.keys(data).length}}`,
    children: Object.keys(data).map((key) =>
      convertToTree(data[key], key)
    ),
  };
}

export default function JsonGraph({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [translate, setTranslate] = useState({ x: 200, y: 200 });

  const [zoom, setZoom] = useState(0.8);
  const [modalZoom, setModalZoom] = useState(0.8); // ✅ separate zoom

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const { width, height } =
      containerRef.current.getBoundingClientRect();

    setTranslate({
      x: width / 4,
      y: height / 2,
    });
  }, [data]);

  if (!data || !mounted) return <div>Loading...</div>;

  const treeData = convertToTree(data);

  // 🔥 open modal with reset zoom
  const openFullscreen = () => {
    setModalZoom(0.8);
    setOpenModal(true);
  };

  return (
    <>
      {/* 🔹 INLINE GRAPH */}
      <div
        ref={containerRef}
        style={{
          width: "50%",
          height: "90vh",
          background: "var(--bg)",
          position: "relative",
          borderLeft: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Controls */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            display: "flex",
            gap: "6px",
          }}
        >
          <button className="graph-btn" onClick={() => setZoom((z) => z + 0.2)}>+</button>
          <button className="graph-btn" onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))}>-</button>
          <button className="graph-btn" onClick={() => setZoom(0.8)}>Reset</button>

          <button
            className="graph-btn"
            onClick={openFullscreen}
          >
            ⛶
          </button>
        </div>

        <Tree
          data={treeData}
          orientation="horizontal"
          pathFunc="elbow"
          translate={translate}
          zoom={zoom}
          zoomable
          draggable
          scaleExtent={{ min: 0.3, max: 2 }}
          nodeSize={{ x: 220, y: 100 }}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
        />
      </div>

      {/* 🔥 MODAL */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: "var(--bg)",
          }}
        >
          {/* Controls */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 50,
              zIndex: 10,
              display: "flex",
              gap: "6px",
            }}
          >
            <button className="graph-btn" onClick={() => setModalZoom((z) => z + 0.2)}>+</button>
            <button className="graph-btn" onClick={() => setModalZoom((z) => Math.max(0.3, z - 0.2))}>-</button>
            <button className="graph-btn" onClick={() => setModalZoom(0.8)}>Reset</button>
          </div>

          <Tree
            data={treeData}
            orientation="horizontal"
            pathFunc="elbow"
            translate={{ x: 400, y: 400 }}
            zoom={modalZoom}
            zoomable
            draggable
            scaleExtent={{ min: 0.3, max: 2 }}
            nodeSize={{ x: 240, y: 110 }}
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
          />
        </div>
      </Modal>
    </>
  );
}