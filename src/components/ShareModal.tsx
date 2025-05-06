import React from 'react';

interface ShareModalProps {
  showShareModal: boolean;
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitComment: (e: React.FormEvent) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  showShareModal,
  setShowShareModal,
  name,
  setName,
  rating,
  setRating,
  comment,
  setComment,
  handleSubmitComment,
}) => {
  if (!showShareModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Comparte tu Experiencia</h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Calificación
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <i
                      className={`fa-solid fa-star ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    ></i>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comentario
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Comparte tu experiencia con nosotros..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Enviar Comentario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
