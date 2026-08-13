import styles from '../experiences/page.module.css';
import Image from 'next/image';

export default function ServicesPage() {
  const services = [
    { id: 1, title: 'New Delhi photo session by a Female Photographer', price: '8,500', rating: 5.0, image: 'https://picsum.photos/seed/serv1/400/500' },
    { id: 2, title: 'Makeup artistry by Sukoon', price: '2,000', rating: 5.0, image: 'https://picsum.photos/seed/serv2/400/500' },
    { id: 3, title: 'Historical photo shoot by Madhur', price: '10,000', rating: 4.91, image: 'https://picsum.photos/seed/serv3/400/500' },
    { id: 4, title: 'Strength and mobility sessions by Mayank', price: '1,800', rating: 5.0, image: 'https://picsum.photos/seed/serv4/400/500' },
    { id: 5, title: 'Bridal and party looks by Nirmala', price: '2,500', rating: 5.0, image: 'https://picsum.photos/seed/serv5/400/500' },
    { id: 6, title: 'Occasion ready looks by Happy', price: '4,000', rating: 5.0, image: 'https://picsum.photos/seed/serv6/400/500' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Services in Gurgaon District</h1>
      </div>

      <div className={styles.grid}>
        {services.map((srv) => (
          <div key={srv.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image 
                src={srv.image} 
                alt={srv.title} 
                fill 
                className={styles.image}
              />
              <div className={styles.badge} style={{ top: 12, left: 12, borderRadius: 20 }}>
                Popular
              </div>
            </div>
            <div className={styles.details}>
              <h3 className={styles.cardTitle}>{srv.title}</h3>
              <p className={styles.cardPrice}>From ₹{srv.price} <span className={styles.light}>/ guest</span> · ★ {srv.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
