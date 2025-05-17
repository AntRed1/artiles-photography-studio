import React, { useEffect, useState } from 'react';
import { getLegalDocuments } from '../services/legalService';

interface PrivacyModalProps {
  showPrivacyModal: boolean;
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({
  showPrivacyModal,
  setShowPrivacyModal,
}) => {
  const [privacyContent, setPrivacyContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const documents = await getLegalDocuments();
        const privacyDoc = documents.find(doc => doc.type === 'PRIVACY');
        if (privacyDoc) {
          setPrivacyContent(privacyDoc.content);
        } else {
          setError('No se encontró la política de privacidad.');
        }
      } catch (err) {
        setError('Error al cargar la política de privacidad.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (showPrivacyModal) {
      void fetchPrivacyPolicy();
    }
  }, [showPrivacyModal]);

  if (!showPrivacyModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Política de Privacidad</h3>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          <div className="prose max-w-none">
            {isLoading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && privacyContent && (
              <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
