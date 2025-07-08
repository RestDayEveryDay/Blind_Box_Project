import { useState } from 'react';
import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

interface Box {
  name: string;
  description: string;
}

interface DrawResult {
  box: Box;
}

export default function HomePage() {
  const [result, setResult] = useState<DrawResult | null>(null);

  const handleDraw = async () => {
    try {
      const res = await axios.post<DrawResult>(`${backendURL}/api/draw`, {
        userId: 1,
      });
      setResult(res.data);
      alert(`你抽中了：${res.data.box.name}`);
    } catch (error) {
      console.error('抽盒失败:', error);
      alert('抽盒失败，请检查控制台');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">盲盒抽取机</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleDraw}
      >
        抽一个盲盒
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl">你抽到了盲盒：</h2>
          <p>名称：{result.box.name}</p>
          <p>描述：{result.box.description}</p>
        </div>
      )}
    </div>
  );
}
