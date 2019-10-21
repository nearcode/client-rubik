import base from '@/api/admin.js'
import c2c from '@/api/c2c.js'
import ex from '@/api/ex.js'
import wallet from '@/api/wallet.js'
import task from '@/api/task.js'
import robot from '@/api/robot.js'
import games from '@/api/games.js'
import bipay from '@/api/bipay.js'
import mvm from '@/api/mvm.js'
import lock from '@/api/lock.js'
import risk from '@/api/risk.js'
let content=[]
let menuArr = content.concat(base.init(),c2c.init(),ex.init(),wallet.init(),task.init(),robot.init(),games.init(),bipay.init(),mvm.init(),lock.init(),risk.init())
export default menuArr
