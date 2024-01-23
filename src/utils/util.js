import cookies from './util.cookies'

const util = {
    cookies,
}

// 更新标题
util.title = function (titleText) {
    const processTitle = import.meta.env.VITE_APP_TITLE || 'Fairly Music'
    window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

export default util
