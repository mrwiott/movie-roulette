import styles from './Novedades.module.css'

const ITEMS = [
  {
    tag: 'Próximamente',
    title: 'Póster Edición Anime',
    desc: '48 títulos imprescindibles del anime. Rásca tu camino a través de los clásicos.',
    accent: '#7b68ee',
  },
  {
    tag: 'Nuevo',
    title: 'Póster Series Premium',
    desc: 'Las series que definieron una generación, en formato rascable de lujo.',
    accent: '#C9A84C',
  },
  {
    tag: 'Próximamente',
    title: 'Pack Duo',
    desc: 'Dos pósters, dos experiencias. El regalo perfecto para cinéfilos en pareja.',
    accent: '#c06060',
  },
]

export default function Novedades() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <span className={styles.heroEyebrow}>Novedades</span>
        <h1 className={styles.heroTitle}>Más experiencias<br />en camino</h1>
        <p className={styles.heroSub}>
          Sé el primero en conocer los nuevos lanzamientos y ediciones especiales.
        </p>
      </div>

      <div className={styles.cards}>
        {ITEMS.map((item, i) => (
          <div key={i} className={styles.card} style={{ '--accent': item.accent }}>
            <div className={styles.cardTop}>
              <span className={styles.tag} style={{ color: item.accent, borderColor: item.accent }}>
                {item.tag}
              </span>
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.desc}</p>
            <div className={styles.cardBar} style={{ background: item.accent }} />
          </div>
        ))}
      </div>

      <div className={styles.notify}>
        <p className={styles.notifyText}>¿Quieres saber cuándo lleguen?</p>
        <button className={styles.notifyBtn}>Avísame</button>
      </div>
    </div>
  )
}
