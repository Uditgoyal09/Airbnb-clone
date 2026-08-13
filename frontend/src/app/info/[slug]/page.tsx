import styles from './page.module.css';

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'info';

  // Simple utility to format slug into Title Case
  // e.g. "help-centre" -> "Help Centre"
  const formatTitle = (slugStr: string) => {
    return slugStr
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const title = formatTitle(slug);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.body}>
          Welcome to the <strong>{title}</strong> page. This is a mockup page designed to replicate the structure and flow of the Airbnb web application.
        </p>
        <p className={styles.body}>
          In a complete production environment, this page would contain detailed articles, forms, or specific resources related to {title}. For this clone, it serves as a functional placeholder to ensure all navigation links in the footer are working perfectly!
        </p>
        
        <div className={styles.placeholderBlocks}>
          <div className={styles.block}></div>
          <div className={styles.block}></div>
          <div className={styles.block}></div>
        </div>
      </div>
    </div>
  );
}
