import { useEffect, useState } from 'react';
import axios from 'axios';

interface Box {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

const backendURL = import.meta.env.VITE_BACKEND_URL;

function BoxListPage() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/boxes`);
        setBoxes(res.data.boxes || []);
      } catch (error) {
        console.error('获取盲盒列表失败：', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoxes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">盲盒列表</h1>
      {loading ? (
        <p>加载中...</p>
      ) : boxes.length === 0 ? (
        <p>暂无可用的盲盒。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {boxes.map((box) => (
            <div
              key={box.id}
              className="border rounded shadow p-4 bg-white hover:shadow-md transition"
            >
              <img
                src={box.imageUrl}
                alt={box.name}
                className="w-full h-48 object-cover mb-2 rounded"
              />
              <h2 className="text-lg font-semibold">{box.name}</h2>
              <p className="text-gray-600 text-sm">{box.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BoxListPage;
