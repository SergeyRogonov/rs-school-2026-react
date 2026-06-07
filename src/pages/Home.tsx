import { useState } from 'react';
import Modal from '../components/Modal';
import UncontrolledForm from '../components/UncontrolledForm';
import ReactHookForm from '../components/ReactHookForm';

export default function Home() {
  const [variant, setVariant] = useState<null | 'uncontrolled' | 'rhf'>(null);

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="/" className="text-xl font-semibold">
                React Forms
              </a>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  onClick={() => setVariant('uncontrolled')}
                >
                  Uncontrolled Form
                </button>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  onClick={() => setVariant('rhf')}
                >
                  React Hook Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {(variant === 'uncontrolled' && (
        <Modal onClose={() => setVariant(null)}>
          <UncontrolledForm />
        </Modal>
      )) ||
        (variant === 'rhf' && (
          <Modal onClose={() => setVariant(null)}>
            <ReactHookForm />
          </Modal>
        ))}
    </>
  );
}
