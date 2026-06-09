import { useState } from 'react';
import { useAppSelector } from '../store/hooks';
import Modal from '../components/Modal';
import Card from '../components/Card';
import UncontrolledForm from '../components/UncontrolledForm';
import ReactHookForm from '../components/ReactHookForm';

export default function Home() {
  const [variant, setVariant] = useState<null | 'uncontrolled' | 'rhf'>(null);

  const submissions = useAppSelector((state) => state.forms.submissions);

  return (
    <>
      <div className="flex flex-col w-full min-h-screen gap-10 bg-amber-50">
        <header className="bg-amber-200  shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl text-amber-900 font-semibold">
                  React Forms
                </h1>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm border border-transparent font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    onClick={() => setVariant('uncontrolled')}
                  >
                    Uncontrolled Form
                  </button>
                </div>

                <div className="flex items-center ml-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-2 py-1 text-xs md:px-4 md:py-2 md:text-sm border border-transparent font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    onClick={() => setVariant('rhf')}
                  >
                    React Hook Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center w-full py-2">
          <div className="flex flex-wrap gap-5 w-4/5">
            <div className="w-full">
              <h2 className="text-2xl font-semibold text-amber-900">
                Submissions ({submissions.length})
              </h2>
            </div>
            {submissions.length === 0 ? (
              <div className="flex w-full justify-center py-12 bg-amber-100 rounded-lg shadow">
                <span className="text-amber-900">No submissions yet.</span>
              </div>
            ) : (
              <div className="flex flex-wrap w-full gap-5 justify-center">
                {[...submissions].reverse().map((submission) => (
                  <Card key={submission.id} submission={submission} />
                ))}
              </div>
            )}
          </div>
        </div>

        {(variant === 'uncontrolled' && (
          <Modal title="Uncontrolled Form" onClose={() => setVariant(null)}>
            <UncontrolledForm onDone={() => setVariant(null)} />
          </Modal>
        )) ||
          (variant === 'rhf' && (
            <Modal title="React Hook Form" onClose={() => setVariant(null)}>
              <ReactHookForm onDone={() => setVariant(null)} />
            </Modal>
          ))}
      </div>
    </>
  );
}
