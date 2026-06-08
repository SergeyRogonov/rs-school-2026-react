import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { type Submission } from '../store/formsSlice';
import { clearRecent } from '../store/formsSlice';

interface CardProps {
  submission: Submission;
}

export default function Card({ submission }: CardProps) {
  const dispatch = useAppDispatch();
  const highlight = submission.recent
    ? 'ring-4 ring-amber-700 shadow-xl animate-pulse'
    : 'ring-1 ring-amber-300 shadow-sm';

  useEffect(() => {
    if (submission.recent) {
      const timer = setTimeout(() => {
        dispatch(clearRecent(submission));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submission.recent, submission, dispatch]);

  return (
    <div
      className={`flex flex-col w-3xs rounded-md p-2 bg-amber-100 transition-all duration-500 ${highlight}`}
    >
      <div className="avatar flex justify-center items-center">
        <img
          className="block w-36 h-36 object-cover rounded-full"
          src={submission.avatar}
          alt="user avatar"
        />
      </div>
      <div className="flex flex-col w-full px-4 py-2 gap-1 text-amber-900">
        <h3 className="capitalize text-amber-700 font-semibold">
          {submission.name}
        </h3>
        <span className="truncate">Email: {submission.email}</span>
        <span>Gender: {submission.gender}</span>
        <span>Age: {submission.age}</span>
        <span>City: {submission.country}</span>
      </div>

      {submission.recent && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 bg-amber-100  rounded-full text-sm font-medium">
            New Submission!
          </span>
        </div>
      )}
    </div>
  );
}
