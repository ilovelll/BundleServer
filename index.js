import Koa from 'koa'
import serve from 'koa-static'
import morgan  from 'koa-morgan'
import fs from 'fs'
import semver from 'semver'

const app = new Koa()
// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(__dirname + '/access.log',
  { flags: 'a' })
// setup the logger
app.use(morgan('combined'))

// static server
app.use(serve(__dirname + '/pkg/'))


function maxVersion(platform, brand) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${__dirname}/pkg/${brand}/${platform}`, (err, files) => {
      if (err) reject(err)
      versions = files.map(file => file.replace(".zip", ""))
      let latest = semver.maxSatisfying(versions, "~0")
      resolve(latest)
    })
  })
}

app.use(async (ctx, next) => {
  if ("/version" == ctx.path && ctx.query.platform && ctx.query.brand) {
    try {
      let latest = await maxVersion(ctx.query.platform, ctx.query.brand)
      ctx.body = { version: latest, path: `${ctx.host}/${ctx.query.brand}/${ctx.query.platform}/${latest}.zip` }
    } catch (error) {
      ctx.response.stauts = 500
      ctx.body = error
    }
  } else {
    ctx.response.stauts = 404
    ctx.body = 'Not Found'
  }
})

app.listen(3000, () => console.log('==== server started 3000 ===='))

export default app