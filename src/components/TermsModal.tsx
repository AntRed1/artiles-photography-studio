import React, { useEffect, useState } from 'react';
import { getLegalDocuments } from '../services/legalService';

interface TermsModalProps {
  showTermsModal: boolean;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TermsModal: React.FC<TermsModalProps> = ({
  showTermsModal,
  setShowTermsModal,
}) => {
  const [termsContent, setTermsContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const documents = await getLegalDocuments();
        const termsDoc = documents.find(doc => doc.type === 'TERMS');
        if (termsDoc) {
          setTermsContent(termsDoc.content);
        } else {
          setError('No se encontraron los términos y condiciones.');
        }
      } catch (err) {
        setError('Error al cargar los términos y condiciones.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (showTermsModal) {
      void fetchTerms();
    }
  }, [showTermsModal]);

  if (!showTermsModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Términos y Condiciones</h3>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
          </div>
          <div className="prose max-w-none">
            {isLoading && <p>Cargando...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && termsContent && (
              <div dangerouslySetInnerHTML={{ __html: termsContent }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
