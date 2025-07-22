import { Db, MongoClient, ServerApiVersion } from 'mongodb'
import { envs } from '~/configs/env.config'
import { initFollowerCollection } from '~/models/schemas/Follower.schema'
import { initRefreshTokenCollection } from '~/models/schemas/RefreshToken.schema'
import { initUserCollection, UserCollection } from '~/models/schemas/User.schema'
import { initVideoCollection } from '~/models/schemas/Video.schema'

class DatabaseConfig {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(
      `mongodb+srv://${envs.DB_USERNAME}:${envs.DB_PASSWORD}@cluster0-liemdev.dfynfof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-LiemDev`,
      {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true
        }
      }
    )
    this.db = this.client.db(envs.DB_NAME)
  }

  async connect() {
    await this.client.connect()
    await this.db.command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  }

  async disconnect() {
    await this.client.close()
    console.log('Disconnected from MongoDB')
  }

  initialCollections() {
    initUserCollection(this.db)
    initRefreshTokenCollection(this.db)
    initFollowerCollection(this.db)
    initVideoCollection(this.db)
  }

  initialIndex() {
    UserCollection.createIndex({ email: 1 }, { unique: true })
    UserCollection.createIndex({ username: 1 }, { unique: true })
  }

  getDb() {
    return this.db
  }
}

const database = new DatabaseConfig()
export default database
