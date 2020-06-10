export function getSpanWidth(str) {
    var width = 0;
    var html = document.createElement('span');
    html.innerText = str;
    html.className = 'getTextWidth';
    document.querySelector('body').appendChild(html);
    width = document.querySelector('.getTextWidth').offsetWidth;
    document.querySelector('.getTextWidth').remove();
    return width;
}