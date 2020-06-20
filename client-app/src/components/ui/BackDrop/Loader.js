import React from 'react'
import styles from './Loader.module.css'
import { loadTxt } from '../../../constants'

const Loader = () => {
    return (
      <div className={styles.loader}>
          <span>{loadTxt[Math.floor(Math.random() * loadTxt.length)]}</span>
      </div>
    )
}
export default Loader;