import React, { useState, useEffect } from 'react';
import { getLegalDocuments } from '../services/legalService';
import { Legal } from '../types';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [privacyContent, setPrivacyContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyContent = async () => {
      try {
        const documents = await getLegalDocuments();
        const privacyDoc = documents.find(doc => doc.type === 'PRIVACY');
        setPrivacyContent(privacyDoc?.content || 'No se encontró la política de privacidad');
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la política de privacidad');
        setLoading(false);
      }
    };

    if (isOpen) {
      void fetchPrivacyContent();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Política de Privacidad</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <i className="fas fa-times"></i>
          </button>
        </div>
        {loading ? (
          <div>Cargando...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div className="prose" dangerouslySetInnerHTML={{ __html: privacyContent }} />
        )}
      </div>
    </div>
  );
};

export default PrivacyModal;