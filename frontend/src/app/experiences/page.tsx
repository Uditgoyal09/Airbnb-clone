import styles from './page.module.css';
import Image from 'next/image';

export default function ExperiencesPage() {
  const experiences = [
    { id: 1, title: 'Carve marble with a third-generation sculptor', location: 'Athens, Greece', price: '6,595', rating: 5.0, image: 'https://picsum.photos/seed/exp1/400/500' },
    { id: 2, title: 'Art Walking Tour in San Miguel de Allende', location: 'San Miguel de Allende, Mexico', price: '3,744', rating: 4.9, image: 'https://picsum.photos/seed/exp2/400/500' },
    { id: 3, title: 'Sky Garden Early Access Ticket with Pastry & Drink', location: 'Greater London, United Kingdom', price: '2,381', rating: 4.8, image: 'https://picsum.photos/seed/exp3/400/500' },
    { id: 4, title: 'Savor Premium Matcha in a tea ceremony in Shibuya', location: 'Shibuya, Japan', price: '3,591', rating: 5.0, image: 'https://picsum.photos/seed/exp4/400/500' },
    { id: 5, title: 'Learn pot painting with natural cochinilla dye', location: 'Los Angeles, United States', price: '4,767', rating: 4.98, image: 'https://picsum.photos/seed/exp5/400/500' },
    { id: 6, title: 'Discover Melbourne\'s acclaimed coffee culture', location: 'West Melbourne, Australia', price: '5,725', rating: 4.97, image: 'https://picsum.photos/seed/exp6/400/500' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Airbnb Originals</h1>
        <p className={styles.subtitle}>Hosted by the world's most interesting people</p>
      </div>

      <div className={styles.grid}>
        {experiences.map((exp) => (
          <div key={exp.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image 
                src={exp.image} 
                alt={exp.title} 
                fill 
                className={styles.image}
              />
              <div className={styles.badge}>
                Original
              </div>
            </div>
            <div className={styles.details}>
              <h3 className={styles.cardTitle}>{exp.title}</h3>
              <p className={styles.cardLocation}>{exp.location}</p>
              <p className={styles.cardPrice}>From ₹{exp.price} <span className={styles.light}>/ guest</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
