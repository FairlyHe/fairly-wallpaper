import { merge } from 'lodash'
import Cookies from 'js-cookie'
import pkg from '../../package.json'

const cookies = {}

cookies.set = function (name = 'default', value = '', cookieSetting = {}) {
    const currentCookieSetting = {
        expires: 1
    }
    merge(currentCookieSetting, cookieSetting)
    Cookies.set(`fairly-${pkg.version}-${name}`, value, currentCookieSetting)
}

cookies.get = function (name = 'default') {
    return Cookies.get(`fairly-${pkg.version}-${name}`)
}

cookies.getAll = function () {
    return Cookies.get()
}

cookies.remove = function (name = 'default') {
    return Cookies.remove(`fairly-${pkg.version}-${name}`)
}


export default cookies
