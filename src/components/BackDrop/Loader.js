import React from 'react'
import styles from './Loader.module.css'
import { loadTxt } from '../../constants'

const Loader = () => {
    return (
      <div className={styles.main}>
        <div className={styles.box}>
          <div className={styles.spinner}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className={styles.bounce3}></div>
          </div>
          <div className={styles.text}>{loadTxt[Math.floor(Math.random() * loadTxt.length)]}</div>
        </div>
      </div>
    )
}
export default Loader;