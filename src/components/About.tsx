import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('about');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-(--bg-secondary) rounded-lg shadow-(--card-shadow) p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">{t('title')}</h2>
        <p className="mb-4">{t('description')}</p>
        <p className="mb-4">{t('technology')}</p>
      </div>

      <div className="bg-(--bg-secondary) rounded-lg shadow-(--card-shadow) p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t('authorSectionTitle')}
        </h2>
        <p className="mb-4">{t('courseDescription')}</p>
        <p className="mb-4">
          <strong>{t('courseLabel')}:</strong>{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--brand-header) hover:text-(--text-secondary) underline"
          >
            RS School React Course
          </a>
        </p>
        <p className="mb-4">
          <strong>{t('authorLabel')}:</strong> {t('authorName')}
        </p>
        <p className="mb-4">
          <strong>GitHub:</strong>{' '}
          <a
            href="https://github.com/SergeyRogonov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--brand-header) hover:text-(--text-secondary) underline"
          >
            SergeyRogonov
          </a>
        </p>
      </div>
    </div>
  );
}
