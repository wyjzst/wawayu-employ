//LocalStorage保存
export function setLS(name, value) {
    localStorage.setItem(name, value)
}
//LocalStorage获取
export function getLS(name) {
    return localStorage[name];
}
//LocalStorage获取
export function delLS(name) {
    localStorage.removeItem(name);
}
