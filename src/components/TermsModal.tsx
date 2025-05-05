import React, { useState, useEffect } from 'react';
import { getLegalDocuments } from '../services/legalService';
import { Legal } from '../types';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [termsContent, setTermsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTermsContent = async () => {
      try {
        const documents = await getLegalDocuments();
        const termsDoc = documents.find(doc => doc.type === 'TERMS');
        setTermsContent(termsDoc?.content || 'No se encontraron los términos y condiciones');
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los términos y condiciones');
        setLoading(false);
      }
    };

    if (isOpen) {
      void fetchTermsContent();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <i className="fas fa-times"></i>
          </button>
        </div>
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="prose" dangerouslySetInnerHTML={{ __html: termsContent }} />
        )}
      </div>
    </div>
  );
};

export default TermsModal;