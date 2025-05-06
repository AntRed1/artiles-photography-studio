import React from 'react';

interface PrivacyModalProps {
  showPrivacyModal: boolean;
  setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({
  showPrivacyModal,
  setShowPrivacyModal,
}) => {
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
            <p>
              En Artiles Photography Studio, nos tomamos muy en serio la
              privacidad de nuestros clientes. Esta política describe cómo
              recopilamos, usamos y protegemos su información personal.
              {/* Aquí iría el contenido completo de la política de privacidad */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
