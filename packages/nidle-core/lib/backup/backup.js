import p from 'path'
import fs from 'fs'
import { compress, decompress, mkdir } from './util'
const cFileExtname = '.tar.gz'

class Backup {
  // options = { name: '', backup: {}, cache: {}, path }
  constructor(options) {
    this.options = options
    mkdir(options.source)
    mkdir(options.path)
    mkdir(options.backup.path)
  }

  /**
   * 备份 - 只用于生产环境
   * 从缓存备份
   * @returns Promise
   */
  backup() {
    const { name, backup, path } = this.options

    return new Promise((resolve, reject) => {
      compress(path, backup.path, false, cFileExtname)
        .then(() => {
          // 备份数量超过限制将删除老文件
          const files = fs.readdirSync(backup.path)
          const backups = files.filter(item => item.indexOf(name) === 0)

          if (backups.length > backup.maxCount) {
            const rmBackup = backups.sort().shift()
            fs.rmSync(p.resolve(backup.path, rmBackup))
          }

          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * 回滚 - 只用于生产环境
   * 只负责将备份还原到目标目录
   * @returns Promise
   */
  rollback() {
    const { backup, path } = this.options
    const basename = p.basename(path)

    return decompress(`${p.resolve(backup.path, basename)}${cFileExtname}`, path, false)
  }

  /**
   * 缓存 - 缓存阶段、非生产环境集成，用于重试、下一环境集成
   * @param {Boolean} isRemove 是否移除源文件，只有最后一个阶段才移除源文件
   * @returns Promise
   */
  cache(isRemove = false) {
    const { cache, path } = this.options

    return compress(path, cache.path, isRemove, cFileExtname)
  }

  /**
   * 还原 - 重试时还原上阶段集成，下一环境集成时还原上一环境集成
   * @returns Promise
   */
  restore() {
    const { cache, path } = this.options
    const basename = p.basename(path)

    return decompress(`${p.resolve(cache.path, basename)}${cFileExtname}`, path, false)
  }
}

export default Backup
