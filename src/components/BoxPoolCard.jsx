import { useState } from 'react';
import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const BoxPoolCard = ({ id, name, imageUrl }) => {
  const [result, setResult] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDraw = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/boxes/draw`, {
        userId: 1,
        poolId: id
      });

      setResult(res.data.box);
      setShow(true);
    } catch (err) {
      alert('抽盒失败，请稍后再试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <img src={imageUrl} alt={name} className="w-full h-32 object-cover rounded mb-2" />
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <button
        onClick={handleDraw}
        disabled={loading}
        className="w-full bg-purple-400 hover:bg-purple-500 text-white font-medium py-2 rounded transition"
      >
        {loading ? '正在抽取中...' : '抽这个系列'}
      </button>

      {/* 弹窗 */}
      {show && result && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 relative">
            <h4 className="text-xl font-bold mb-2 text-purple-800">🎉 抽中了！</h4>
            <p className="text-gray-800">名称：{result.name}</p>
            <p className="text-gray-600">描述：{result.description}</p>
            <button
              onClick={() => setShow(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxPoolCard;
