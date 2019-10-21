// import store from 'src/store/index'
import Main from './main.js'
// import config from '@/config'

let product=[];

for (let item of Main) {
    product.push(item.path);
}
export default product
