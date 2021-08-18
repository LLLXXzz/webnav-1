const $siteList = $('.siteList')
const $lastLi = $siteList.find('.lastLi')
let n
// 利用数组哈希表的方式来保存  不然新增的页面无法保存 刷新就没了
//从本地存储提取
const x = localStorage.getItem('x')
//将字符串转成对象
const xObject = JSON.parse(x)
//第一次xObject如果是空的话 就存入默认的
const hasMap = xObject || [
    { logo: 'B', logoType: 'image', url: 'https://www.bilibili.com' },
    { logo: 'Z', logoType: 'image', url: 'https://www.zhihu.com' },
    { logo: 'A', url: 'https://iqiyi.com' },
    { logo: 'A', logoType: 'Text', url: 'https://www.acfun.cn' },
]
//replace('searchValue','replaceValue') 替换为空字符串（目的是不显示）
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '')  //删除 /开头的所有内容
}
// 遍历哈希 每一项为node 并生成div添加到页面中（可以替代HTML） (添加在新增页面之前)
//封装到了render函数 渲染时就可以调用
const render = () => {
    // 增加新的div后再次渲染hasMap 把之前的有的删除点 不然会出现两次
    // 找到已有的每一个li 除了最后一个
    $siteList.find('li:not(.lastLi)').remove()
    hasMap.forEach((node, index) => {
        const $li = $(`<li>
        <div class="site">
            <div class="siteLogo">${node.logo[0]}</div>
            <div class="siteLink">${simplifyUrl(node.url)}</div>
            <div class='siteClose'>
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-close"></use>
                 </svg>
            </div>
        </div>
 </li>`).insertBefore($lastLi)
        //点击打开新的页面 替代a标签
        $li.on('click', () => {
            window.open(node.url)
        })
        //删
        $li.on('click', '.siteClose', (e) => {
            e.stopPropagation() // 阻止冒泡
            hasMap.splice(index, 1)
            render()
        })
    })
}


//一开始加载hasMap
render();

//使用jquery监听button
$('.addButton')
    .on('click', () => {
        let url = window.prompt('请问你要添加地网址是啥？')
        //    判断用户输入地url是不是https开头，如果不是自动加上
        if (url.indexOf('https') !== 0) {
            url = 'https://' + url
        }
        hasMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(),
            url: url,
        });
        render()
        //新增后直接打开页面
        // window.open(url)  
    })

//用户关闭页面之前 把哈希表存到Local Storage(本地存储)
window.onbeforeunload = () => {
    //Local Storage只能存字符串 对象转成字符串
    const string = JSON.stringify(hasMap)
    // localStorage是全局变量 可以省略window.localStorage
    // 保存 setItem(key,value) key随便写
    localStorage.setItem('x', string)
}
//键盘导航
// document.addEventListener.....也可以
$(document).on('keypress', (e) => {
    const key = e.key
    for (let i = 0; i < hasMap.length; i++) {
        if (hasMap[i].logo.toLowerCase() === key) {
            window.open(hasMap[i].url)
        }
    }
})