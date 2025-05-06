import React from 'react';

interface TermsModalProps {
  showTermsModal: boolean;
  setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TermsModal: React.FC<TermsModalProps> = ({
  showTermsModal,
  setShowTermsModal,
}) => {
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
            <p>
              Al utilizar nuestros servicios, usted acepta los siguientes
              términos y condiciones que rigen el uso de nuestros servicios
              fotográficos.
              {/* Aquí iría el contenido completo de los términos y condiciones */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
