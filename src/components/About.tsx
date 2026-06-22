import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-(--bg-secondary) rounded-lg shadow-(--card-shadow) p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">{t('about.title')}</h2>
        <p className="mb-4">{t('about.description')}</p>
        <p className="mb-4">{t('about.technology')}</p>
      </div>

      <div className="bg-(--bg-secondary) rounded-lg shadow-(--card-shadow) p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {t('about.authorSectionTitle')}
        </h2>
        <p className="mb-4">{t('about.courseDescription')}</p>
        <p className="mb-4">
          <strong>{t('about.courseLabel')}:</strong>{' '}
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
          <strong>{t('about.authorLabel')}:</strong> {t('about.authorName')}
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
